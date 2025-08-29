'use strict';

const expect = require('chai').expect;
const addresser = require('../index');

describe('#parseAddress - Puerto Rico Tests', function() {
    
    describe('Basic Puerto Rico Address Parsing', function() {
        it('should parse a Puerto Rico address', function() {
            const result = addresser.parseAddress("69 Calle 2, San Juan, 00927, Puerto Rico");
            expect(result.streetNumber).to.equal("69");
            expect(result.streetName).to.equal("2");
            expect(result.streetSuffix).to.equal("CALLE");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("69 CALLE 2");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("San Juan");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.zipCode).to.equal("00927");
            expect(result.hasOwnProperty("zipCodePlusFour")).to.equal(false);
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });

        it('should parse a Puerto Rico address with Plaza', function() {
            const result = addresser.parseAddress('100 PLAZA LAS AMERICAS, SAN JUAN PR 00927');
            expect(result.streetNumber).to.equal("100");
            expect(result.streetName).to.equal("LAS AMERICAS");
            expect(result.streetSuffix).to.equal("PLAZA");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("100 PLAZA LAS AMERICAS");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("San Juan");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });

        it('should parse a Puerto Rico address with PR country missing comma', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1, Cabo Rojo, 00623 PR');
            expect(result.streetNumber).to.equal("15.1");
            expect(result.streetName).to.equal("303");
            expect(result.streetSuffix).to.equal("CARR");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("CARR 303 KM 15.1");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Cabo Rojo");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });

        it('should parse a Puerto Rico address with PR as state and country missing comma', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1, Cabo Rojo, PR 00623 PR');
            expect(result.streetNumber).to.equal("15.1");
            expect(result.streetName).to.equal("303");
            expect(result.streetSuffix).to.equal("CARR");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("CARR 303 KM 15.1");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Cabo Rojo");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });
    });

    describe('Puerto Rico Highway Addresses', function() {
        it('should parse a Puerto Rico highway address with hectometer', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1 HM 2, CAGUAS, PR 00725');
            expect(result.streetSuffix).to.equal("CARR");
            expect(result.streetName).to.equal("303");
            expect(result.streetNumber).to.equal("15.1");
            expect(result.addressLine1).to.equal("CARR 303 KM 15.1 HM 2");
            expect(result.placeName).to.equal("Caguas");
            expect(result.zipCode).to.equal("00725");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });

        it('should parse a Puerto Rico highway address with municipality', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1, Barrio of Las Palmas, Cabo Rojo, pr 00623, PR');
            expect(result.streetSuffix).to.equal("CARR");
            expect(result.streetName).to.equal("303");
            expect(result.streetNumber).to.equal("15.1");
            expect(result.addressLine1).to.equal("CARR 303 KM 15.1");
            expect(result.addressLine2).to.equal("Barrio of Las Palmas");
            expect(result.placeName).to.equal("Cabo Rojo");
            expect(result.zipCode).to.equal("00623");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });

        it('should parse a Puerto Rico address starting with KM marker', function() {
            const result = addresser.parseAddress('KM 15.1 Barrio of Las Palmas, Cabo Rojo, PR 00623, USA');
            expect(result.streetNumber).to.equal("15.1");
            expect(result.streetName).to.equal("15.1");
            expect(result.streetSuffix).to.equal("KM");
            expect(result.hasOwnProperty("streetDirection")).to.equal(false);
            expect(result.addressLine1).to.equal("KM 15.1 Barrio of Las Palmas");
            expect(result.hasOwnProperty("addressLine2")).to.equal(false);
            expect(result.placeName).to.equal("Cabo Rojo");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
        });
    });

    describe('Puerto Rico Country Detection', function() {
        it('should detect Puerto Rico from PR abbreviation', function() {
            const result = addresser.parseAddress("123 Calle Principal, San Juan, PR 00901");
            expect(result.country).to.equal("Puerto Rico");
            expect(result.countryAbbreviation).to.equal("PR");
            expect(result.stateAbbreviation).to.equal("PR");
            expect(result.stateName).to.equal("Puerto Rico");
        });
    });
});

describe('#parseAddress - Puerto Rico NOONLIGHT Format Tests', function() {
    
    describe('Puerto Rico NOONLIGHT Format - Happy Path', function() {
        it('should format Puerto Rico address in NOONLIGHT format (no state field)', function() {
            const result = addresser.parseAddress("69 Calle 2, San Juan, 00927, Puerto Rico");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('69 CALLE 2');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('San Juan');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00927');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should format Puerto Rico highway address with KM marker in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Barrio of Las Palmas, Cabo Rojo, pr 00623, PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('CARR 303 KM 15.1');
            expect(noonlightFormat.line2).to.equal('Barrio of Las Palmas');
            expect(noonlightFormat.city).to.equal('Cabo Rojo');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00623');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should format Puerto Rico highway address with HM marker in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1 HM 2, CAGUAS, PR 00725");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('CARR 303 KM 15.1 HM 2');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Caguas');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00725');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should format Puerto Rico highway address with PR suffix in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Cabo Rojo, PR 00623 PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('CARR 303 KM 15.1');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Cabo Rojo');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00623');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should format Puerto Rico highway address without state in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Cabo Rojo, 00623 PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('CARR 303 KM 15.1');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Cabo Rojo');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00623');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should format Puerto Rico plaza address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("100 PLAZA LAS AMERICAS, SAN JUAN PR 00927");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('100 PLAZA LAS AMERICAS');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('San Juan');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00927');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should handle Puerto Rico highway address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1 HM 2, CAGUAS, PR 00725');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('CARR 303 KM 15.1 HM 2');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Caguas');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00725');
            expect(noonlightFormat.country).to.equal("PR");
        });

        it('should handle Puerto Rico highway address starting with KM marker in NOONLIGHT format', function() {
            const result = addresser.parseAddress('KM 15.1 HM 2, CAGUAS, PR 00725');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.hasOwnProperty('formatted_address')).to.equal(false);
            expect(noonlightFormat.line1).to.equal('KM 15.1 HM 2');
            expect(noonlightFormat.hasOwnProperty('line2')).to.equal(false);
            expect(noonlightFormat.city).to.equal('Caguas');
            expect(noonlightFormat.hasOwnProperty('state')).to.equal(false);
            expect(noonlightFormat.zip).to.equal('00725');
            expect(noonlightFormat.country).to.equal("PR");
        });
    });
});