'use strict';


/**
 * Get occurrence by ID
 * Get occurrence by ID
 *
 * occurrenceId UUID OccurrenceId of the occurrence to get
 * returns List
 **/
exports.getOccurrencesByID = function(occurrenceId) {
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

