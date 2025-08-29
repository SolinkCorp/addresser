'use strict';

const { PUERTO_RICO_PATTERNS, ADDRESS_PATTERNS, US_STREET_DIRECTIONAL } = require('../constants');
const usStreetTypes = require('../data/us-street-types.json');
const { toTitleCase, createStreetDirectionalString, createStreetTypeRegex } = require('../utils/utils');

/**
 * Helper functions for different parsing sections
 * These can easily be moved to country-specific modules later
 */

/**
 * Parse Puerto Rico street addresses
 */
function parsePuertoRicoStreet(streetString, result) {
  if (streetString.match(PUERTO_RICO_PATTERNS.KM_MARKER)) {
    // Handle addresses that start directly with KM marker: KM 15.1 or KM 15.1 HM 2
    result.addressLine1 = streetString;
    const streetParts = streetString.split(' ');
    result.streetSuffix = 'KM';
    result.streetName = streetParts[1];
    result.streetNumber = streetParts[1];
  } else if (streetString.match(PUERTO_RICO_PATTERNS.HIGHWAY)) {
    // Handle highway with KM marker format: CARR 1 KM 10.3 HM 2 or CARR 1 KM 10.3
    result.addressLine1 = streetString.match(PUERTO_RICO_PATTERNS.HIGHWAY)[0];
    const remainingText = streetString.replace(PUERTO_RICO_PATTERNS.HIGHWAY,"").trim();
    if (remainingText && remainingText.length > 0) {
      result.addressLine2 = remainingText;
    }
    const streetParts = result.addressLine1.split(' ');
    result.streetSuffix = 'CARR';
    result.streetName = streetParts[1];
    result.streetNumber = streetParts[3];
  } else if (streetString.match(PUERTO_RICO_PATTERNS.STREET)) {
    // Handle normal street format for Puerto Rico
    result.addressLine1 = streetString.match(PUERTO_RICO_PATTERNS.STREET)[0];
    const remainingText = streetString.replace(PUERTO_RICO_PATTERNS.STREET,"").trim();
    if (remainingText && remainingText.length > 0) {
      result.addressLine2 = remainingText;
    }
    const streetParts = result.addressLine1.split(' ');
    result.streetNumber = streetParts[0];
    result.streetSuffix = streetParts[1].toUpperCase();
    result.streetName = streetParts.slice(2).join(' ');
    result.addressLine1 = result.streetNumber + ' ' + result.streetSuffix + ' ' + result.streetName;
  }
}

/**
 * Parse US Highway addresses
 */
function parseUSHighway(streetString, result) {
  if (streetString.match(ADDRESS_PATTERNS.US_HIGHWAY)) {
    const usHwyMatch = streetString.match(ADDRESS_PATTERNS.US_HIGHWAY)[0];
    const remainingText = streetString.replace(usHwyMatch, '').trim();
    
    const streetParts = usHwyMatch.split(' ');
    result.streetNumber = streetParts[0];
    result.streetName = streetParts[4];
    result.streetSuffix = streetParts[1] + ' ' + streetParts[2] + ' ' + streetParts[3];
    result.addressLine1 = result.streetNumber + ' ' + result.streetSuffix + ' ' + result.streetName;
    
    if (remainingText && remainingText.length > 0) {
      result.addressLine2 = remainingText;
    }
    return true;
  }
  return false;
}

/**
 * Parse regular Highway addresses
 */
function parseRegularHighway(streetString, result) {
  if (streetString.match(ADDRESS_PATTERNS.HIGHWAY)) {
    const highwayMatch = streetString.match(ADDRESS_PATTERNS.HIGHWAY)[0];
    const remainingText = streetString.replace(highwayMatch, '').trim();
    const streetParts = highwayMatch.split(' ');
    
    if (streetParts.length === 4) {
      result.streetNumber = streetParts[0];
      result.streetName = streetParts[3];
      
      if (streetParts[2].toLowerCase() === 'highway') {
        result.streetSuffix = streetParts[1] + ' Hwy';
        result.addressLine1 = result.streetNumber + ' ' + streetParts[1] + ' ' + streetParts[2] + ' ' + result.streetName;
      } else if (streetParts[2].toLowerCase() === 'hwy') {
        result.streetSuffix = streetParts[1] + ' Hwy';
        result.addressLine1 = result.streetNumber + ' ' + streetParts[1] + ' ' + streetParts[2] + ' ' + result.streetName;
      } else {
        result.streetSuffix = streetParts[2];
        result.addressLine1 = result.streetNumber + ' ' + streetParts[1] + ' ' + result.streetSuffix + ' ' + result.streetName;
      }
    } else if (streetParts.length === 3) {
      result.streetNumber = streetParts[0];
      result.streetName = streetParts[2];
      
      if (streetParts[1].toLowerCase() === 'highway') {
        result.streetSuffix = 'Hwy';
        result.addressLine1 = result.streetNumber + ' ' + streetParts[1] + ' ' + result.streetName;
      } else {
        result.streetSuffix = streetParts[1];
        result.addressLine1 = result.streetNumber + ' ' + result.streetSuffix + ' ' + result.streetName;
      }
    }
    
    // Handle directional suffixes
    if (remainingText && remainingText.length > 0) {
      const directionalMatch = remainingText.match(new RegExp('^(E|W|N|S|East|West|North|South)\\.?$', 'i'));
      if (directionalMatch) {
        const directional = directionalMatch[1].replace(/\.$/, '');
        result.streetSuffix = result.streetSuffix + ' ' + directional;
        result.addressLine1 = result.addressLine1 + ' ' + directional;
      } else if (remainingText !== '.') {
        result.addressLine2 = remainingText;
      }
    }
    return true;
  }
  return false;
}

/**
 * Parse State Route addresses (40015 CA-49, 123 TX-35, etc.)
 */
function parseStateRoute(streetString, result) {
  if (streetString.match(ADDRESS_PATTERNS.STATE_ROUTE)) {
    const stateRouteMatch = streetString.match(ADDRESS_PATTERNS.STATE_ROUTE)[0];
    const remainingText = streetString.replace(stateRouteMatch, '').trim();
    const streetParts = stateRouteMatch.split(' ');
    
    if (streetParts.length >= 2) {
      result.streetNumber = streetParts[0];
      // Handle state route format like "CA-49"
      const routeParts = streetParts[1].split('-');
      if (routeParts.length === 2) {
        result.streetName = routeParts[1]; // The number part (49)
        result.streetSuffix = routeParts[0]; // The state part (CA)
        result.addressLine1 = result.streetNumber + ' ' + streetParts[1]; // "40015 CA-49"
      } else {
        // Fallback if format doesn't match expected pattern
        result.streetName = streetParts[1];
        result.addressLine1 = stateRouteMatch;
      }
    }
    
    // Handle any remaining text as address line 2
    if (remainingText && remainingText.length > 0) {
      result.addressLine2 = remainingText;
    }
    
    return true;
  }
  return false;
}

/**
 * Parse Avenue Letter addresses (826 N Ave C)
 */
function parseAvenueLetter(streetString, result, originalAddress) {
  if (streetString.match(ADDRESS_PATTERNS.AVENUE_LETTER)) {
    result.addressLine1 = streetString.match(ADDRESS_PATTERNS.AVENUE_LETTER)[0];
    const remainingText = streetString.replace(ADDRESS_PATTERNS.AVENUE_LETTER,"").trim();
    
    if (remainingText && remainingText.length > 0) {
      if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
        throw 'Can not parse address. Too many address lines. Input string: ' + originalAddress;
      } else {
        result.addressLine2 = remainingText;
      }
    }
    
    const streetParts = result.addressLine1.split(' ');
    result.streetNumber = streetParts[0];
    
    // Normalize to Ave
    streetParts[streetParts.length-2] = streetParts[streetParts.length-2].replace(/^(ave.?|avenue)$/i, 'Ave');
    
    result.streetName = streetParts[1];
    for (let i = 2; i <= streetParts.length-1; i++) {
      result.streetName = result.streetName + " " + streetParts[i];
    }
    result.streetName = toTitleCase(result.streetName);
    result.addressLine1 = [result.streetNumber, result.streetName].join(" ");
    return true;
  }
  return false;
}

/**
 * Parse PO Box addresses
 */
function parsePOBox(streetString, result) {
  if (streetString.match(ADDRESS_PATTERNS.PO_BOX)) {
    result.addressLine1 = streetString.match(ADDRESS_PATTERNS.PO_BOX)[0];
    return true;
  }
  return false;
}

/**
 * Parse addresses without suffix (123 Texas Gold)
 */
function parseNoSuffix(streetString, result, usLine2String) {
  if (streetString.match(ADDRESS_PATTERNS.NO_SUFFIX)) {
    // Check for line2 prefix followed by unit
    const reLine2 = new RegExp('\\s(' + usLine2String + ')\\.?\\s[a-zA-Z0-9_-]+$','i');
    if (streetString.match(reLine2)) {
      result.addressLine2 = streetString.match(reLine2)[0].trim();
      streetString = streetString.replace(reLine2,"").trim();
    }
    
    result.addressLine1 = streetString.match(ADDRESS_PATTERNS.NO_SUFFIX)[0];
    const streetParts = result.addressLine1.split(' ');
    result.streetNumber = streetParts[0];
    streetParts.shift();
    result.streetName = streetParts.join(' ');
    return true;
  }
  return false;
}

/**
 * Parse regular street addresses
 */
function parseRegularStreet(streetString, result) {
  const usStreetDirectionalString = createStreetDirectionalString(US_STREET_DIRECTIONAL);
  const reStreet = createStreetTypeRegex(usStreetTypes, usStreetDirectionalString);
  if (streetString.match(reStreet)) {
    result.addressLine1 = streetString.match(reStreet)[0];
      streetString = streetString.replace(reStreet,"").trim(); // Carve off the first address line
      
      // Check if the remaining text looks like it's part of the street name (e.g., highway numbers)
      // rather than a separate address line
      if (streetString && streetString.length > 0) {
        // If the remaining text is just a number or looks like highway identification,
        // include it in the street name instead of making it addressLine2
        const remainingText = streetString.trim();
        const isHighwayNumber = ADDRESS_PATTERNS.HIGHWAY_NUMBER.test(remainingText) || ADDRESS_PATTERNS.HIGHWAY_WITH_PREFIX.test(remainingText);
        
        if (isHighwayNumber) {
          // This looks like highway identification, include it in the street name
          result.addressLine1 = result.addressLine1 + ' ' + remainingText;
        } else {
          // Check if line2 data was already parsed
          if (result.hasOwnProperty('addressLine2') && result.addressLine2.length > 0) {
            throw 'Can not parse address. Too many address lines. Input string: ' + streetString;
          } else {
            result.addressLine2 = remainingText;
          }
        }
      }
      
      // Re-split the addressLine1 since we may have modified it
      const streetParts = result.addressLine1.split(' ');
      
      // Check if directional is last element
      const re = new RegExp('.*\\b(?:' + usStreetDirectionalString + ')$', 'i');
      if (result.addressLine1.match(re)) {
        result.streetDirection = streetParts.pop().toUpperCase();
      }
      
      // Assume type is last and number is first   
      result.streetNumber = streetParts[0]; // Assume number is first element
      
      // If there are only 2 street parts (number and name) then its likely missing a "real" suffix and the street name just happened to match a suffix
      if (streetParts.length > 2) {
        // Remove '.' if it follows streetSuffix
        const lastPart = streetParts[streetParts.length-1];
        if (lastPart && typeof lastPart === 'string') {
          streetParts[streetParts.length-1] = lastPart.replace(/\.$/, '');
          const streetTypeKey = streetParts[streetParts.length-1].toLowerCase();
          if (usStreetTypes[streetTypeKey]) {
            result.streetSuffix = toTitleCase(usStreetTypes[streetTypeKey]);
          }
        }
      }
      
      result.streetName = streetParts[1]; // Assume street name is everything in the middle
      for (let i = 2; i < streetParts.length-1; i++) {
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
    return true;
  }
  return false;
}

module.exports = {
  parsePuertoRicoStreet,
  parseUSHighway,
  parseRegularHighway,
  parseStateRoute,
  parseAvenueLetter,
  parsePOBox,
  parseNoSuffix,
  parseRegularStreet
};