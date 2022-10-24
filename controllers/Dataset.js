'use strict';

var utils = require('../utils/writer.js');
var Dataset = require('../service/DatasetService');

const { Parser } = require("json2csv");
const flatten = require("flat");

module.exports.getDatasetByID = function getDatasetByID (req, res, next, id) {
  Dataset.getDatasetByID(id)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};

module.exports.getDatasetsBySearch = function getDatasetsBySearch (req, res, next, body, skip, take) {
  Dataset.getDatasetsBySearch(body, skip, take)
    .then(function (response) {
      if (body.hasOwnProperty('exportMode') && body.exportMode=="csv") {


        console.log("export as CSV !");
        //utils.writeCsv(res, response);


        const json2csv = new Parser();
        const jsonFlattened = [];

        // flattened each row to get a one-level json object
        response.forEach((rowResp) => {

          // make sure to tranform the last column with the array of events in a one-line string
          rowResp["events"]=rowResp["events"].join(",");

          jsonFlattened.push(flatten(rowResp));
        });

        //const csv = json2csv.parse(response);
        const csv = json2csv.parse(jsonFlattened);


        res.header('Content-Type', 'text/csv');
        res.attachment("tempDataset.csv");
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
