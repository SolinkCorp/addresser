var allStates = require('./data/states.json');
var usStreetTypes = require('./data/us-street-types.json');
var allCities = require('./data/cities.json');
var usCities = require('./data/us-cities.json');
const prCities = require('./data/pr-cities.json');
const { detectCountry, isPR } = require('./detectCountry');
const { US_STREET_DIRECTIONAL, US_LINE2_PREFIXES, PUERTO_RICO_PATTERNS, POSTAL_CODE_PATTERNS, ADDRESS_PATTERNS } = require('./constants');



'use strict';

/**
 * Parses a street address
 * @param {string} address
 * @return {string}
 **/
 
//TODO move this to utils file
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//returns a random property of a given object
function randomProperty (obj) {
  var keys = Object.keys(obj)
  return keys[ keys.length * Math.random() << 0];
};


module.exports = {
  parseAddress: function(address) {
    // Validate a non-empty string was passed
    if (!address) {
      throw 'Argument must be a non-empty string.';
    }
    const puertoRico = 'Puerto Rico';
    const puertoRicoAbbreviation = "PR";
    // Deal with any repeated spaces
    address = address.replace(/  +/g, ' ');
    // Assume comma, newline and tab is an intentional delimiter
    var addressParts = address.split(/,|\t|\n/);
    
    var result = {};

    // Detect country early and store for single detection call
    var countrySection = addressParts[addressParts.length-1].trim().toUpperCase();
    
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
    var stateString = addressParts[addressParts.length-1].trim();
    // Parse and remove zip or zip plus 4 from end of string
    // First check for Puerto Rico zip+state patterns
    if (stateString.match(PUERTO_RICO_PATTERNS.ZIP_WITH_PR)) {
      var prMatch = stateString.match(PUERTO_RICO_PATTERNS.ZIP_WITH_PR);
      result.zipCode = prMatch[1];  // zip code
      result.stateAbbreviation = prMatch[2];  // PR
      result.stateName = puertoRico;
      stateString = stateString.replace(PUERTO_RICO_PATTERNS.ZIP_WITH_PR, '').trim();
    } else if (stateString.match(POSTAL_CODE_PATTERNS.US_ZIP)) {
      result.zipCode = stateString.match(POSTAL_CODE_PATTERNS.US_ZIP)[0];
      stateString = stateString.substring(0, stateString.length - 5).trim();
    } else if (stateString.match(POSTAL_CODE_PATTERNS.US_ZIP_PLUS_4)) {
      var zipString = stateString.match(POSTAL_CODE_PATTERNS.US_ZIP_PLUS_4)[0];
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
    if (stateString.length == 2 && stateString.toUpperCase() === puertoRicoAbbreviation) {
      result.stateAbbreviation = puertoRicoAbbreviation;
      result.stateName = puertoRico;
      stateString = stateString.substring(0, stateString.length - 2);
    } else if (stateString.length == 2 && getKeyByValue(allStates,stateString.toUpperCase())) {
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
        for (const key in allStates) {
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
    if ((!result.stateAbbreviation || result.stateAbbreviation.length != 2)) {
      throw 'Can not parse address. State not found.';
    }

    // Parse and remove city/place name
    var placeString = "";
    if (stateString.length > 0) { // Check if anything is left of last section
      addressParts[addressParts.length-1] = stateString;
      placeString = addressParts[addressParts.length-1];
    } else {
      addressParts.splice(-1,1);
      placeString = addressParts[addressParts.length-1].trim();
    }
    result.placeName = "";
   
    // Use appropriate city list based on detected country
    if (isPR(detectedCountry)) {
      prCities[puertoRicoAbbreviation].some(function(element) {
        const re = new RegExp(element + "$", "i");
        if (placeString.match(re)) {
          placeString = placeString.replace(re,""); // Carve off the place name
          result.placeName = element;
          return element; // Found - stop looking for cities
        }
      });
    } else if (result.stateAbbreviation && allCities[result.stateAbbreviation]) {
      // Use cities for US states and Canadian provinces
      allCities[result.stateAbbreviation].some(function(element) {
        const re = new RegExp(element + "$", "i");
        if (placeString.match(re)) {
          placeString = placeString.replace(re,""); // Carve off the place name
          result.placeName = element;
          return element; // Found - stop looking for cities
        }
      });
    }
    if (!result.placeName) {
      result.placeName = toTitleCase(placeString);
      placeString = "";
    }
    
    // Parse the street data
    var streetString = "";
    var usStreetDirectionalString = Object.keys(US_STREET_DIRECTIONAL).map(x => US_STREET_DIRECTIONAL[x]).join('|');
    var usLine2String = Object.keys(US_LINE2_PREFIXES).join('|');

    if (placeString.length > 0) { // Check if anything is left of last section
      addressParts[addressParts.length-1] = placeString;
    } else {
      addressParts.splice(-1,1);
    }
    
    if (addressParts.length > 2) {
      throw 'Can not parse address. More than two address lines.';
    } else if (addressParts.length === 2) {
      // check if the secondary data is first
      var re = new RegExp('^(' + usLine2String + ')\\b','i');
      if (addressParts[0].match(re)) {
        var tmpString = addressParts[1];
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
        var re = new RegExp('^(' + usLine2String + ')\\s\\S+','i');
        if (streetString.match(re)) {
          result.addressLine2 = streetString.match(re)[0];
          streetString = streetString.replace(re,"").trim(); // Carve off the line 2 data
        }
      }
      //Assume street address comes first and the rest is secondary address
      var reStreet = new RegExp('\.\*\\b(?:' + 
        Object.keys(usStreetTypes).join('|') + ')\\b\\.?' + 
        '( +(?:' + usStreetDirectionalString + ')\\b)?', 'i');
      var rePO = ADDRESS_PATTERNS.PO_BOX;
      var reAveLetter = ADDRESS_PATTERNS.AVENUE_LETTER;
      var reNoSuffix = ADDRESS_PATTERNS.NO_SUFFIX;
      
      if (isPR(detectedCountry) && streetString.match(PUERTO_RICO_PATTERNS.HIGHWAY)) {
        // Handle highway with KM marker format: CARR 1 KM 10.3 HM 2 or CARR 1 KM 10.3
        result.addressLine1 = streetString.match(PUERTO_RICO_PATTERNS.HIGHWAY)[0];
        streetString = streetString.replace(PUERTO_RICO_PATTERNS.HIGHWAY,"").trim();
        if (streetString && streetString.length > 0) {
          result.addressLine2 = streetString;
        }
        const streetParts = result.addressLine1.split(' ');
        result.streetSuffix = 'CARR';
        result.streetName = streetParts[1]; // Highway number
        result.streetNumber = streetParts[3]; // KM marker
      } else if (isPR(detectedCountry) && streetString.match(PUERTO_RICO_PATTERNS.STREET)) {
        // Handle normal street format for Puerto Rico (no street suffix, technically a street prefix)
        result.addressLine1 = streetString.match(PUERTO_RICO_PATTERNS.STREET)[0];
        streetString = streetString.replace(PUERTO_RICO_PATTERNS.STREET,"").trim();
        if (streetString && streetString.length > 0) {
          result.addressLine2 = streetString;
        }
        const streetParts = result.addressLine1.split(' ');
        result.streetNumber = streetParts[0];
        result.streetSuffix = streetParts[1].toUpperCase();
        result.streetName = streetParts.slice(2).join(' ');
        result.addressLine1 = result.streetNumber + ' ' + result.streetSuffix + ' ' + result.streetName;
      } else if (streetString.match(reAveLetter)) {
        result.addressLine1 = streetString.match(reAveLetter)[0];
        streetString = streetString.replace(reAveLetter,"").trim(); // Carve off the first address line
        if (streetString && streetString.length > 0) {
          // Check if line2 data was already parsed
          if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
            throw 'Can not parse address. Too many address lines. Input string: ' + address;
          } else {
            result.addressLine2 = streetString;
          }
        }
        
        var streetParts = result.addressLine1.split(' ');
    
        // Assume type is last and number is first   
        result.streetNumber = streetParts[0]; // Assume number is first element

        // Normalize to Ave
        streetParts[streetParts.length-2] = streetParts[streetParts.length-2].replace(/^(ave.?|avenue)$/i, 'Ave');

        //result.streetSuffix = toTitleCase(usStreetTypes[streetParts[streetParts.length-1].toLowerCase()]);
        result.streetName = streetParts[1]; // Assume street name is everything in the middle
        for (var i = 2; i <= streetParts.length-1; i++) {
          result.streetName = result.streetName + " " + streetParts[i];
        }
        result.streetName = toTitleCase(result.streetName);
        result.addressLine1 = [result.streetNumber, result.streetName].join(" ");
      } else if (streetString.match(reStreet)) {
        result.addressLine1 = streetString.match(reStreet)[0];
        streetString = streetString.replace(reStreet,"").trim(); // Carve off the first address line
        if (streetString && streetString.length > 0) {
          // Check if line2 data was already parsed
          if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
            throw 'Can not parse address. Too many address lines. Input string: ' + address;
          } else {
            result.addressLine2 = streetString;
          }
        }
        var streetParts = result.addressLine1.split(' ');
    
        // Check if directional is last element
        var re = new RegExp('\.\*\\b(?:' + usStreetDirectionalString + ')$', 'i');
        if (result.addressLine1.match(re)) {
          result.streetDirection = streetParts.pop().toUpperCase();
        }
        
        // Assume type is last and number is first   
        result.streetNumber = streetParts[0]; // Assume number is first element
        
        // If there are only 2 street parts (number and name) then its likely missing a "real" suffix and the street name just happened to match a suffix
        if (streetParts.length > 2) {
          // Remove '.' if it follows streetSuffix
          streetParts[streetParts.length-1] = streetParts[streetParts.length-1].replace(/\.$/, '');
          result.streetSuffix = toTitleCase(usStreetTypes[streetParts[streetParts.length-1].toLowerCase()]);
        }
        
        result.streetName = streetParts[1]; // Assume street name is everything in the middle
        for (var i = 2; i < streetParts.length-1; i++) {
          result.streetName = result.streetName + " " + streetParts[i];
        }
        result.streetName = toTitleCase(result.streetName);
        result.addressLine1 = [result.streetNumber, result.streetName].join(" ");
        
        if (result.hasOwnProperty('streetSuffix')) {
          result.addressLine1 = result.addressLine1 + ' ' + result.streetSuffix;
        }
        if (result.streetDirection) {
          result.addressLine1 = result.addressLine1 + ' ' + result.streetDirection;
        }
      } else if (streetString.match(rePO)) {
        result.addressLine1 = streetString.match(rePO)[0];
        streetString = streetString.replace(rePO,"").trim(); // Carve off the first address line
      } else if (streetString.match(reNoSuffix)) {
        // Check for a line2 prefix followed by a single word. If found peel that off as addressLine2
        var reLine2 = new RegExp('\\s(' + usLine2String + ')\\.?\\s[a-zA-Z0-9_\-]+$','i');
        if (streetString.match(reLine2)) {
          result.addressLine2 = streetString.match(reLine2)[0].trim();
          streetString = streetString.replace(reLine2,"").trim(); // Carve off the first address line
        }
        
        result.addressLine1 = streetString.match(reNoSuffix)[0];
        streetString = streetString.replace(reNoSuffix,"").trim(); // Carve off the first address line
        var streetParts = result.addressLine1.split(' ');
    
        // Assume type is last and number is first   
        result.streetNumber = streetParts[0]; // Assume number is first element
        streetParts.shift(); // Remove the first element
        result.streetName = streetParts.join(' '); // Assume street name is everything else
      } else {
        throw 'Can not parse address. Invalid street address data. Input string: ' + address;
      }
    } else {
      throw 'Can not parse address. Invalid street address data. Input string: ' + address;
    }
    
    var addressString = result.addressLine1;
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
  },

  randomCity: function() {
    var randomState = randomProperty(usCities);
    var randomStateData = usCities[randomState];
    var randomCityElementId = Math.floor(Math.random() * randomStateData.length);
    var randomCity = randomStateData[randomCityElementId];
    return { city: randomCity, state: randomState};
  },

  cities: function() {
    return(usCities);
  }
};
