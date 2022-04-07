'use strict';

var utils = require('../utils/writer.js');
var Occurrence = require('../service/OccurrenceService');

module.exports.getOccurrencesByID = function getOccurrencesByID (req, res, next, occurrenceId) {
  Occurrence.getOccurrencesByID(occurrenceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getOccurrencesBySearch = function getOccurrencesBySearch (req, res, next, body, skip, take) {
  Occurrence.getOccurrencesBySearch(body, skip, take)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
