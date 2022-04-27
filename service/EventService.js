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



async function getOccurrencesAsync (idsArray) {
  var collOccurrences = dbMongo.getCollection("Occurrences");
  let occs = await collOccurrences.find({"taxon.dyntaxaId":{"$in":idsArray}}).toArray();

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

        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idsArray=Object.values(body.taxon.ids);
            var collEvents = dbMongo.getCollection("Events");

            var eventIdArray=[];
            
            let occs = await getOccurrencesAsync (idsArray);

            if (occs) {
              occs.forEach(function(element, index) {
                eventIdArray.push(element.event);
              })
            }

            collEvents.find({"eventID":{"$in":eventIdArray}}).toArray(function(err, result) {
              //if (err) throw err;
              resolve(result);
            });
          }
        }

      }
      else {
        resolve();
      }
    }
  });
}

