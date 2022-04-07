'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

module.exports.getEventsByID = function getEventsByID (req, res, next, eventId) {
  Event.getEventsByID(eventId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEventsBySearch = function getEventsBySearch (req, res, next, body, skip, take) {
  Event.getEventsBySearch(body, skip, take)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
