'use strict';

var path = require('path');
var http = require('http');

var oas3Tools = require('oas3-tools');
var serverPort = 8088;

var dbMongo = require ('./dbmongo.js');



// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
var app = expressAppConfig.getApp();

/*
var config = require ('./config/config.js');
var fs = require ('fs');

// get the hierarchyList
const speciesHierarchyFilePath = config.speciesHierarchyFilePath;
const tableTaxonHierarchy={};

let rawdataSpeciesHierarchy = fs.readFileSync(speciesHierarchyFilePath);
let speciesHierarchyList = JSON.parse(rawdataSpeciesHierarchy);
Object.entries(speciesHierarchyList).forEach(([key, val]) => {
  tableTaxonHierarchy[key]=val;
});
console.log(Object.keys(tableTaxonHierarchy).length+ " element(s) in tableTaxonHierarchy");
*/

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {

    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);

    dbMongo.connectToServer( function( err, client ) {
      if (err) console.log(err);
      console.log("connected");
    } );
});

