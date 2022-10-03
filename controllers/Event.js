'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');

const { Parser } = require("json2csv");
const flatten = require("flat");

module.exports.getEventsByID = function getEventsByID (req, res, next, eventID) {
  Event.getEventsByID(eventID)
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
      if (body.hasOwnProperty('exportMode') && body.exportMode=="csv") {


        console.log("export as CSV !");
        //utils.writeCsv(res, response);


        const json2csv = new Parser();
        const jsonFlattened = [];

        // flattened each row to get a one-level json object
        response.forEach((rowResp) => {
          jsonFlattened.push(flatten(rowResp));
        });

        //const csv = json2csv.parse(response);
        const csv = json2csv.parse(jsonFlattened);


        res.header('Content-Type', 'text/csv');
        res.attachment("tempEvent.csv");
        return res.send(csv);        


      }
      else { // JSON
        utils.writeJson(res, response);
      }
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
