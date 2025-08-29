'use strict';

/**
 * Country Detection Module
 * Provides functions to detect and validate countries based on various address components
 */

const {
  COUNTRY_CODES,
  COUNTRY_NAMES,
  COUNTRY_ALIASES,
  CANADIAN_PROVINCES,
  PUERTO_RICO_PATTERNS,
  POSTAL_CODE_PATTERNS
} = require('../constants');

/**
 * Detects country from explicit country section in address
 * @param {string} countrySection - The country section from address parsing
 * @param {string} addressString - Full address string for context
 * @returns {object} - Object with country info and whether section should be removed
 */
function detectFromCountrySection(countrySection, addressString = '') {
  if (!countrySection) {
    return { country: null, shouldRemoveSection: false };
  }

  const upperSection = countrySection.trim().toUpperCase();
  
  // Special handling for "CA" - check if address contains Canadian postal code pattern
  if (upperSection === 'CA' && addressString) {
    if (addressString.match(POSTAL_CODE_PATTERNS.CANADIAN_POSTAL)) {
      return { 
        country: COUNTRY_CODES.CA, 
        shouldRemoveSection: true 
      };
    }
  }
  
  // Check each country's aliases
  for (const [countryCode, aliases] of Object.entries(COUNTRY_ALIASES)) {
    if (aliases.includes(upperSection)) {
      return { 
        country: COUNTRY_CODES[countryCode], 
        shouldRemoveSection: true 
      };
    }
  }
  
  return { country: null, shouldRemoveSection: false };
}

/**
 * Detects country based on state/province abbreviation or name
 * @param {string} stateAbbreviation - Two-letter state/province code
 * @param {string} stateName - Full state/province name
 * @returns {string} - Country code (US, CA, or PR)
 */
function detectFromStateOrProvince(stateAbbreviation, stateName) {
  // Check for Puerto Rico
  if (stateAbbreviation === 'PR' || 
      (stateName && stateName.toLowerCase() === 'puerto rico')) {
    return COUNTRY_CODES.PR;
  }
  
  // Check for Canadian provinces by abbreviation
  if (stateAbbreviation && CANADIAN_PROVINCES.ABBREVIATIONS.includes(stateAbbreviation.toUpperCase())) {
    return COUNTRY_CODES.CA;
  }
  
  // Check for Canadian provinces by name
  if (stateName && CANADIAN_PROVINCES.FULL_NAMES.includes(stateName.toLowerCase())) {
    return COUNTRY_CODES.CA;
  }
  
  // Default to US for other states
  return COUNTRY_CODES.US;
}

/**
 * Detects if a string contains Puerto Rico indicators
 * @param {string} addressString - Address string to check
 * @returns {boolean} - Detection result with regex matches
 */
function detectPuertoRicoInString(addressString) {
  if (!addressString) return false;

  return !!addressString.match(PUERTO_RICO_PATTERNS.DETECTION);
}

/**
 * Gets country information object, defaults to US if no country code is provided
 * @param {string} countryCode - Country code (US, CA, PR)
 * @returns {object} - Country information with name and abbreviation
 */
function getCountryInfo(countryCode) {
  if (!countryCode || !COUNTRY_NAMES[countryCode]) {
    return {
      country: COUNTRY_NAMES[COUNTRY_CODES.US],
      countryAbbreviation: COUNTRY_CODES.US
    };
  }
  
  return {
    country: COUNTRY_NAMES[countryCode],
    countryAbbreviation: countryCode
  };
}

/**
 * Comprehensive country detection from address components with priority order
 * @param {object} options - Detection options
 * @param {string} options.countrySection - Explicit country section
 * @param {string} options.stateAbbreviation - State/province abbreviation  
 * @param {string} options.stateName - State/province full name
 * @param {string} options.addressString - Full address string for pattern matching
 * @returns {object} - Complete country detection result
 */
function detectCountry({ countrySection, stateAbbreviation, stateName, addressString } = {}) {
  let detectionResult = {
    country: COUNTRY_NAMES[COUNTRY_CODES.US],
    countryAbbreviation: COUNTRY_CODES.US,
    shouldRemoveCountrySection: false,
    detectionMethod: 'default_us'
  };

  // Priority 1: Check explicit country section
  const countryResult = detectFromCountrySection(countrySection, addressString);
  if (countryResult.country) {
    detectionResult = {
      ...getCountryInfo(countryResult.country),
      shouldRemoveCountrySection: countryResult.shouldRemoveSection,
      detectionMethod: 'explicit_country'
    };
  }
  
  // Priority 2: Check for Puerto Rico patterns in address string or parts
  if (!countryResult.country) {
    const prResult = detectPuertoRicoInString(addressString);
    if (prResult) {
      detectionResult = {
        ...getCountryInfo(COUNTRY_CODES.PR),
        shouldRemoveCountrySection: false,
        detectionMethod: 'puerto_rico_pattern',
      };
    }
  }
  
  // Priority 3: Detect from state/province if we have valid state info
  if (stateAbbreviation || stateName) {
    const stateCountry = detectFromStateOrProvince(stateAbbreviation, stateName);
    // Always prioritize state/province detection for non-US countries (Canada, Puerto Rico)
    // This handles cases where "CA" suffix is ambiguous between California and Canada
    if (stateCountry !== COUNTRY_CODES.US) {
      detectionResult = {
        ...getCountryInfo(stateCountry),
        shouldRemoveCountrySection: detectionResult.shouldRemoveCountrySection,
        detectionMethod: 'state_province'
      };
    } else if (!countryResult.country) {
      // Only use US state detection if no explicit country was found
      detectionResult = {
        ...getCountryInfo(stateCountry),
        shouldRemoveCountrySection: detectionResult.shouldRemoveCountrySection,
        detectionMethod: 'state_province'
      };
    }
  }
  
  return detectionResult;
}

/**
 * Helper function to check if country is Puerto Rico
 * @param {object} countryInfo - Country info object
 * @returns {boolean} - True if Puerto Rico
 */
function isPR(countryInfo) {
  return countryInfo?.countryAbbreviation === COUNTRY_CODES.PR;
}

module.exports = {
  detectCountry,
  isPR
};