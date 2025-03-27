'use strict';

var utils = require('../utils/writer.js');
var Event = require('../service/EventService');
var config = require ('../config/config.js');

const { Parser } = require("json2csv");
const flatten = require("flat");

module.exports.getEventsByID = function getEventsByID (req, res, next, eventID) {

  var appNameId = "";
  if (config.biologginClientAppId == req.get("x-app-id"))
    appNameId=config.datahostClientAppName;

  Event.getEventsByID(appNameId, eventID)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getEventsBySearch = function getEventsBySearch (req, res, next, body, skip, take, exportMode, responseCoordinateSystem) {

  var appNameId = "";
  if (config.biologginClientAppId == req.get("x-app-id"))
    appNameId=config.datahostClientAppName;

  Event.getEventsBySearch(appNameId, body, skip, take, exportMode, responseCoordinateSystem)
    .then(function (response) {
      if (exportMode=="csv") {

        console.log("export as CSV !");
        //utils.writeCsv(res, response);

        const json2csv = new Parser();
        const jsonFlattened = [];

        // flattened each row to get a one-level json object
        // get the results object
        response.results.forEach((rowResp) => {
          // make sure to tranform the last column with the array of occurrences in a one-line string
          if ("occurrenceIds" in rowResp)
            rowResp["occurrenceIds"]=rowResp["occurrenceIds"].join(",");
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
