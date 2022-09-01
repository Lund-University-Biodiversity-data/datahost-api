'use strict';


var config = require ('../config/config.js');
var fs = require('fs');


exports.getSpeciesHierarchy = function getSpeciesHierarchy () {

  const speciesHierarchyFilePath = config.speciesHierarchyFilePath;
  const tableTaxonHierarchy={};

  let rawdataSpeciesHierarchy = fs.readFileSync(speciesHierarchyFilePath);
  let speciesHierarchyList = JSON.parse(rawdataSpeciesHierarchy);
  Object.entries(speciesHierarchyList).forEach(([key, val]) => {
    tableTaxonHierarchy[key]=val;
  });
  console.log(Object.keys(tableTaxonHierarchy).length+ " element(s) in tableTaxonHierarchy");

  return tableTaxonHierarchy;

};