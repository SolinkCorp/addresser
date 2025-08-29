const usCities = require('./data/us-cities.json');
const { baseParser } = require('./parsers/baseParser');

'use strict';

/**
 * Parses a street address with format method
 * @param {string} address
 * @return {object} Parsed address object with format method
 **/
function parseAddress(address) {
  // Get the parsed result from the parser
  const result = baseParser(address);
  
  // Add format method to the result object
  result.format = function(formatType) {
    if (formatType === 'NOONLIGHT') {
      // Validate required fields for NOONLIGHT format
      if (!this.addressLine1) {
        throw new Error('NOONLIGHT format requires address line');
      }
      if (!this.placeName) {
        throw new Error('NOONLIGHT format requires city');
      }
      if (!this.zipCode) {
        throw new Error('NOONLIGHT format requires zipCode');
      }
      if (!this.countryAbbreviation) {
        throw new Error('NOONLIGHT format requires country code');
      }
      
      const noonlightFormat = {
        line1: this.addressLine1,
        ...(this.addressLine2 && { line2: this.addressLine2 }),
        city: this.placeName,
        ...(this.countryAbbreviation !== 'PR' && { state: this.stateAbbreviation }),
        zip: this.zipCodePlusFour ? this.zipCodePlusFour : this.zipCode,
        country: this.countryAbbreviation,
      };
      
      return noonlightFormat;
    }
    
    // Default: return the original parsed result without the format method
    const { format, ...addressData } = this;
    return addressData;
  };
  
  return result;
}

//returns a random property of a given object
function randomProperty (obj) {
  const keys = Object.keys(obj)
  return keys[ keys.length * Math.random() << 0];
};

module.exports = {
  parseAddress: parseAddress,

  randomCity: function() {
    const randomState = randomProperty(usCities);
    const randomStateData = usCities[randomState];
    const randomCityElementId = Math.floor(Math.random() * randomStateData.length);
    const randomCity = randomStateData[randomCityElementId];
    return { city: randomCity, state: randomState};
  },

  cities: function() {
    return(usCities);
  }
};
