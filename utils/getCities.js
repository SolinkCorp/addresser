var request = require('request');
var fs = require('fs');
var unzipper = require('unzipper');

async function getDataForCountry(country_code){
  let country_code_lower = country_code.toLowerCase();
  let country_code_upper = country_code.toUpperCase();
  var states = JSON.parse(fs.readFileSync("../data/"+country_code_lower+"-states.json"));

  unzipper.Open.url(request,'http://download.geonames.org/export/zip/'+country_code_upper+'.zip')
    .then(function(d) {
      var file = d.files.filter(function(d) {
        return d.path === country_code_upper+'.txt';
      })[0];
      return file.buffer();
    })
    .then(function(d) {
      var cityHash = {};
      for (var key in states) {
        cityHash[states[key]] = [];
      }
      console.log(cityHash);
      var citiesData = d.toString().split("\n");
      citiesData.forEach(function(element) {
        var cityData = element.split('\t');
        //console.log(cityData[2] + ", " + cityData[4]);
        let city = cityData[2]; // Default US & PR data
        // If Canadian data, it is structured differently
        if (country_code_upper === 'CA') {
          city = cityData[7] || cityData[5] || cityData[2];
        }
        let region = cityData[4];
        if (country_code_upper === 'PR') {
          region = cityData[0];
        }
        if (region && region.length == 2 && cityHash.hasOwnProperty(region)) {
          cityHash[region].push(city);
        }
      });

      //Some cities are not preset in the geonames data. Manually add them here:
      //TODO I should consider adding a North, South, East, West to the city if the first pass doesn't parse successfully
      if (country_code == 'US') {
        cityHash['AZ'].push('Corona de Tucson')
        cityHash['AZ'].push('Dewey Humboldt')
        cityHash['AZ'].push('South Tucson')
        cityHash['CA'].push('East Palo Alto')
        cityHash['CA'].push('Westchester')
        cityHash['CO'].push('West Pleasant View')
        cityHash['CT'].push('Winchester')
        cityHash['FL'].push('North Miami')
        cityHash['FL'].push('South Daytona')
        cityHash['FL'].push('South Palm Beach')
        cityHash['HI'].push('East Honolulu')
        cityHash['HI'].push('Urban Honolulu')
        cityHash['IL'].push('East Dundee')
        cityHash['IL'].push('Mount Zion')
        cityHash['IL'].push('West Peoria')
        cityHash['MA'].push('East Boston')
        cityHash['MA'].push('East Cambridge')
        cityHash['MA'].push('North Westport')
        cityHash['MA'].push('South Attleboro')
        cityHash['MA'].push('South Boston')
        cityHash['MA'].push('West Methuen')
        cityHash['MD'].push('North Bethesda')
        cityHash['MI'].push('Sylvan Lake')
        cityHash['MN'].push('Arden Hills')
        cityHash['MN'].push('Little Canada')
        cityHash['MN'].push('North Saint Paul')
        cityHash['MN'].push('Spring Lake Park')
        cityHash['NJ'].push('East Windsor')
        cityHash['NJ'].push('North Plainfield')
        cityHash['NJ'].push('West Deptford')
        cityHash['NJ'].push('West Windsor')
        cityHash['NY'].push('East Atlantic Beach')
        cityHash['OH'].push('East Cleveland')
        cityHash['PA'].push('East Rochester')
        cityHash['PA'].push('Mount Penn')
        cityHash['PA'].push('North Irwin')
        cityHash['PA'].push('Oberlin')
        cityHash['PA'].push('Steelton')
        cityHash['PA'].push('West Lawn')
        cityHash['PA'].push('West Penn')
        cityHash['PA'].push('West Pittston')
        cityHash['PA'].push('West Reading')
        cityHash['PA'].push('West York')
        cityHash['SC'].push('Saint Andrews')
        cityHash['TN'].push('West Knoxville')
        cityHash['VA'].push('North Chesterfield')
        cityHash['VA'].push('South Chesterfield')
        cityHash['VT'].push('West Brattleboro')
        cityHash['WA'].push('Spokane Valley')
        cityHash['WV'].push('Cheat Lake')
      }

      //Remove duplicates and sort from longest to shortest
      for (var key in cityHash) {
        var uSet = new Set(cityHash[key]);
        cityHash[key]= [...uSet];
        cityHash[key].sort(function(a, b) {
          return b.length - a.length;
        });
      }
      fs.writeFile('../data/'+country_code_lower+'-cities.json', JSON.stringify(cityHash), 'utf8', function() {
        console.log(cityHash);
      });

    });
}

function mergeFiles(inputs, output){
  let answer = inputs.reduce(function(result, current){
    let items = JSON.parse(fs.readFileSync(current));
    return Object.assign(result, items);
  }, {});
  fs.writeFile(output, JSON.stringify(answer), 'utf8', function(){
    console.log(answer);
  });
}

getDataForCountry("CA");
getDataForCountry("US");
getDataForCountry("PR");

mergeFiles(["../data/us-cities.json", "../data/ca-cities.json", "../data/pr-cities.json"], "../data/cities.json");
mergeFiles(["../data/us-states.json", "../data/ca-states.json"], "../data/states.json");
