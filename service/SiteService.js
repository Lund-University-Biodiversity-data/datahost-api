'use strict';

var dbMongo = require ('../dbmongo.js');

exports.getAllSitesCoordinates = async function() {
//async function getAllSitesCoordinates () {
  var collSites = dbMongo.getCollection("Sites");
  let sitesCoordinates = await collSites.find({},{"emplacement":1}).toArray();

  return sitesCoordinates;
}





/* TEST */

/*
var geolib = require('geolib');

var distance = geolib.getDistance(
      { latitude: 51.5103, longitude: 7.49347 },
    { latitude: "51° 31' N", longitude: "7° 28' E" }
    );
console.log(distance);

var distance = geolib.getDistance(
      { latitude: 58.6451, longitude: 11.77963 },
    { latitude: 58.66968, longitude: 11.71052 }
    );
console.log(distance);
*/

/* FIN TEST */