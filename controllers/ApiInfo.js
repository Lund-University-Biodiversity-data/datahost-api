'use strict';

var utils = require('../utils/writer.js');
var Default = require('../service/ApiInfoService');

module.exports.getApiInfo = function getApiInfo (req, res, next) {
  Default.getApiInfo()
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
