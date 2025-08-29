'use strict';

const expect = require('chai').expect;
const addresser = require('../index');

describe('#parseAddress - United States Tests', function() {
    
    describe('Basic US Address Parsing', function() {
        it('should parse a simple address', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street name with two words', function() {
            const result = addresser.parseAddress("123 Fat Duck St, Powder Springs, GA");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Fat Duck");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Fat Duck St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Powder Springs");
            expect(result.stateAbbreviation).to.equal("GA");
            expect(result.stateName).to.equal("Georgia");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with double spaces', function() {
            const result = addresser.parseAddress("123 Main  St, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US Address with Zip Codes', function() {
        it('should parse a street address with zip code in standard format', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29526");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with zip code plus four in standard format', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526-4123");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29526");
            expect(result.zipCodePlusFour).to.equal("29526-4123");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with a delimited zip code', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC, 29526");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29526");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US State Name Variations', function() {
        it('should parse a street address with a state name', function() {
            const result = addresser.parseAddress("123 Main St, Conway, South Carolina");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with a lowercase state name', function() {
            const result = addresser.parseAddress("123 Main St, Conway, south carolina");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with a lowercase state abbreviation', function() {
            const result = addresser.parseAddress("123 Main St, Conway, sc");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US Highway Addresses', function() {
        it('should parse a highway address with US prefix and Hwy suffix', function() {
            const result = addresser.parseAddress('500 N U.S. Hwy 281, San Antonio, TX 78221');
            expect(result.streetNumber).to.equal("500");
            expect(result.streetName).to.equal("281");
            expect(result.streetSuffix).to.equal("N U.S. Hwy");
            expect(result.addressLine1).to.equal("500 N U.S. Hwy 281");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("San Antonio");
            expect(result.stateAbbreviation).to.equal("TX");
            expect(result.stateName).to.equal("Texas");
            expect(result.zipCode).to.equal("78221");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a highway address with US prefix and Hwy suffix', function() {
            const result = addresser.parseAddress('500 N U.S. Hwy 281 unit 112, San Antonio, TX 78221');
            expect(result.streetNumber).to.equal("500");
            expect(result.streetName).to.equal("281");
            expect(result.streetSuffix).to.equal("N U.S. Hwy");
            expect(result.addressLine1).to.equal("500 N U.S. Hwy 281");
            expect(result.addressLine2).to.equal("unit 112");
            expect(result.placeName).to.equal("San Antonio");
            expect(result.stateAbbreviation).to.equal("TX");
            expect(result.stateName).to.equal("Texas");
            expect(result.zipCode).to.equal("78221");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a highway address with US prefix and Highway suffix (normalized)', function() {
            const result = addresser.parseAddress('904 US Highway 278, Bluffton, SC 29910');
            expect(result.streetNumber).to.equal("904");
            expect(result.streetName).to.equal("278");
            expect(result.streetSuffix).to.equal("US Hwy");
            expect(result.addressLine1).to.equal("904 US Highway 278");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Bluffton");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29910");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a highway address with Highway suffix (no prefix)', function() {
            const result = addresser.parseAddress('904 Highway 278, Bluffton, SC 29910');
            expect(result.streetNumber).to.equal("904");
            expect(result.streetName).to.equal("278");
            expect(result.streetSuffix).to.equal("Hwy");
            expect(result.addressLine1).to.equal("904 Highway 278");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Bluffton");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29910");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a highway address with US prefix and Highway suffix', function() {
            const result = addresser.parseAddress('904 US Highway 278 E, Bluffton, SC 29910');
            expect(result.streetNumber).to.equal("904");
            expect(result.streetName).to.equal("278");
            expect(result.streetSuffix).to.equal("US Hwy E");
            expect(result.addressLine1).to.equal("904 US Highway 278 E");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Bluffton");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29910");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a state route address with dash (CA-49)', function() {
            const result = addresser.parseAddress('40015 CA-49, Oakhurst, CA 93644, USA');
            expect(result.streetNumber).to.equal("40015");
            expect(result.streetName).to.equal("49");
            expect(result.streetSuffix).to.equal("CA");
            expect(result.addressLine1).to.equal("40015 CA-49");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Oakhurst");
            expect(result.stateAbbreviation).to.equal("CA");
            expect(result.stateName).to.equal("California");
            expect(result.zipCode).to.equal("93644");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a Texas state route address (TX-35)', function() {
            const result = addresser.parseAddress('123 TX-35, Austin, TX 78701');
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("35");
            expect(result.streetSuffix).to.equal("TX");
            expect(result.addressLine1).to.equal("123 TX-35");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Austin");
            expect(result.stateAbbreviation).to.equal("TX");
            expect(result.stateName).to.equal("Texas");
            expect(result.zipCode).to.equal("78701");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a New York state route address (NY-17)', function() {
            const result = addresser.parseAddress('456 NY-17, Bronx, NY 10451');
            expect(result.streetNumber).to.equal("456");
            expect(result.streetName).to.equal("17");
            expect(result.streetSuffix).to.equal("NY");
            expect(result.addressLine1).to.equal("456 NY-17");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Bronx");
            expect(result.stateAbbreviation).to.equal("NY");
            expect(result.stateName).to.equal("New York");
            expect(result.zipCode).to.equal("10451");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a Florida state route address (FL-95)', function() {
            const result = addresser.parseAddress('789 FL-95, Miami, FL 33101');
            expect(result.streetNumber).to.equal("789");
            expect(result.streetName).to.equal("95");
            expect(result.streetSuffix).to.equal("FL");
            expect(result.addressLine1).to.equal("789 FL-95");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Miami");
            expect(result.stateAbbreviation).to.equal("FL");
            expect(result.stateName).to.equal("Florida");
            expect(result.zipCode).to.equal("33101");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a highway address with Unit as addressLine2', function() {
            const result = addresser.parseAddress('904 Highway 278 Unit A, Bluffton, SC 29910');
            expect(result.streetNumber).to.equal("904");
            expect(result.streetName).to.equal("278");
            expect(result.streetSuffix).to.equal("Hwy");
            expect(result.addressLine1).to.equal("904 Highway 278");
            expect(result.addressLine2).to.equal("Unit A");
            expect(result.placeName).to.equal("Bluffton");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29910");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US Directional and Formatting', function() {
        it('should parse an address with a glen plus haven suffix', function() {
            const result = addresser.parseAddress("123 Glen Haven Dr, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Glen Haven");
            expect(result.streetSuffix).to.equal("Dr");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Glen Haven Dr");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a direction following the street type', function() {
            const result = addresser.parseAddress("123 Main St N, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.streetDirection).to.equal("N");
            expect(result.addressLine1).to.equal("123 Main St N");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a lowercase direction following the street type', function() {
            const result = addresser.parseAddress("123 Main St n, Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.streetDirection).to.equal("N");
            expect(result.addressLine1).to.equal("123 Main St N");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a trailing directional, all caps, and no delimiters', function() {
            const result = addresser.parseAddress("300 BOYLSTON ST E SEATTLE WA 98102");
            expect(result.streetNumber).to.equal("300");
            expect(result.streetName).to.equal("Boylston");
            expect(result.streetSuffix).to.equal("St");
            expect(result.streetDirection).to.equal("E");
            expect(result.addressLine1).to.equal("300 Boylston St E");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Seattle");
            expect(result.stateAbbreviation).to.equal("WA");
            expect(result.stateName).to.equal("Washington");
            expect(result.zipCode).to.equal("98102");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a trailing country', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526, USA");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29526");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US Special Address Types', function() {
        it('should parse an address with same street and city name', function() {
            const result = addresser.parseAddress("123 Boston Ave, Boston, MA");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Boston");
            expect(result.streetSuffix).to.equal("Ave");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Boston Ave");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Boston");
            expect(result.stateAbbreviation).to.equal("MA");
            expect(result.stateName).to.equal("Massachusetts");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with no city delimiter', function() {
            const result = addresser.parseAddress("123 Main St Conway SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with "Ave C" style street name', function() {
            const result = addresser.parseAddress('826 N Ave C, Deerfield Beach, FL 33441');
            expect(result.streetNumber).to.equal("826");
            expect(result.streetName).to.equal("N Ave C");
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.addressLine1).to.equal("826 N Ave C");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Deerfield Beach");
            expect(result.stateAbbreviation).to.equal("FL");
            expect(result.stateName).to.equal("Florida");
            expect(result.zipCode).to.equal("33441");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address without a normal suffix like 123 Texas Gold', function() {
            const result = addresser.parseAddress('123 Texas Gold, Austin, TX 78730');
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Texas Gold");
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Texas Gold");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Austin");
            expect(result.stateAbbreviation).to.equal("TX");
            expect(result.stateName).to.equal("Texas");
            expect(result.zipCode).to.equal("78730");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address without a normal suffix and 2nd address line like 123 Texas Gold Unit 101', function() {
            const result = addresser.parseAddress('123 Texas Gold Unit 101, Austin, TX 78730');
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Texas Gold");
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Texas Gold");
            expect(result.addressLine2).to.equal("Unit 101");
            expect(result.placeName).to.equal("Austin");
            expect(result.stateAbbreviation).to.equal("TX");
            expect(result.stateName).to.equal("Texas");
            expect(result.zipCode).to.equal("78730");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a valid address for a small city not in us-cities.json file', function() {
            const result = addresser.parseAddress("123 Main St, Podunk, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Podunk");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a dot after street abbreviation', function() {
            const result = addresser.parseAddress("123 Main St., Conway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an address with a newline separator', function() {
            const result = addresser.parseAddress("123 Main St\nConway, SC");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a PO BOX', function() {
            const result = addresser.parseAddress('P.O. Box 123, Conway, SC');
            expect(result.hasOwnProperty("streetNumber")).to.equal(false);
            expect(result.hasOwnProperty("streetName")).to.equal(false);
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("P.O. Box 123");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a PO BOX written as P.O. DRAWER', function() {
            const result = addresser.parseAddress('P.O. DRAWER 123, Conway, SC');
            expect(result.hasOwnProperty("streetNumber")).to.equal(false);
            expect(result.hasOwnProperty("streetName")).to.equal(false);
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("P.O. DRAWER 123");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address ending in pass', function() {
            const result = addresser.parseAddress('123 Sallie Pass, Conway, SC 29526');
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Sallie");
            expect(result.streetSuffix).to.equal("Pass");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Sallie Pass");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Conway");
            expect(result.stateAbbreviation).to.equal("SC");
            expect(result.stateName).to.equal("South Carolina");
            expect(result.zipCode).to.equal("29526");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with "Avenue N" style street name', function() {
            const result = addresser.parseAddress("826 N Avenue N, Crowley, LA 70526");
            expect(result.streetNumber).to.equal("826");
            expect(result.streetName).to.equal("N Ave N");
            expect(result).to.not.have.property('streetSuffix');
            expect(result.addressLine1).to.equal("826 N Ave N");
            expect(result).to.not.have.property('addressLine2');
            expect(result.placeName).to.equal("Crowley");
            expect(result.stateAbbreviation).to.equal("LA");
            expect(result.stateName).to.equal("Louisiana");
            expect(result.zipCode).to.equal("70526");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with "Ave. b" style street name', function() {
            const result = addresser.parseAddress('826 Ave. b, Deerfield Beach, FL 33441');
            expect(result.streetNumber).to.equal("826");
            expect(result.streetName).to.equal("Ave B");
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.addressLine1).to.equal("826 Ave B");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Deerfield Beach");
            expect(result.stateAbbreviation).to.equal("FL");
            expect(result.stateName).to.equal("Florida");
            expect(result.zipCode).to.equal("33441");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse a street address with "Ave. b" style street name with non delimited second address line', function() {
            const result = addresser.parseAddress('826 Ave. b Unit 5 Deerfield Beach FL 33441');
            expect(result.streetNumber).to.equal("826");
            expect(result.streetName).to.equal("Ave B");
            expect(result.hasOwnProperty("streetSuffix")).to.equal(false);
            expect(result.addressLine1).to.equal("826 Ave B");
            expect(result.addressLine2).to.equal("Unit 5");
            expect(result.placeName).to.equal("Deerfield Beach");
            expect(result.stateAbbreviation).to.equal("FL");
            expect(result.stateName).to.equal("Florida");
            expect(result.zipCode).to.equal("33441");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should parse an Interstate address with a # unit', function() {
            const result = addresser.parseAddress('3813 Interstate Dr # 116, Valrico, FL 33594');
            expect(result.streetNumber).to.equal("3813");
            expect(result.streetName).to.equal("Interstate");
            expect(result.streetSuffix).to.equal("Dr");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("3813 Interstate Dr");
            expect(result.addressLine2).to.equal("# 116");
            expect(result.placeName).to.equal("Valrico");
            expect(result.stateAbbreviation).to.equal("FL");
            expect(result.stateName).to.equal("Florida");
            expect(result.zipCode).to.equal("33594");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });
    });

    describe('US Country Detection', function() {
        it('should detect United States from state abbreviation', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
        });

        it('should detect country from explicit country section - USA', function() {
            const result = addresser.parseAddress("123 Main St, New York, NY 10001, USA");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
            expect(result.stateAbbreviation).to.equal("NY");
            expect(result.stateName).to.equal("New York");
        });

        it('should not confuse CA state with Canada country', function() {
            const result = addresser.parseAddress("123 Main St, Los Angeles, CA 90210");
            expect(result.country).to.equal("United States");
            expect(result.countryAbbreviation).to.equal("US");
            expect(result.stateAbbreviation).to.equal("CA");
            expect(result.stateName).to.equal("California");
        });
    });
});

describe('#parseAddress - US NOONLIGHT Format Tests', function() {
    
    describe('US NOONLIGHT Format - Happy Path', function() {
        it('should format a simple US address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('123 Main St, Conway, SC 29526');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal('123 Main St');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Conway');
            expect(noonlightFormat.state).to.equal('SC');
            expect(noonlightFormat.zip).to.equal('29526');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format US address with secondary line in NOONLIGHT format', function() {
            const result = addresser.parseAddress('123 Main St Unit 5, Conway, SC 29526');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('123 Main St');
            expect(noonlightFormat.line2).to.equal('Unit 5');
            expect(noonlightFormat.city).to.equal('Conway');
            expect(noonlightFormat.state).to.equal('SC');
            expect(noonlightFormat.zip).to.equal('29526');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format PO Box address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('P.O. Box 123, Conway, SC 29526');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('P.O. Box 123');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Conway');
            expect(noonlightFormat.state).to.equal('SC');
            expect(noonlightFormat.zip).to.equal('29526');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format address with direction in NOONLIGHT format', function() {
            const result = addresser.parseAddress('123 Main St N, Conway, SC 29526');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('123 Main St N');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Conway');
            expect(noonlightFormat.state).to.equal('SC');
            expect(noonlightFormat.zip).to.equal('29526');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format address with special street names in NOONLIGHT format', function() {
            const result = addresser.parseAddress('826 N Ave C, Deerfield Beach, FL 33441');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('826 N Ave C');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Deerfield Beach');
            expect(noonlightFormat.state).to.equal('FL');
            expect(noonlightFormat.zip).to.equal('33441');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format address with no suffix in NOONLIGHT format', function() {
            const result = addresser.parseAddress('123 Texas Gold, Austin, TX 78730');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('123 Texas Gold');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Austin');
            expect(noonlightFormat.state).to.equal('TX');
            expect(noonlightFormat.zip).to.equal('78730');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format CA state route address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('40015 CA-49, Oakhurst, CA 93644');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('40015 CA-49');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Oakhurst');
            expect(noonlightFormat.state).to.equal('CA');
            expect(noonlightFormat.zip).to.equal('93644');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format TX state route address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('1234 TX-35, Austin, TX 78701');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('1234 TX-35');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Austin');
            expect(noonlightFormat.state).to.equal('TX');
            expect(noonlightFormat.zip).to.equal('78701');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format NY state route address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('5678 NY-17, Buffalo, NY 14201');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('5678 NY-17');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Buffalo');
            expect(noonlightFormat.state).to.equal('NY');
            expect(noonlightFormat.zip).to.equal('14201');
            expect(noonlightFormat.country).to.equal('US');
        });

        it('should format FL state route address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('9999 FL-95, Miami, FL 33101');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('9999 FL-95');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Miami');
            expect(noonlightFormat.state).to.equal('FL');
            expect(noonlightFormat.zip).to.equal('33101');
            expect(noonlightFormat.country).to.equal('US');
        });
    });
});