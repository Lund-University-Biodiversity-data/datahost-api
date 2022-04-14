'use strict';

var dbMongo = require ('../dbmongo.js');


/**
 * Get dataset by ID
 * Get dataset by ID
 *
 * id String ID of the dataset to get
 * returns List
 **/
exports.getDatasetByID = function(datasetID) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    /*examples['application/json'] = [ {
  "identifier" : "identifier",
  "metadatalanguage" : "Engelska",
  "purpose" : "nationell miljöövervakning",
  "endDate" : "2000-01-23",
  "assigner" : {
    "organisationID" : "2021001975",
    "organisationCode" : "Naturvårdsverket"
  },
  "description" : "description",
  "language" : "Svenska",
  "title" : "Svensk Fågeltaxering: Standardrutterna",
  "dataStewardship" : "Datavärdskap Naturdata: Fåglar och fjärilar",
  "projectCode" : "Svensk Fågeltaxering",
  "accessRights" : "publik",
  "spatial" : "Sverige",
  "projectID" : "projectID",
  "methodology" : [ {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  }, {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  } ],
  "startDate" : "1996-05-23T00:00:00.000+00:00",
  "events" : [ "d9baea4e-2436-4481-accb-7c2fe835039e", "60152666-8c2c-4d33-a5c8-da1dda106c5d", "c4eaa558-83cc-4b94-9aff-1aefdc204794", "273998e3-3138-41eb-b740-28ee53f7e344" ]
}, {
  "identifier" : "identifier",
  "metadatalanguage" : "Engelska",
  "purpose" : "nationell miljöövervakning",
  "endDate" : "2000-01-23",
  "assigner" : {
    "organisationID" : "2021001975",
    "organisationCode" : "Naturvårdsverket"
  },
  "description" : "description",
  "language" : "Svenska",
  "title" : "Svensk Fågeltaxering: Standardrutterna",
  "dataStewardship" : "Datavärdskap Naturdata: Fåglar och fjärilar",
  "projectCode" : "Svensk Fågeltaxering",
  "accessRights" : "publik",
  "spatial" : "Sverige",
  "projectID" : "projectID",
  "methodology" : [ {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  }, {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  } ],
  "startDate" : "1996-05-23T00:00:00.000+00:00",
  "events" : [ "d9baea4e-2436-4481-accb-7c2fe835039e", "60152666-8c2c-4d33-a5c8-da1dda106c5d", "c4eaa558-83cc-4b94-9aff-1aefdc204794", "273998e3-3138-41eb-b740-28ee53f7e344" ]
} ];*/
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      console.log("datasetID:"+datasetID);
      console.log("get collection");
      var collDatasets = dbMongo.getCollection("Datasets");
      console.log("findone");
      collDatasets.findOne({ "identifier": datasetID }, (error, result) => {
        if(error) {
          resolve(500);
            //return response.status(500).send(error);
        }
        resolve(result);
        //response.send(result);
      });
    }
  });
}


/**
 * Get datasets by search
 * Get datasets by search
 *
 * body DatasetFilter Filter used to limit the search. (optional)
 * skip Integer Start index (optional)
 * take Integer Number of items to return. 1000 items is the max to return in one call. (optional)
 * returns List
 **/
exports.getDatasetsBySearch = function(body,skip,take) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "identifier" : "identifier",
  "metadatalanguage" : "Engelska",
  "purpose" : "nationell miljöövervakning",
  "endDate" : "2000-01-23",
  "assigner" : {
    "organisationID" : "2021001975",
    "organisationCode" : "Naturvårdsverket"
  },
  "description" : "description",
  "language" : "Svenska",
  "title" : "Svensk Fågeltaxering: Standardrutterna",
  "dataStewardship" : "Datavärdskap Naturdata: Fåglar och fjärilar",
  "projectCode" : "Svensk Fågeltaxering",
  "accessRights" : "publik",
  "spatial" : "Sverige",
  "projectID" : "projectID",
  "methodology" : [ {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  }, {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  } ],
  "startDate" : "1996-05-23T00:00:00.000+00:00",
  "events" : [ "d9baea4e-2436-4481-accb-7c2fe835039e", "60152666-8c2c-4d33-a5c8-da1dda106c5d", "c4eaa558-83cc-4b94-9aff-1aefdc204794", "273998e3-3138-41eb-b740-28ee53f7e344" ]
}, {
  "identifier" : "identifier",
  "metadatalanguage" : "Engelska",
  "purpose" : "nationell miljöövervakning",
  "endDate" : "2000-01-23",
  "assigner" : {
    "organisationID" : "2021001975",
    "organisationCode" : "Naturvårdsverket"
  },
  "description" : "description",
  "language" : "Svenska",
  "title" : "Svensk Fågeltaxering: Standardrutterna",
  "dataStewardship" : "Datavärdskap Naturdata: Fåglar och fjärilar",
  "projectCode" : "Svensk Fågeltaxering",
  "accessRights" : "publik",
  "spatial" : "Sverige",
  "projectID" : "projectID",
  "methodology" : [ {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  }, {
    "methodologyLink" : "http://example.com/aeiou",
    "methodologyDescription" : "methodologyDescription",
    "speciesList" : "http://example.com/aeiou",
    "methodologyName" : "methodologyName"
  } ],
  "startDate" : "1996-05-23T00:00:00.000+00:00",
  "events" : [ "d9baea4e-2436-4481-accb-7c2fe835039e", "60152666-8c2c-4d33-a5c8-da1dda106c5d", "c4eaa558-83cc-4b94-9aff-1aefdc204794", "273998e3-3138-41eb-b740-28ee53f7e344" ]
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

