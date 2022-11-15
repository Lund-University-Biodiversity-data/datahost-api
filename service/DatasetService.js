'use strict';

var dbMongo = require ('../dbmongo.js');

var Site = require('../service/SiteService');
var Event = require('../service/EventService');
var Occurrence = require('../service/OccurrenceService');

const util = require('util');

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

        var datasetAvailableIdArray=[];
        var datasetIdArray=[];

        var allDatasetsAvailable=true;

        // set the datasetIds filter
        if (body.hasOwnProperty('datasetIds')) {
          allDatasetsAvailable=false;
          datasetAvailableIdArray=body.datasetIds;
        }

        var joinEvents={};
        var joinOccurrences={};

        var noDataset=false;
        
        // TAXON FILTER

        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {

            var idDyntaxaArray=Object.values(body.taxon.ids);
            
            var listTaxonFinal=Occurrence.getListTaxonIncludingHierarchy(idDyntaxaArray);

            // join with the view viewDyntaxaIdDatasetId (dyntaxaId/datasetID) on the datasetID/identifier
            // limit to the fields needed, to avoid large data in the temp buffer and the 16MB limit outreached
            joinOccurrences["$lookup"]= {
              "from": 'viewDyntaxaIdDatasetId',
              "let": { "identifier": "$identifier" },
              "pipeline": [
                { 
                  "$match": {
                    "$expr": {
                      "$and": [
                        { "$in" : [ "$dyntaxaId", listTaxonFinal ] },
                        { "$eq": [ "$datasetID", "$$identifier" ] } ,
                      ]
                    } 
                  }
                }
              ],
              as: "rec"
            };
            // keep only the datasets with values in the occurrences join
            joinOccurrences["$match"] = {
              "rec": {"$ne": []}
            } ;
            // do not return the records, only the dataset data is needed
            joinOccurrences["$project"] = {
              "rec": 0
            } ;

            /* example 
              {
                '$lookup': {
                  from: 'records',
                  let: { identifier: "$identifier" },
                  pipeline: [
                    { '$project': { datasetID: 1, "taxon.dyntaxaId": 1 } },
                    { 
                      $match: {
                        $expr: {
                          $and: [
                            { $in : [ "$taxon.dyntaxaId", [100062, 102933] ] },
                            { $eq: [ "$datasetID", "$$identifier" ] } ,
                          ]
                        } 
                      }
                    }
                  ],
                  as: "rec"
                }
              },
              { '$project': { rec: 0 } }
              */
          }
        }

        var pipelineDate = {};

        // DATE FILTER
        if (body.hasOwnProperty('datum')) {
          pipelineDate=Event.getDateFilterForAggregate(body.datum);
        }

        // GEOGRAPHIC FILTER

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {

          var listDataset=null;
          if (!allDatasetsAvailable) {
            listDataset = datasetAvailableIdArray;
          }

          siteIdArray = await Event.getGeographicFilterFromBodyArea(body.area, listDataset);
        }

        var pipelineSite = {};

        // the siteIds from the geographic filter 
        if (body.hasOwnProperty('area') && body.area.hasOwnProperty('area') && siteIdArray.length==0) {
          console.log("no site to add to the pipelineEvent");
        }
        else if (siteIdArray.length>0) {
          pipelineSite={ "$in" : [ "$site", siteIdArray ] }
        }

        if (Object.entries(pipelineSite).length == 0 && Object.entries(pipelineDate).length == 0) {}
        else {

            var pipelineEvents=[];

            if (Object.entries(pipelineDate).length != 0)
              pipelineEvents = pipelineDate;
            if (Object.entries(pipelineSite).length != 0)
              pipelineEvents.push(pipelineSite);
//console.log("pipelineEvents:");
//console.log(pipelineEvents);

            joinEvents["$lookup"]= {
              "from": 'events',
              "let": { "identifier": "$identifier" },
              "pipeline": [
                { '$project': { "datasetID": 1, "eventID": 1, "eventEndDate": 1, "eventStartDate":1, "site": 1 } },
                { 
                  "$match": {
                    "$expr": {
                      "$and": [
                        pipelineEvents,
                        { $eq: [ "$datasetID", "$$identifier" ] } 
                      ]
                    } 
                  }
                }
              ],
              as: "ev"
            }
            // keep only the datasets with values in the occurrences join
            joinEvents["$match"] = {
              "ev": {"$ne": []}
            } ;
            // do not return the records, only the dataset data is needed
            joinEvents["$project"] = { "ev": 0 }; 

            /* EXAMPLE
              {
              '$lookup': {
                from: 'events',
                let: { identif: "$identifier" },
                pipeline: [
                  { '$project': { datasetID: 1, eventID: 1, eventEndDate: 1, eventStartDate:1 } },
                  { 
                    $match: {
                      $expr: {
                        $and: [
                          { $gte : [ "$eventStartDate", '1995-04-25T00:00:01+0200' ] },
                          { $lte : [ '$eventEndDate', '1995-05-25T00:00:01+0200' ] },
                          { $eq: [ "$datasetID", "$$identif" ] } 
                        ]
                      } 
                    }
                  }
                ],
                as: 'ev'
              }
            },
            {
              '$match': {
                "ev": {"$ne": []}
              }
            },
            { '$project': { ev: 0 } },
          */
        }

        var pipeline = [];


        // filter on the datasetIds
        if (!allDatasetsAvailable) {
          pipeline.push({ "$match" : { "identifier" : { "$in" : datasetAvailableIdArray } } });
        }

        if (Object.entries(joinEvents).length != 0) {
          pipeline.push({ "$lookup" : joinEvents["$lookup"] });
          pipeline.push({ "$match" : joinEvents["$match"] });
          pipeline.push({ "$project" : joinEvents["$project"] });
        }

        if (Object.entries(joinOccurrences).length != 0) {
          pipeline.push({ "$lookup" : joinOccurrences["$lookup"] });
          pipeline.push({ "$match" : joinOccurrences["$match"] });
          pipeline.push({ "$project" : joinOccurrences["$project"] });
        }


        console.log("pipeline query:");
        console.log(util.inspect(pipeline, false, null, true ));

        collDatasets.aggregate(pipeline).toArray(function(err, result) {
          if (err) {
            throw err;
            resolve();
          }

          console.log(result.length+" result(s)");
          
          resolve(result);
        });
        
      }
      else {
        resolve();
      }
    }
  });
}

