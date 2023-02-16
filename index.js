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

http.createServer(app).listen(config.apiServerPort, function () {

    console.log('Your server is listening on port %d (%s%s)', config.apiServerPort, config.apiServerUrl, config.apiServerUrlVersion);
    console.log('Swagger-ui is available on %s%s/docs', config.apiServerUrl, config.apiServerUrlVersion);

    dbMongo.connectToServer( function( err, client ) {
      if (err) console.log(err);
      console.log("connected");
    } );
});