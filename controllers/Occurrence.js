'use strict';

var utils = require('../utils/writer.js');
var Occurrence = require('../service/OccurrenceService');

const { Parser } = require("json2csv");
const flatten = require("flat");

module.exports.getOccurrencesByID = function getOccurrencesByID (req, res, next, occurrenceId) {
  Occurrence.getOccurrencesByID(occurrenceId)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getOccurrencesBySearch = function getOccurrencesBySearch (req, res, next, body, skip, take, exportMode, responseCoordinateSystem) {
  Occurrence.getOccurrencesBySearch(body, skip, take, exportMode, responseCoordinateSystem)
    .then(function (response) {
      if (exportMode=="csv") {


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
        res.attachment("tempOcurrence.csv");
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
