
const MongoClient = require("mongodb").MongoClient;
const config = require("../config/config.js");

const statDBUrl = config.databaseStatisticsUrl;
const statDBName = config.databaseStatisticsName;
const statDBTable = config.databaseStatisticsTable;

module.exports = {

  addStat: function(appNameId, endpointApi, objectId) {

    MongoClient.connect(statDBUrl, function(err, db) {
      if (err) throw err;
      var dbo = db.db(statDBName);

      var todaynow = new Date().toISOString()

      var myobj = { date: todaynow, appNameId: appNameId, endpointAPI: endpointApi, objectID: objectId };
      dbo.collection(statDBTable).insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 stat inserted");
        db.close();
      });
    });


  }

};
