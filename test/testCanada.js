'use strict';

const expect = require('chai').expect;
const addresser = require('../index');

describe('#parseAddress - Canada Tests', function() {
    
    describe('Basic Canadian Address Parsing', function() {
        it('should parse a simple Canadian Address without Postal Code', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Toronto");
            expect(result.stateAbbreviation).to.equal("ON");
            expect(result.stateName).to.equal("Ontario");
            expect(result.hasOwnProperty("zipCode")).to.equal(false);
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
        });

        it('should parse a simple Canadian Address with zip Code', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M5V 3A8");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Toronto");
            expect(result.stateAbbreviation).to.equal("ON");
            expect(result.stateName).to.equal("Ontario");
            expect(result.zipCode).to.equal("M5V 3A8");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
        });

        it('should parse a simple Canadian Address with Trailing Country', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M3K5K9, Canada");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Toronto");
            expect(result.stateAbbreviation).to.equal("ON");
            expect(result.stateName).to.equal("Ontario");
            expect(result.zipCode).to.equal("M3K5K9");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
        });

        it('should parse a simple Canadian Address with lower case letters', function() {
            const result = addresser.parseAddress("123 Main St, toronto, on m3k5k9, canada");
            expect(result.streetNumber).to.equal("123");
            expect(result.streetName).to.equal("Main");
            expect(result.streetSuffix).to.equal("St");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("123 Main St");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Toronto");
            expect(result.stateAbbreviation).to.equal("ON");
            expect(result.stateName).to.equal("Ontario");
            expect(result.zipCode).to.equal("M3K5K9");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
        });
    });

    describe('Canadian Province Detection', function() {
        it('should detect Canada from British Columbia province', function() {
            const result = addresser.parseAddress("123 Main St, Vancouver, BC");
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
            expect(result.stateAbbreviation).to.equal("BC");
            expect(result.stateName).to.equal("British Columbia");
        });

        it('should detect Canada from Quebec province name', function() {
            const result = addresser.parseAddress("123 Main St, Montreal, Quebec");
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
            expect(result.stateAbbreviation).to.equal("QC");
            expect(result.stateName).to.equal("Quebec");
        });

        it('should detect country from explicit country section - Canada', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M5V 3A8, Canada");
            expect(result.country).to.equal("Canada");
            expect(result.countryAbbreviation).to.equal("CA");
            expect(result.stateAbbreviation).to.equal("ON");
            expect(result.stateName).to.equal("Ontario");
        });
    });

    describe('Canadian Special Cities', function() {
        it('should handle Canadian city North York', function() {
            const result = addresser.parseAddress('3401 Dufferin St Unit 510, North York, ON M6A 2T9, Canada');
            expect(result.addressLine1).to.equal('3401 Dufferin St');
            expect(result.addressLine2).to.equal('Unit 510');
            expect(result.placeName).to.equal('North York');
            expect(result.stateAbbreviation).to.equal('ON');
            expect(result.stateName).to.equal('Ontario');
            expect(result.zipCode).to.equal('M6A 2T9');
            expect(result.country).to.equal('Canada');
            expect(result.countryAbbreviation).to.equal('CA');
        });

        it('should handle Canadian city Port Coquitlam', function() {
            const result = addresser.parseAddress('1097 Nicola Ave #120, Port Coquitlam, BC V3B 8B2, Canada');
            expect(result.addressLine1).to.equal('1097 Nicola Ave');
            expect(result.addressLine2).to.equal('#120');
            expect(result.placeName).to.equal('Port Coquitlam');
            expect(result.stateAbbreviation).to.equal('BC');
            expect(result.stateName).to.equal('British Columbia');
            expect(result.zipCode).to.equal('V3B 8B2');
            expect(result.country).to.equal('Canada');
            expect(result.countryAbbreviation).to.equal('CA');
        });

        it('should correctly handle CA as Canada when Canadian postal code is present', function() {
            const result = addresser.parseAddress('1097 Nicola Ave #120, Port Coquitlam, BC V3B 8B2, CA');
            expect(result.addressLine1).to.equal('1097 Nicola Ave');
            expect(result.addressLine2).to.equal('#120');
            expect(result.placeName).to.equal('Port Coquitlam');
            expect(result.stateAbbreviation).to.equal('BC');
            expect(result.stateName).to.equal('British Columbia');
            expect(result.zipCode).to.equal('V3B 8B2');
            expect(result.country).to.equal('Canada');
            expect(result.countryAbbreviation).to.equal('CA');
        });
    });
});

describe('#parseAddress - Canada NOONLIGHT Format Tests', function() {
    
    describe('Canadian NOONLIGHT Format - Happy Path', function() {
        it('should format Canadian address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M5V 3A8");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('123 Main St');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Toronto');
            expect(noonlightFormat.state).to.equal('ON');
            expect(noonlightFormat.zip).to.equal('M5V 3A8');
            expect(noonlightFormat.country).to.equal('CA');
        });

        it('should handle Canadian address with trailing country in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M3K5K9, Canada");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('123 Main St');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Toronto');
            expect(noonlightFormat.state).to.equal('ON');
            expect(noonlightFormat.zip).to.equal('M3K5K9');
            expect(noonlightFormat.country).to.equal('CA');
        });

        it('should handle Canadian city North York in NOONLIGHT format', function() {
            const result = addresser.parseAddress('3401 Dufferin St Unit 510, North York, ON M6A 2T9, Canada');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('3401 Dufferin St');
            expect(noonlightFormat.line2).to.equal('Unit 510');
            expect(noonlightFormat.city).to.equal('North York');
            expect(noonlightFormat.state).to.equal('ON');
            expect(noonlightFormat.zip).to.equal('M6A 2T9');
            expect(noonlightFormat.country).to.equal('CA');
        });

        it('should handle Canadian city Port Coquitlam in NOONLIGHT format', function() {
            const result = addresser.parseAddress('1097 Nicola Ave #120, Port Coquitlam, BC V3B 8B2, Canada');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('1097 Nicola Ave');
            expect(noonlightFormat.line2).to.equal('#120');
            expect(noonlightFormat.city).to.equal('Port Coquitlam');
            expect(noonlightFormat.state).to.equal('BC');
            expect(noonlightFormat.zip).to.equal('V3B 8B2');
            expect(noonlightFormat.country).to.equal('CA');
        });

        it('should correctly handle CA as Canada when Canadian postal code is present', function() {
            const result = addresser.parseAddress('1097 Nicola Ave #120, Port Coquitlam, BC V3B 8B2, CA');
            const noonlightFormat = result.format('NOONLIGHT');

            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('1097 Nicola Ave');
            expect(noonlightFormat.line2).to.equal('#120');
            expect(noonlightFormat.city).to.equal('Port Coquitlam');
            expect(noonlightFormat.state).to.equal('BC');
            expect(noonlightFormat.zip).to.equal('V3B 8B2');
            expect(noonlightFormat.country).to.equal('CA');
        });
    });
});