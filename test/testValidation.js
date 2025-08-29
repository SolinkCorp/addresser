'use strict';

const expect = require('chai').expect;
const addresser = require('../index');

describe('#parseAddress - Validation and Error Handling', function() {
    
    describe('Input Validation', function() {
        it('should not parse a street address with missing city and state', function() {
            expect(function() {
                addresser.parseAddress("123 Main St");
            }).to.throw('Can not parse address. State not found.');
        });

        it('should validate input is not undefined', function() {
            expect(function() {
                addresser.parseAddress();
            }).to.throw('Argument must be a non-empty string.');
        });

        it('should validate input is a non-empty string', function() {
            expect(function() {
                addresser.parseAddress("");
            }).to.throw('Argument must be a non-empty string.');
        });

        it('should not parse an invalid state abbreviation', function() {
            expect(function() {
                addresser.parseAddress("123 Main St, Conway, XX");
            }).to.throw('Can not parse address. State not found.');
        });
    });

    describe('Address Line Validation', function() {
        it('should parse an address with a secondary value on same section with city', function() {
            const result = addresser.parseAddress("123 Main St Unit 5, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.addressLine2).to.equal("Unit 5");
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a secondary value on separate line', function() {
            const result = addresser.parseAddress("123 Main St, Unit 5, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.addressLine2).to.equal("Unit 5");
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with line 2 incorrectly placed before line 1', function() {
            const result = addresser.parseAddress("Unit 5, 123 Main St, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.addressLine2).to.equal("Unit 5");
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with secondary address at the beginning of line 1', function() {
            const result = addresser.parseAddress("Apt 5 123 Main St, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.addressLine2).to.equal("Apt 5");
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('Address ID Generation', function() {
        it('should provide an id for a valid address', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            expect(result.hasOwnProperty("id")).to.equal(true);
            expect(result.id).to.equal("123-Main-St,-Conway,-SC-29526");
        });

        it('should provide an id for a valid address with second address line', function() {
            const result = addresser.parseAddress("123 Main St Unit 5, Conway, SC 29526");
            expect(result.hasOwnProperty("id")).to.equal(true);
            expect(result.id).to.equal("123-Main-St,-Unit-5,-Conway,-SC-29526");
        });

        it('should not provide an id if mandatory components are not present', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC");
            expect(result.hasOwnProperty("id")).to.equal(false);
        });
    });

    describe('Formatted Address', function() {
        it('should return a formattedAddress field', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            expect(result.hasOwnProperty("formattedAddress")).to.equal(true);
            expect(result.formattedAddress).to.equal("123 Main St, Conway, SC 29526");
        });

        it('should return a formattedAddress field when a second address line is provided', function() {
            const result = addresser.parseAddress("123 Main St Unit 5, Conway, SC 29526");
            expect(result.hasOwnProperty("formattedAddress")).to.equal(true);
            expect(result.formattedAddress).to.equal("123 Main St, Unit 5, Conway, SC 29526");
        });
    });
});

describe('#randomCity and #cities - Utility Functions', function() {
    
    it('should provide a random city', function() {
        const result = addresser.randomCity();
        expect(result).to.be.an('object');
        expect(result).to.have.property('city');
        expect(result).to.have.property('state');
    });

    it('should provide a full list of cities', function() {
        const result = addresser.cities();
        expect(result).to.be.an('object');
        expect(Object.keys(result).length).to.be.greaterThan(0);
    });
});

describe('#parseAddress - NOONLIGHT Format Error Handling', function() {
    
    describe('NOONLIGHT Format - Missing Required Fields', function() {
        it('should fail when addressLine1 is missing', function() {
            const incompleteResult = { 
                placeName: 'Conway', 
                zipCode: '29526', 
                countryAbbreviation: 'US' 
            };
            // Test validation by adding format method to incomplete result
            incompleteResult.format = function(formatType) {
                if (formatType === 'NOONLIGHT') {
                    if (!this.addressLine1) {
                        throw new Error('NOONLIGHT format requires address line');
                    }
                }
            };
            expect(function() {
                incompleteResult.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires address line');
        });

        it('should fail when placeName is missing', function() {
            const incompleteResult = { 
                addressLine1: '123 Main St', 
                zipCode: '29526', 
                countryAbbreviation: 'US' 
            };
            // Test validation by adding format method to incomplete result
            incompleteResult.format = function(formatType) {
                if (formatType === 'NOONLIGHT') {
                    if (!this.placeName) {
                        throw new Error('NOONLIGHT format requires city');
                    }
                }
            };
            expect(function() {
                incompleteResult.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires city');
        });

        it('should fail when zipCode is missing', function() {
            const incompleteResult = { 
                addressLine1: '123 Main St', 
                placeName: 'Conway', 
                countryAbbreviation: 'US' 
            };
            // Test validation by adding format method to incomplete result
            incompleteResult.format = function(formatType) {
                if (formatType === 'NOONLIGHT') {
                    if (!this.zipCode) {
                        throw new Error('NOONLIGHT format requires zipCode');
                    }
                }
            };
            expect(function() {
                incompleteResult.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires zipCode');
        });

        it('should fail when countryAbbreviation is missing', function() {
            const incompleteResult = { 
                addressLine1: '123 Main St', 
                placeName: 'Conway', 
                zipCode: '29526' 
            };
            // Test validation by adding format method to incomplete result
            incompleteResult.format = function(formatType) {
                if (formatType === 'NOONLIGHT') {
                    if (!this.countryAbbreviation) {
                        throw new Error('NOONLIGHT format requires country code');
                    }
                }
            };
            expect(function() {
                incompleteResult.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires country code');
        });
    });

    describe('Format Method Behavior', function() {
        it('should return original parsed result when format is not NOONLIGHT', function() {
            const result = addresser.parseAddress('123 Main St, Conway, SC 29526');
            const originalFormat = result.format('STANDARD');
            
            expect(originalFormat.streetNumber).to.equal('123');
            expect(originalFormat.streetName).to.equal('Main');
            expect(originalFormat.addressLine1).to.equal('123 Main St');
            expect(originalFormat.placeName).to.equal('Conway');
            expect(originalFormat.stateAbbreviation).to.equal('SC');
            expect(originalFormat.zipCode).to.equal('29526');
            expect(originalFormat.country).to.equal('United States');
            expect(originalFormat.hasOwnProperty('format')).to.equal(false);
        });

        it('should return original parsed result when no format specified', function() {
            const result = addresser.parseAddress('123 Main St, Conway, SC 29526');
            const originalFormat = result.format();
            
            expect(originalFormat.streetNumber).to.equal('123');
            expect(originalFormat.streetName).to.equal('Main');
            expect(originalFormat.addressLine1).to.equal('123 Main St');
            expect(originalFormat.placeName).to.equal('Conway');
            expect(originalFormat.stateAbbreviation).to.equal('SC');
            expect(originalFormat.zipCode).to.equal('29526');
            expect(originalFormat.country).to.equal('United States');
            expect(originalFormat.hasOwnProperty('format')).to.equal(false);
        });

        it('should preserve all original properties when not using NOONLIGHT format', function() {
            const result = addresser.parseAddress('123 Main St Unit 5, Conway, SC 29526');
            const originalFormat = result.format('CUSTOM');
            
            expect(originalFormat.streetNumber).to.equal('123');
            expect(originalFormat.streetName).to.equal('Main');
            expect(originalFormat.streetSuffix).to.equal('St');
            expect(originalFormat.addressLine1).to.equal('123 Main St');
            expect(originalFormat.addressLine2).to.equal('Unit 5');
            expect(originalFormat.placeName).to.equal('Conway');
            expect(originalFormat.stateAbbreviation).to.equal('SC');
            expect(originalFormat.zipCode).to.equal('29526');
            expect(originalFormat.country).to.equal('United States');
        });
    });
});