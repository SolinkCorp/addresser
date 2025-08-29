const allStates = require('../data/states.json');
const allCities = require('../data/cities.json');
const prCities = require('../data/pr-cities.json');
const { detectCountry, isPR } = require('./detectCountry');
const { PUERTO_RICO_PATTERNS, PUERTO_RICO_CONSTANTS, POSTAL_CODE_PATTERNS, US_LINE2_PREFIXES } = require('../constants');
const { getKeyByValue, toTitleCase, createLine2PrefixString, handleAddressPart, findCityInList } = require('../utils/utils');
const { parsePuertoRicoStreet, parseUSHighway, parseRegularHighway, parseStateRoute, parseAvenueLetter, parsePOBox, parseNoSuffix, parseRegularStreet } = require('./parserHelpers');

'use strict';

/**
 * Parses a street address
 * @param {string} address
 * @return {string}
 **/

function baseParser(address) {
  // Validate a non-empty string was passed
  if (!address) {
    throw 'Argument must be a non-empty string.';
  }
  const { NAME: puertoRico, ABBREVIATION: puertoRicoAbbreviation } = PUERTO_RICO_CONSTANTS;
  // Deal with any repeated spaces
  address = address.replace(/  +/g, ' ');
  // Assume comma, newline and tab is an intentional delimiter
  const addressParts = address.split(/,|\t|\n/);
  
  const result = {};

  // Detect country early and store for single detection call
  const countrySection = addressParts[addressParts.length-1].trim().toUpperCase();
  
  // Initial country detection to check if we should remove country section
  const initialCountryDetection = detectCountry({ 
    countrySection: countrySection,
    addressString: address 
  });
  if (initialCountryDetection.shouldRemoveCountrySection) {
    addressParts.splice(-1,1);
  }
  
  // Store detected country info here after parsing state/province
  let detectedCountry = null;
  // Assume the last address section contains state, zip or both
  let stateString = addressParts[addressParts.length-1].trim();
  // Parse and remove zip or zip plus 4 from end of string
  // First check for Puerto Rico zip+state patterns
  if (stateString.match(PUERTO_RICO_PATTERNS.ZIP_WITH_PR)) {
    const prMatch = stateString.match(PUERTO_RICO_PATTERNS.ZIP_WITH_PR);
    result.zipCode = prMatch[1];  // zip code
    result.stateAbbreviation = prMatch[2];  // PR
    result.stateName = puertoRico;
    stateString = stateString.replace(PUERTO_RICO_PATTERNS.ZIP_WITH_PR, '').trim();
  } else if (stateString.match(POSTAL_CODE_PATTERNS.US_ZIP)) {
    result.zipCode = stateString.match(POSTAL_CODE_PATTERNS.US_ZIP)[0];
    stateString = stateString.substring(0, stateString.length - 5).trim();
  } else if (stateString.match(POSTAL_CODE_PATTERNS.US_ZIP_PLUS_4)) {
    const zipString = stateString.match(POSTAL_CODE_PATTERNS.US_ZIP_PLUS_4)[0];
    result.zipCode = zipString.substring(0,5);
    result.zipCodePlusFour = zipString;
    stateString = stateString.substring(0, stateString.length - 10).trim();
  } else if(stateString.match(POSTAL_CODE_PATTERNS.CANADIAN_POSTAL)){
    result.zipCode = stateString.match(POSTAL_CODE_PATTERNS.CANADIAN_POSTAL)[0].toUpperCase();
    stateString = stateString.substring(0, stateString.length - result.zipCode.length).trim();
  }
  // Parse and remove state
  if (stateString.length > 0) { // Check if anything is left of last section
    addressParts[addressParts.length-1] = stateString;
  } else {
    addressParts.splice(-1,1);
    stateString = addressParts[addressParts.length-1].trim();
  }
  // Parse state/province abbreviation
  if (stateString.length === 2 && stateString.toUpperCase() === puertoRicoAbbreviation) {
    result.stateAbbreviation = puertoRicoAbbreviation;
    result.stateName = puertoRico;
    stateString = stateString.substring(0, stateString.length - 2);
  } else if (stateString.length === 2 && getKeyByValue(allStates,stateString.toUpperCase())) {
    result.stateAbbreviation = stateString.toUpperCase();
    result.stateName = toTitleCase(getKeyByValue(allStates,stateString.toUpperCase()));
    stateString = stateString.substring(0, stateString.length - 2);
  } else {
    // Next check if the state string ends in state name or abbeviation
    // (state abbreviation must be preceded by a space to ensure accuracy)
    if (stateString.match(PUERTO_RICO_PATTERNS.DETECTION)) {
      result.stateAbbreviation = puertoRicoAbbreviation;
      result.stateName = puertoRico;
      stateString = stateString.replace(PUERTO_RICO_PATTERNS.DETECTION,"");
    } else {
      for (let key in allStates) {
        const re = new RegExp(" " + allStates[key] + "$|" + key + "$", "i");
        if (stateString.match(re)) {
          stateString = stateString.replace(re,"");
          result.stateAbbreviation = allStates[key];
          result.stateName = toTitleCase(key);
          break;
        }
      }
    }
  }
  // Comprehensive country detection passing in parsed state information
  detectedCountry = detectCountry({
    countrySection: countrySection,
    stateAbbreviation: result.stateAbbreviation,
    stateName: result.stateName,
    addressString: address
  });
  
  // Ensure Puerto Rico addresses have proper state information
  if (isPR(detectedCountry) && !result.stateAbbreviation) {
    result.stateAbbreviation = puertoRicoAbbreviation;
    result.stateName = puertoRico;
  }
  
  // Validate that we have a state/province for non-PR addresses
  if ((!result.stateAbbreviation || result.stateAbbreviation.length !== 2)) {
    throw 'Can not parse address. State not found.';
  }

  // Parse and remove city/place name
  let placeString = handleAddressPart(addressParts, stateString);
  result.placeName = "";
 
  // Use appropriate city list based on detected country
  let cityMatchResult;
  if (isPR(detectedCountry)) {
    cityMatchResult = findCityInList(prCities[puertoRicoAbbreviation], placeString);
  } else if (result.stateAbbreviation && allCities[result.stateAbbreviation]) {
    cityMatchResult = findCityInList(allCities[result.stateAbbreviation], placeString);
  }
  
  if (cityMatchResult && cityMatchResult.foundCity) {
    result.placeName = cityMatchResult.foundCity;
    placeString = cityMatchResult.remainingString;
  }
  if (!result.placeName) {
    result.placeName = toTitleCase(placeString);
    placeString = "";
  }
  
  // Parse the street data
  let streetString = "";
  const usLine2String = createLine2PrefixString(US_LINE2_PREFIXES);

  placeString = handleAddressPart(addressParts, placeString);
  
  if (addressParts.length > 2) {
    throw 'Can not parse address. More than two address lines.';
  } else if (addressParts.length === 2) {
    // check if the secondary data is first
    const re = new RegExp('^(' + usLine2String + ')\\b','i');
    if (addressParts[0].match(re)) {
      const tmpString = addressParts[1];
      addressParts[1] = addressParts[0];
      addressParts[0] = tmpString;
    }
    //Assume street line is first
    result.addressLine2 = addressParts[1].trim();
    addressParts.splice(-1,1);
  }
  if (addressParts.length === 1) {
    streetString = addressParts[0].trim();
    // If no address line 2 exists check to see if it is incorrectly placed at the front of line 1
    if (typeof result.addressLine2 === "undefined") {
      const re = new RegExp('^(' + usLine2String + ')\\s\\S+','i');
      if (streetString.match(re)) {
        result.addressLine2 = streetString.match(re)[0];
        streetString = streetString.replace(re,"").trim(); // Carve off the line 2 data
      }
    }

    // Parse Puerto Rico addresses
    if (isPR(detectedCountry)) {
      parsePuertoRicoStreet(streetString, result);
    } 
    // Parse US Highway addresses
    else if (parseUSHighway(streetString, result)) {
      // Parsed successfully
    } 
    // Parse regular Highway addresses  
    else if (parseRegularHighway(streetString, result)) {
      // Parsed successfully
    }
    // Parse State Route addresses (CA-49, TX-35, etc.)
    else if (parseStateRoute(streetString, result)) {
      // Parsed successfully
    } 
    // Parse Avenue Letter addresses
    else if (parseAvenueLetter(streetString, result, address)) {
      // Parsed successfully
    } 
    // Parse PO Box addresses
    else if (parsePOBox(streetString, result)) {
      // Parsed successfully
    }
    // Parse regular street addresses
    else if (parseRegularStreet(streetString, result)) {
      // Parsed successfully
    }
    // Parse addresses without suffix
    else if (parseNoSuffix(streetString, result, usLine2String)) {
      // Parsed successfully
    } else {
      throw 'Can not parse address. Invalid street address data. Input string: ' + address;
    }
  } else {
    throw 'Can not parse address. Invalid street address data. Input string: ' + address;
  }
  
  let addressString = result.addressLine1;
  if (result.hasOwnProperty('addressLine2')) {
    addressString += ', ' + result.addressLine2;
  }

  result.country = detectedCountry.country;
  result.countryAbbreviation = detectedCountry.countryAbbreviation;
  if (addressString && result.hasOwnProperty("placeName") && result.hasOwnProperty("zipCode")) {
    let idString = addressString + ", " + result.placeName;
    if (result.hasOwnProperty("stateAbbreviation")) {
      idString += ", " + result.stateAbbreviation;
    }
    idString += " " + result.zipCode;
    result['formattedAddress'] = idString;
    result['id'] = encodeURI(idString.replace(/ /g, '-').replace(/\#/g, '-').replace(/\//g, '-').replace(/\./g, '-'));
  }
    
  return result;
}

module.exports = {
  baseParser
};
