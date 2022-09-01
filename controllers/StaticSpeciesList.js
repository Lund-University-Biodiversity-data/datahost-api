'use strict';

var utils = require('../utils/writer.js');
var fs = require('fs');

module.exports.getSpeciesList = function getSpeciesList (req, res, next, id) {

  fs.readFile(__dirname + "/../public/speciesFiles/species.json",  function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
};

/*
module.exports.getSpeciesHierarchy = function getSpeciesHierarchy (req, res, next, id) {

  fs.readFile(__dirname + "/../public/speciesFiles/speciesHierarchy.json",  function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });
  
};
*/