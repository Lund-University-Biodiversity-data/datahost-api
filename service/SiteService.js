'use strict';

var dbMongo = require ('../dbmongo.js');

// returns all sites coordinates
exports.getAllSitesCoordinates = async function(datasetList) {

  var collSites = dbMongo.getCollection("Sites");
  
  var queryParam={};

  if (datasetList != null) {
    queryParam["datasetID"]= { "$in" : datasetList};
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
