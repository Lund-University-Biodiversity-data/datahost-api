'use strict';

var express = require('express');
var app = express();
var myApp = require('./datahostServerApiV1').app;
var http = require('http');
var serverPort = 8088;
var config = require ('./config/config.js');
var dbMongo = require ('./utils/dbmongo.js');

app.use(config.apiServerUrlVersion, myApp);
//app.use("/datahostServerApiV1", myApp);

http.createServer(app).listen(serverPort, function () {

    console.log('Your server is listening on port %d (http://localhost:%d%s)', serverPort, serverPort, config.apiServerUrlVersion);
    console.log('Swagger-ui is available on http://localhost:%d%s/docs', serverPort, config.apiServerUrlVersion);

    dbMongo.connectToServer( function( err, client ) {
      if (err) console.log(err);
      console.log("connected");
    } );
});