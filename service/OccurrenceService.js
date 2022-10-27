'use strict';

var dbMongo = require ('../dbmongo.js');

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
exports.getOccurrencesByID = function(occurrenceId) {
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
 * returns List
 **/
exports.getOccurrencesBySearch = function(body,skip,take) {
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

            /*
            const listTaxonIncludingHierarchy =[];
            const tableTaxonHierarchy = Species.getSpeciesHierarchy();

            body.taxon.ids.forEach((element) => {
              if (element!="None selected") {
                // check if this dyntaxaId has childdrenIds to add
                if (tableTaxonHierarchy[element] !== undefined) {
                  //console.log(element+ " has children ! => "+tableTaxonHierarchy[element].length);
                  tableTaxonHierarchy[element].forEach((child) => {
                    if (!listTaxonIncludingHierarchy.includes(child)) {
                      listTaxonIncludingHierarchy.push(parseInt(child));
                    }
                    else {
                      console.log("child "+child+" already in listTaxonIncludingHierarchy");
                    }
                  });
                }
                listTaxonIncludingHierarchy.push(element);
              }
            });

            //console.log("list species final :");
            //console.log(listTaxonIncludingHierarchy);

            console.log(body.taxon.ids.length+" in idsArray => "+listTaxonIncludingHierarchy.length+" in the end including hierarchy");
            */

            //queryOccurrence["taxon.dyntaxaId"]={"$in":body.taxon.ids};
            queryOccurrence["taxon.dyntaxaId"]={"$in":listTaxonIncludingHierarchy};
          }
        }

        var pipelineDate = {};

        // DATE FILTER
        if (body.hasOwnProperty('datum')) {
          /*
          var queryDate=Event.getDatumFilterFromBody(body);

          if (typeof queryDate["eventStartDate"] !== 'undefined' && queryDate["eventStartDate"]!="" && queryDate["eventStartDate"] !== null) queryEvent["eventStartDate"]=queryDate["eventStartDate"];
          if (typeof queryDate["eventEndDate"] !== 'undefined' && queryDate["eventEndDate"]!="" && queryDate["eventEndDate"] !== null) queryEvent["eventEndDate"]=queryDate["eventEndDate"];
          */
          pipelineDate=Event.getDatumFilterForAggregate(body.datum);
        }


        
        // GEOGRAPHIC FILTER

        var siteIdArray=[];
        
        if (body.hasOwnProperty('area')) {

          var listDataset=null;
          if (body.hasOwnProperty('datasetList')) {
            listDataset = body.datasetList;
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

        // the siteIds from the geographic filter 
        if (siteIdArray.length>0) {
          queryEvent["site"]={"$in":siteIdArray};
        }

        /*
        if (queryEvent.hasOwnProperty('site') || queryEvent.hasOwnProperty('eventStartDate') || queryEvent.hasOwnProperty('eventEndDate')) {
          //console.log("queryEvent:");
          //console.log(queryEvent);

          let events = await collEvents.find(queryEvent).toArray();
          events.forEach(function(element, index) {
            eventIdArray.push(element.eventID);
          })
        }
        */
        
        if (Object.entries(pipelineSite).length == 0 && Object.entries(pipelineDate).length == 0) {}
        else {

            var pipelineEvents=[];

            if (Object.entries(pipelineDate).length != 0)
              pipelineEvents = pipelineDate;
            if (Object.entries(pipelineSite).length != 0)
              pipelineEvents.push(pipelineSite);

            // add the datasetfilter in case it exists
            if (body.hasOwnProperty('datasetList')) {
              pipelineEvents.push({"$in": [ "$datasetID", body.datasetList ] });
            }

            // join with events fields
            pipelineEvents.push({ $eq: [ "$eventID", "$$eventID" ] } )

console.log("pipelineEvents:");
console.log(pipelineEvents);

            joinEvents["$lookup"]= {
              "from": 'events',
              "let": { "eventID": "$event" },
              "pipeline": [
                { '$project': { "eventID": 1, "eventEndDate": 1, "eventStartDate":1, "site": 1, "datasetID": 1 } },
                { 
                  "$match": {
                    "$expr": {
                      "$and": 
                        pipelineEvents,
                      
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
              db.records.aggregate([
                { '$match' : {
                  "taxon.dyntaxaId": {$in : [100052]}
                }},
                {
                  '$lookup': {
                    from: 'events',
                    let: { eventID: "$event" },
                    pipeline: [
                      { '$project': { eventID: 1, eventEndDate: 1, eventStartDate:1, site:1  } },
                      { 
                        $match: {
                          $expr: {
                            $and: [
                              { $gte : [ "$eventStartDate", '2010-04-25T00:00:01+0200' ] },
                              { $lte : [ '$eventEndDate', '2020-05-25T00:00:01+0200' ] },
                              { $eq: [ "$eventID", "$$eventID" ] } 
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
                { '$project': { ev: 0 } }
              ])

          */
        }

        // set the datasetList filter
        if (body.hasOwnProperty('datasetList')) {
          queryOccurrence["datasetID"]={"$in":body.datasetList};
        }

        console.log("queryOccurrence:");
        console.log(queryOccurrence);

        /*
        // with the eventsIDs 
        if (eventIdArray.length>0) {
          queryOccurrence["event"]={"$in":eventIdArray};
        }



        if (queryOccurrence.hasOwnProperty('event') || queryOccurrence.hasOwnProperty('taxon.dyntaxaId') || queryOccurrence.hasOwnProperty('datasetID')) {

          collOccurrences.find(queryOccurrence).toArray(function(err, result) {
            if (err) {
              throw err;
              resolve(0);
            }

            console.log(result.length+" result(s)");

            resolve(result);
          });        
        } else {
          resolve();
        }
        */

        var pipeline = [];

        if (Object.entries(queryOccurrence).length != 0) {
          pipeline.push({ "$match" : queryOccurrence });
        }

        if (Object.entries(joinEvents).length != 0) {
          pipeline.push({ "$lookup" : joinEvents["$lookup"] });
          pipeline.push({ "$match" : joinEvents["$match"] });
          pipeline.push({ "$project" : joinEvents["$project"] });
        }

        console.log("pipeline query:");
        console.log(util.inspect(pipeline, false, null, true ));

        collOccurrences.aggregate(pipeline).toArray(function(err, result) {
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

