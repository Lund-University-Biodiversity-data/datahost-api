'use strict';

var dbMongo = require ('../utils/dbmongo.js');
var stats = require ('../utils/statistics.js');

var Event = require('../service/EventService');
var Species = require('../service/SpeciesService');

const util = require('util');

exports.getListTaxonIncludingHierarchy = function (idsArray) {

  const listTaxonIncludingHierarchy =[];

  const tableTaxonHierarchy = Species.getSpeciesHierarchy();

  idsArray.forEach((element) => {
    if (element!="None selected") {
      // check if this dyntaxaId has childdrenIds to add
      if (tableTaxonHierarchy[element] !== undefined) {
        //console.log(element+ " has children ! => "+tableTaxonHierarchy[element].length);
        tableTaxonHierarchy[element].forEach((child) => {
          if (!listTaxonIncludingHierarchy.includes(child)) {
            listTaxonIncludingHierarchy.push(parseInt(child));
          }
          else {
            //console.log("child "+child+" already in listTaxonIncludingHierarchy");
          }
        });

      }
      listTaxonIncludingHierarchy.push(element);
    }
  });

  console.log(idsArray.length+" in idsArray => "+listTaxonIncludingHierarchy.length+" in the end including hierarchy");

  return listTaxonIncludingHierarchy;
}


// SOON USELESS
// returns all the occurrences based on taxonID array
// includes all the speciesHierarchy
exports.getOccurrencesFromDyntaxaIdAsync = async function (idsArray) {

  //console.log("list species final :");
  //console.log(listTaxonIncludingHierarchy);

  var listTaxonIncludingHierarchy = this.getListTaxonIncludingHierarchy(idsArray);

  var collOccurrences = dbMongo.getCollection("Occurrences");
  let occs = await collOccurrences.find({"taxon.dyntaxaId":{"$in":listTaxonIncludingHierarchy}}).toArray();

  return occs;
}




/**
 * Get occurrence by ID
 * Get occurrence by ID
 *
 * occurrenceId String OccurrenceId of the occurrence to get
 * returns List
 **/
exports.getOccurrencesByID = function(appNameId, occurrenceId) {
  return new Promise(function(resolve, reject) {
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      var collOccurrences = dbMongo.getCollection("Occurrences");
      collOccurrences.findOne({ "occurrenceID": occurrenceId }, (error, result) => {
        if(error) {
          resolve(500);
            //return response.status(500).send(error);
        }
        // stats
        stats.addStat(appNameId, "getOccurrencesByID", occurrenceId);

        resolve(result);
        //response.send(result);
      });
    }
  });
}


/**
 * Get occurrences by search
 * Get occurrences by search
 *
 * body OccurrenceFilter Filter used to limit the search. (optional)
 * skip Integer Start index (optional)
 * take Integer Number of items to return. 1000 items is the max to return in one call. (optional)
 * exportMode String  (optional)
 * responseCoordinateSystem ResponseCoordinateSystem  (optional)
 * returns List
 **/
exports.getOccurrencesBySearch = function(appNameId, body,skip,take,exportMode,responseCoordinateSystem) {

  /*console.log("params (body/skip/take/exportMode):");
  console.log(body);
  console.log(skip);
  console.log(take);
  console.log(exportMode);*/

  return new Promise(async function(resolve, reject) {
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      if(body) {
        var collOccurrences = dbMongo.getCollection("Occurrences");
        var collEvents = dbMongo.getCollection("Events");

        var eventIdArray=[];
        
        // build the query filter, defined as an object (and NOT an array)
        var queryOccurrence = {};
        var queryEvent = {};

        var joinEvents={};

        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {


            var idDyntaxaArray=Object.values(body.taxon.ids);
            
            var listTaxonIncludingHierarchy=exports.getListTaxonIncludingHierarchy(idDyntaxaArray);


            //queryOccurrence["taxon.dyntaxaId"]={"$in":body.taxon.ids};
            queryOccurrence["taxon.dyntaxaId"]={"$in":listTaxonIncludingHierarchy};
          }
        }

        var pipelineDate = {};

        // DATE FILTER
        if (body.hasOwnProperty('datum')) {
          
          var queryDate=Event.getDateFilterFromBody(body);

          if (typeof queryDate["eventStartDate"] !== 'undefined' && queryDate["eventStartDate"]!="" && queryDate["eventStartDate"] !== null) queryEvent["eventStartDate"]=queryDate["eventStartDate"];
          if (typeof queryDate["eventEndDate"] !== 'undefined' && queryDate["eventEndDate"]!="" && queryDate["eventEndDate"] !== null) queryEvent["eventEndDate"]=queryDate["eventEndDate"];
          
          //pipelineDate=Event.getDateFilterForAggregate(body.date);
        }


        
        // GEOGRAPHIC FILTER

        var siteIdArray=[];
        
        if (body.hasOwnProperty('area')) {

          var listDataset=null;
          if (body.hasOwnProperty('datasetIds')) {
            listDataset = body.datasetIds;
          }

          siteIdArray = await Event.getGeographicFilterFromBodyArea(body.area, listDataset);
          if (siteIdArray.length==0) siteIdArray.push("NOSITEFOUND");
        }
        

        // the siteIds from the geographic filter 
        if (siteIdArray.length>0) {
          queryEvent["site.locationID"]={"$in":siteIdArray};
        }

        
        if (queryEvent.hasOwnProperty('site.locationID') || queryEvent.hasOwnProperty('eventStartDate') || queryEvent.hasOwnProperty('eventEndDate')) {

          // add the dataset filter as well
          if (body.hasOwnProperty('datasetIds')) {
            queryEvent["datasetID"] = {"$in":body.datasetIds};
          }

          console.log("queryEvent:");
          console.log(queryEvent);

          let events = await collEvents.find(queryEvent).toArray();
          events.forEach(function(element, index) {
            eventIdArray.push(element.eventID);
          })

          if (eventIdArray.length==0) {
            eventIdArray.push("NOEVENTFOUND");
          }
        }
        

        // set the datasetIds filter
        if (body.hasOwnProperty('datasetIds')) {
          queryOccurrence["datasetID"]={"$in":body.datasetIds};
        }


        
        // with the eventsIDs 
        if (eventIdArray.length>0) {
          queryOccurrence["eventID"]={"$in":eventIdArray};
        }
        console.log("queryOccurrence:");
        //console.log(queryOccurrence);

        var takeInt=0;
        // add the take/limit param
        //console.log("TAKE :"+take);
        if (!isNaN(take) && take >0) {
          takeInt=parseInt(take);
        }

        var skipInt=0;
        // add the skip(start) param
        //console.log("SKIP :"+skip);
        if (!isNaN(skip) && skip >0) {
          skipInt=parseInt(skip);
        }



        if (queryOccurrence.hasOwnProperty('eventID') || queryOccurrence.hasOwnProperty('taxon.dyntaxaId') || queryOccurrence.hasOwnProperty('datasetID')) {

          collOccurrences.find(queryOccurrence).skip(skipInt).limit(takeInt).toArray(function(err, result) {
            if (err) {
              throw err;
              resolve(0);
            }

            console.log(result.length+" result(s)");

            // in order to deal with pagination, should return as well other parameters :
            // "skip": XX,
            // "take": YY,
            // "count": ZZ,
            var responseFinal = {
              "skip": skipInt,
              "take": takeInt,
              "totalCount": result.length,
              "results": result
            }

            // stats
            stats.addStat(appNameId, "getOccurrencesBySearch", "POST");

            resolve(responseFinal);
          });        
        } else {
          resolve();
        }
        

      }
      else {
        resolve();
      }
    }
  });
}

