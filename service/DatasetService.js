'use strict';

var dbMongo = require ('../utils/dbmongo.js');
var stats = require ('../utils/statistics.js');

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
        // stats
        stats.addStat("getDatasetByID", datasetID);

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
 * exportMode String  (optional)
 * responseCoordinateSystem ResponseCoordinateSystem  (optional)
 * returns List
 **/
exports.getDatasetsBySearch = function(body,skip,take,exportMode,responseCoordinateSystem) {

  return new Promise(async function(resolve, reject) {
    var examples = {};
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

          }
        }

        var pipelineDate = {};

        // DATE FILTER
        if (body.hasOwnProperty('datum')) {
          pipelineDate=Event.getDateFilterForAggregate(body.datum);
        }

        // GEOGRAPHIC FILTER

        var siteIdArray=[];
        var noSiteMatch=false;

        if (body.hasOwnProperty('area')) {

          var listDataset=null;
          if (!allDatasetsAvailable) {
            listDataset = datasetAvailableIdArray;
          }

          siteIdArray = await Event.getGeographicFilterFromBodyArea(body.area, listDataset);
          if (siteIdArray.length==0) {
            //siteIdArray.push("NOSITEFOUND");
            noSiteMatch=true;
          }
        }

        var pipelineSite = {};

        // the siteIds from the geographic filter 
        if (body.hasOwnProperty('area') && body.area.hasOwnProperty('area') && siteIdArray.length==0) {
          console.log("no site to add to the pipelineEvent");
        }
        else if (siteIdArray.length>0) {
          pipelineSite={ "$in" : [ "$site.locationID", siteIdArray ] }
        }

        if (Object.entries(pipelineSite).length == 0 && Object.entries(pipelineDate).length == 0) {}
        else {

            var pipelineEvents=[];

            if (Object.entries(pipelineDate).length != 0)
              pipelineEvents = pipelineDate;
            if (Object.entries(pipelineSite).length != 0)
              pipelineEvents.push(pipelineSite);

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

        }

        var pipeline = [];

        if (noSiteMatch) { // must return 0
          pipeline.push({ "$match" : { "identifier" : { "$in" : ["NOSITEFOUND"] } } });
        }
        else {
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
        }

        // add the skip(start) param
        //console.log("SKIP :"+skip);
        if (!isNaN(skip) && skip >0) {
          pipeline.push({"$skip" : parseInt(skip)})
        }

        // add the take/limit param
        //console.log("TAKE :"+take);
        if (!isNaN(take) && take >0) {
          pipeline.push({"$limit" : parseInt(take)})
        }

        console.log("pipeline query dataset:");
        console.log(util.inspect(pipeline, false, null, true ));

        collDatasets.aggregate(pipeline).toArray(function(err, result) {
          if (err) {
            throw err;
            resolve();
          }

          console.log(result.length+" result(s)");
          
          // in order to deal with pagination, should return as well other parameters :
          // "skip": XX,
          // "take": YY,
          // "count": ZZ,
          var responseFinal = {
            "skip": parseInt(skip),
            "take": parseInt(take),
            "totalCount": result.length,
            "results": result
          }

          // stats
          stats.addStat("getDatasetsBySearch", "POST");

          resolve(responseFinal);
        });
        
      }
      else {
        resolve();
      }
    }
  });
}

