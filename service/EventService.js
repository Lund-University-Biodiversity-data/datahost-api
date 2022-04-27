'use strict';

var dbMongo = require ('../dbmongo.js');

/**
 * Get event by ID
 * Get event by ID
 *
 * eventId String EventId of the event to get
 * returns List
 **/
exports.getEventsByID = function(eventId) {

  return new Promise(function(resolve, reject) {
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
        var collEvents = dbMongo.getCollection("Events");
        collEvents.findOne({ "eventID": eventId }, (error, result) => {
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



async function getOccurrencesFromDyntaxaIdAsync (idsArray) {
  var collOccurrences = dbMongo.getCollection("Occurrences");
  let occs = await collOccurrences.find({"taxon.dyntaxaId":{"$in":idsArray}}).toArray();

  return occs;
}


async function getSitesFromCountiesAsync (idsArray) {
  var collSites = dbMongo.getCollection("Sites");
  let occs = await collSites.find({"county":{"$in":idsArray}}).toArray();

  return occs;
}


/**
 * Get event by search
 * Get event by search
 *
 * body EventsFilter Filter used to limit the search. (optional)
 * skip Integer Start index (optional)
 * take Integer Number of items to return. 1000 items is the max to return in one call. (optional)
 * returns List
 **/
exports.getEventsBySearch = function(body,skip,take) {
  return new Promise(async function(resolve, reject) {
    console.log("getEventsBySearch")
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      if(body) {
        var collOccurrences = dbMongo.getCollection("Occurrences");

        var eventIdArray=[];
        

        if (body.hasOwnProperty('taxon')) {

          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);
            var collEvents = dbMongo.getCollection("Events");

            let occs = await getOccurrencesFromDyntaxaIdAsync(idDyntaxaArray);

            if (occs) {
              occs.forEach(function(element, index) {
                eventIdArray.push(element.event);
              })
            }
          }
        }

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {
          if (body.area.hasOwnProperty('county')) {
            var countyArray=Object.values(body.area.county);
            let sits = await getSitesFromCountiesAsync(countyArray); 

            if (sits) {
              sits.forEach(function(element, index) {
                siteIdArray.push(element.locationID);
              })
            }

          }
        }

        // build the query filter
        var query;

        // with the eventIds from the taxon filter
        if (eventIdArray.length>0) {
          query = {"eventID":{"$in":eventIdArray}};
        }

        // and the siteIds from the county filter 
        if (siteIdArray.length>0) {
          query["site"]={"$in":siteIdArray};
        }

        collEvents.find(query).toArray(function(err, result) {
          console.log(result.length+" result(s)");
          //if (err) throw err;
          resolve(result);
        });

      }
      else {
        resolve();
      }
    }
  });
}

