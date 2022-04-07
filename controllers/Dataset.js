'use strict';

var utils = require('../utils/writer.js');
var Dataset = require('../service/DatasetService');

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
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
