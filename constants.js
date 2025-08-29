'use strict';

/**
 * Constants and reference data for address parsing
 * Centralized location for all reusable constants
 */

// Country codes and identifiers
const COUNTRY_CODES = {
  US: 'US',
  CA: 'CA',
  PR: 'PR'
};

const COUNTRY_NAMES = {
  [COUNTRY_CODES.US]: 'United States',
  [COUNTRY_CODES.CA]: 'Canada',
  [COUNTRY_CODES.PR]: 'Puerto Rico'
};

// Country aliases for detection
const COUNTRY_ALIASES = {
  US: ['US', 'USA', 'UNITED STATES'],
  CA: ['CAN', 'CANADA'], // Note: CA excluded to avoid confusion with California
  PR: ['PR', 'PUERTO RICO']
};

// Canadian provinces and territories
const CANADIAN_PROVINCES = {
  ABBREVIATIONS: ['AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'],
  FULL_NAMES: [
    'alberta',
    'british columbia', 
    'manitoba',
    'new brunswick',
    'newfoundland and labrador',
    'nova scotia',
    'northwest territories',
    'nunavut',
    'ontario',
    'prince edward island',
    'quebec',
    'saskatchewan',
    'yukon'
  ]
};

// US Street directionals
const US_STREET_DIRECTIONAL = {
  'north': 'N',
  'northeast': 'NE',
  'east': 'E',
  'southeast': 'SE',
  'south': 'S',
  'southwest': 'SW',
  'west': 'W',
  'northwest': 'NW'
};

// US Address Line 2 prefixes
const US_LINE2_PREFIXES = {
  'APARTMENT': 'APT',
  'APT': 'APT',
  'BASEMENT': 'BSMT',
  'BSMT': 'BSMT',
  'BLDG': 'BLDG',
  'BUILDING': 'BLDG',
  'DEPARTMENT': 'DEPT',
  'DEPT': 'DEPT',
  'FL': 'FL',
  'FLOOR': 'FL',
  'FRNT': 'FRNT',
  'FRONT': 'FRNT',
  'HANGAR': 'HNGR',
  'HNGR': 'HNGR',
  'LBBY': 'LBBY',
  'LOBBY': 'LBBY',
  'LOT': 'LOT',
  'LOWER': 'LOWR',
  'LOWR': 'LOWER',
  'OFC': 'OFC',
  'OFFICE': 'OFC',
  'PENTHOUSE': 'PH',
  'PH': 'PH',
  'PIER': 'PIER',
  'REAR': 'REAR',
  'RM': 'RM',
  'ROOM': 'RM',
  'SIDE': 'SIDE',
  'SLIP': 'SLIP',
  'SPACE': 'SPC',
  'SPC': 'SPC',
  'STE': 'STE',
  'STOP': 'STOP',
  'SUITE': 'STE',
  'TRAILER': 'TRLR',
  'TRLR': 'TRLR',
  'UNIT': 'UNIT',
  'UPPER': 'UPPR',
  'UPPR': 'UPPR',
  '#': '#'
};

// Puerto Rico specific patterns
const PUERTO_RICO_PATTERNS = {
  STREET: /\b\d+\s+(calle|avenida|cam|camino|paseo|plaza|callejon)\s+[a-zA-Z0-9_ ]+/i,
  HIGHWAY: /\bcarr\s+\d+\s+km\s+[\d\.]+(?:\s+hm\s+\d+)?/i,
  // Pattern for addresses that start directly with KM (kilometer marker) without CARR prefix
  KM_MARKER: /^(?!.*\bcarr\b).*\bkm\s+[\d\.]+(?:\s+hm\s+\d+)?/i,
  // Pattern for detecting Puerto Rico in strings - handles various zip+state formats
  DETECTION: / PR$|PR$| PUERTO RICO$|PUERTO RICO$|\b\d{5},?\s+PR\b|\bPR\s+\d{5},?\s+PR\b/i,
  // Pattern specifically for zip code extraction with PR as country
  ZIP_WITH_PR: /\b(\d{5}),?\s+(PR)\b/i,
};

// Postal code patterns
const POSTAL_CODE_PATTERNS = {
  US_ZIP: /\d{5}$/,
  US_ZIP_PLUS_4: /\d{5}-\d{4}$/,
  CANADIAN_POSTAL: /[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d/
};

// Regular expressions for address parsing
const ADDRESS_PATTERNS = {
  PO_BOX: /(P\.?O\.?|POST\s+OFFICE)\s+(BOX|DRAWER)\s\w+/i,
  AVENUE_LETTER: /.*\b(ave.?|avenue).*\b[a-zA-Z]\b/i,
  NO_SUFFIX: /\b\d+[a-z]?\s[a-zA-Z0-9_ ]+\b/i
};

module.exports = {
  COUNTRY_CODES,
  COUNTRY_NAMES,
  COUNTRY_ALIASES,
  CANADIAN_PROVINCES,
  US_STREET_DIRECTIONAL,
  US_LINE2_PREFIXES,
  PUERTO_RICO_PATTERNS,
  POSTAL_CODE_PATTERNS,
  ADDRESS_PATTERNS
};