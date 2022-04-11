'use strict';

var dbMongo = require ('../dbmongo.js');

/**
 * Get event by ID
 * Get event by ID
 *
 * eventId UUID EventId of the event to get
 * returns List
 **/
exports.getEventsByID = function(eventId) {

  console.log("ici getEventsByID");
  console.log(eventId);
  return new Promise(function(resolve, reject) {
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
        console.log("avant coll getEventsByID");

        var collEvents = dbMongo.getCollection("Events");
        console.log(eventId);
        collEvents.findOne({ "eventID": eventId }, (error, result) => {
          if(error) {
            console.log("500");
            resolve(500);
              //return response.status(500).send(error);
          }
          console.log("pas d'erreur c'est carré");
          console.log(result);
          resolve(result);
          //response.send(result);
        });
    }
  });
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
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

