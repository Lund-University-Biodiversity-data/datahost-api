'use strict';

var dbMongo = require ('../dbmongo.js');

var Site = require('../service/SiteService');
var Event = require('../service/EventService');
var Occurrence = require('../service/OccurrenceService');
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
  return new Promise(async function(resolve, reject) {
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
      if(body) {
        var collDatasets = dbMongo.getCollection("Datasets");
        var collEvents = dbMongo.getCollection("Events");

        var datasetIdArray=[];
        
        // build the query filter, defined as an object (and NOT an array)
        var queryDataset = {};
        var queryEvent = {};

        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);

            let occs = await Occurrence.getOccurrencesFromDyntaxaIdAsync(idDyntaxaArray);

            if (occs) {
              occs.forEach(function(element, index) {
                if (!datasetIdArray.includes(element.datasetID)) datasetIdArray.push(element.datasetID);
              })
            }
          }
        }

        // DATE FILTER
        if (body.hasOwnProperty('datum')) {

          var queryDate=Event.getDatumFilterFromBody(body);

          if (queryDate["eventStartDate"]!="") queryEvent["eventStartDate"]=queryDate["eventStartDate"];
          if (queryDate["eventEndDate"]!="") queryEvent["eventEndDate"]=queryDate["eventEndDate"];

        }

        // GEOGRAPHIC FILTER

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {
          siteIdArray = await Event.getGeographicFilterFromBody(body);
        }

        // the siteIds from the geographic filter 
        if (body.hasOwnProperty('area') && body.area.hasOwnProperty('area') && siteIdArray.length==0) {
          queryEvent["site"]="NORESULT";
        }
        else if (siteIdArray.length>0) {
          queryEvent["site"]={"$in":siteIdArray};
        }
        
        console.log("queryEvent:");
        console.log(queryEvent);

        let events = await collEvents.find(queryEvent).toArray();
        events.forEach(function(element, index) {
          if (!datasetIdArray.includes(element.datasetID)) datasetIdArray.push(element.datasetID);
        })

        // with the datasetIds 
        if (datasetIdArray.length>0) {
          queryDataset["identifier"]={"$in":datasetIdArray};

          console.log("queryDataset:");
          console.log(queryDataset);

          collDatasets.find(queryDataset).toArray(function(err, result) {
            console.log(result.length+" result(s)");
            //if (err) throw err;
            resolve(result);
          });
        }
        else {
          resolve();
        }

        

      }
      else {
        resolve();
      }
    }
  });
}

