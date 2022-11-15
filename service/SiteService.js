'use strict';

var dbMongo = require ('../dbmongo.js');

// returns all sites coordinates
exports.getAllSitesCoordinates = async function(datasetIds) {

  var collSites = dbMongo.getCollection("Sites");
  
  var queryParam={};

  if (datasetIds != null) {
    queryParam["datasetID"]= { "$in" : datasetIds};
  }

  let sitesCoordinates = await collSites.find(queryParam,{"emplacement":1}).toArray();

  return sitesCoordinates;
}

// returns all sites that belongs to specific counties (input array)
exports.getSitesFromCountiesAsync = async function (idsArray) {
  var collSites = dbMongo.getCollection("Sites");
  let sites = await collSites.find({"county":{"$in":idsArray}}).toArray();

  return sites;
}
