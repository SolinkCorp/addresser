'use strict';

const expect = require('chai').expect;
const addresser = require('../index');

describe('#parseAddress with format method - NOONLIGHT Format Tests', function() {
    
    describe('Happy Path - Valid Addresses with NOONLIGHT Format', function() {
        it('should format a simple US address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("123 Main St");
            expect(noonlightFormat.city).to.equal("Conway");
            expect(noonlightFormat.state).to.equal("SC");
            expect(noonlightFormat.zip).to.equal("29526");
            expect(noonlightFormat.country).to.equal("US");
            expect(noonlightFormat.hasOwnProperty("line2")).to.equal(false);
        });

        it('should format US address with secondary line in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St Unit 101, Conway, SC 29526");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("123 Main St");
            expect(noonlightFormat.line2).to.equal("Unit 101");
            expect(noonlightFormat.city).to.equal("Conway");
            expect(noonlightFormat.state).to.equal("SC");
            expect(noonlightFormat.zip).to.equal("29526");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should format Canadian address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M3K5K9");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("123 Main St");
            expect(noonlightFormat.city).to.equal("Toronto");
            expect(noonlightFormat.state).to.equal("ON");
            expect(noonlightFormat.zip).to.equal("M3K5K9");
            expect(noonlightFormat.country).to.equal("CA");
        });

        it('should format Puerto Rico address in NOONLIGHT format (no state field)', function() {
            const result = addresser.parseAddress("69 Calle 2, San Juan, 00927, Puerto Rico");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("69 CALLE 2");
            expect(noonlightFormat.city).to.equal("San Juan");
            expect(noonlightFormat.zip).to.equal("00927");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format Puerto Rico highway address with KM marker in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Barrio of Las Palmas, Cabo Rojo, pr 00623, PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("CARR 303 KM 15.1");
            expect(noonlightFormat.city).to.equal("Cabo Rojo");
            expect(noonlightFormat.zip).to.equal("00623");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format Puerto Rico highway address with HM marker in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1 HM 2, CAGUAS, PR 00725");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("CARR 303 KM 15.1 HM 2");
            expect(noonlightFormat.city).to.equal("Caguas");
            expect(noonlightFormat.zip).to.equal("00725");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format Puerto Rico highway address with PR suffix in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Cabo Rojo, PR 00623 PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("CARR 303 KM 15.1");
            expect(noonlightFormat.city).to.equal("Cabo Rojo");
            expect(noonlightFormat.zip).to.equal("00623");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format Puerto Rico highway address without state in NOONLIGHT format', function() {
            const result = addresser.parseAddress("CARR 303 KM 15.1, Cabo Rojo, 00623 PR");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("CARR 303 KM 15.1");
            expect(noonlightFormat.city).to.equal("Cabo Rojo");
            expect(noonlightFormat.zip).to.equal("00623");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format Puerto Rico plaza address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("100 PLAZA LAS AMERICAS, SAN JUAN PR 00927");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("100 PLAZA LAS AMERICAS");
            expect(noonlightFormat.city).to.equal("San Juan");
            expect(noonlightFormat.zip).to.equal("00927");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });

        it('should format PO Box address in NOONLIGHT format', function() {
            const result = addresser.parseAddress("PO BOX 538\nBASILE LA 70515-0538");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("PO BOX 538");
            expect(noonlightFormat.city).to.equal("Basile");
            expect(noonlightFormat.state).to.equal("LA");
            expect(noonlightFormat.zip).to.equal("70515");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should format address with direction in NOONLIGHT format', function() {
            const result = addresser.parseAddress("1301 Acme Street E, Columbia, SC 29203");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("1301 Acme St E");
            expect(noonlightFormat.city).to.equal("Columbia");
            expect(noonlightFormat.state).to.equal("SC");
            expect(noonlightFormat.zip).to.equal("29203");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should format address with special street names in NOONLIGHT format', function() {
            const result = addresser.parseAddress("826 N Ave C, Crowley, LA 70526");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("826 N Ave C");
            expect(noonlightFormat.city).to.equal("Crowley");
            expect(noonlightFormat.state).to.equal("LA");
            expect(noonlightFormat.zip).to.equal("70526");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should format address with no suffix in NOONLIGHT format', function() {
            const result = addresser.parseAddress("12939 Texas Gold, San Antonio, TX 78253");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("12939 Texas Gold");
            expect(noonlightFormat.city).to.equal("San Antonio");
            expect(noonlightFormat.state).to.equal("TX");
            expect(noonlightFormat.zip).to.equal("78253");
            expect(noonlightFormat.country).to.equal("US");
        });
    });

    describe('Sad Path - Missing Required Fields for NOONLIGHT Format', function() {
        it('should fail when addressLine1 is missing', function() {
            // Test validation by manually removing addressLine1 from a valid result
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            delete result.addressLine1;
            console.log(result);
            expect(function() {
                result.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires address line');
        });

        it('should fail when placeName is missing', function() {
            // Test validation by manually removing placeName from a valid result
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            delete result.placeName;
            expect(function() {
                result.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires city');
        });

        it('should fail when zipCode is missing', function() {
            // Test validation by manually removing zipCode from a valid result
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            delete result.zipCode;
            expect(function() {
                result.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires zipCode');
        });

        it('should fail when countryAbbreviation is missing', function() {
            // This would be an edge case where country detection fails
            expect(function() {
                const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
                // Manually remove countryAbbreviation to simulate failure
                delete result.countryAbbreviation;
                result.format('NOONLIGHT');
            }).to.throw('NOONLIGHT format requires country code');
        });
    });

    describe('Format Method Behavior Tests', function() {
        it('should return original parsed result when format is not NOONLIGHT', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            const defaultFormat = result.format('DEFAULT');
            
            expect(defaultFormat.streetNumber).to.equal("123");
            expect(defaultFormat.streetName).to.equal("Main");
            expect(defaultFormat.addressLine1).to.equal("123 Main St");
            expect(defaultFormat.placeName).to.equal("Conway");
            expect(defaultFormat.stateAbbreviation).to.equal("SC");
            expect(defaultFormat.zipCode).to.equal("29526");
            expect(defaultFormat.country).to.equal("United States");
            expect(defaultFormat.hasOwnProperty("format")).to.equal(false);
        });

        it('should return original parsed result when no format specified', function() {
            const result = addresser.parseAddress("123 Main St, Conway, SC 29526");
            const defaultFormat = result.format();
            
            expect(defaultFormat.streetNumber).to.equal("123");
            expect(defaultFormat.streetName).to.equal("Main");
            expect(defaultFormat.addressLine1).to.equal("123 Main St");
            expect(defaultFormat.placeName).to.equal("Conway");
            expect(defaultFormat.stateAbbreviation).to.equal("SC");
            expect(defaultFormat.zipCode).to.equal("29526");
            expect(defaultFormat.country).to.equal("United States");
            expect(defaultFormat.hasOwnProperty("format")).to.equal(false);
        });

        it('should preserve all original properties when not using NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St Unit 101, Conway, SC 29526");
            const defaultFormat = result.format('DEFAULT');
            
            expect(defaultFormat.addressLine2).to.equal("Unit 101");
            expect(defaultFormat.formattedAddress).to.equal("123 Main St, Unit 101, Conway, SC 29526");
            expect(defaultFormat.id).to.equal('123-Main-St,-Unit-101,-Conway,-SC-29526');
        });
    });

    describe('Edge Cases and Special Address Types', function() {
        it('should handle address with multiple secondary lines in NOONLIGHT format', function() {
            const result = addresser.parseAddress("8070 Central Ave NE Unit 8070-206, Spring Lake Park, MN 55432");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("8070 Central Ave NE");
            expect(noonlightFormat.line2).to.equal("Unit 8070-206");
            expect(noonlightFormat.city).to.equal("Spring Lake Park");
            expect(noonlightFormat.state).to.equal("MN");
            expect(noonlightFormat.zip).to.equal("55432");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should handle address with special characters in NOONLIGHT format', function() {
            const result = addresser.parseAddress("47 N Portola, # 35, Laguna Beach, CA 92651");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("47 N Portola");
            expect(noonlightFormat.line2).to.equal("# 35");
            expect(noonlightFormat.city).to.equal("Laguna Beach");
            expect(noonlightFormat.state).to.equal("CA");
            expect(noonlightFormat.zip).to.equal("92651");
            expect(noonlightFormat.country).to.equal("US");
        });

        it('should handle Canadian address with trailing country in NOONLIGHT format', function() {
            const result = addresser.parseAddress("123 Main St, Toronto, ON M3K5K9, Canada");
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("123 Main St");
            expect(noonlightFormat.city).to.equal("Toronto");
            expect(noonlightFormat.state).to.equal("ON");
            expect(noonlightFormat.zip).to.equal("M3K5K9");
            expect(noonlightFormat.country).to.equal("CA");
        });

        it('should handle Puerto Rico highway address in NOONLIGHT format', function() {
            const result = addresser.parseAddress('CARR 303 KM 15.1 HM 2, CAGUAS, PR 00725');
            const noonlightFormat = result.format('NOONLIGHT');
            
            expect(noonlightFormat.line1).to.equal("CARR 303 KM 15.1 HM 2");
            expect(noonlightFormat.city).to.equal("Caguas");
            expect(noonlightFormat.zip).to.equal("00725");
            expect(noonlightFormat.country).to.equal("PR");
            expect(noonlightFormat.hasOwnProperty("state")).to.equal(false);
        });
    });
});
