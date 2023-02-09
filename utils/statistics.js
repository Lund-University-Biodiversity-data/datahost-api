


const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "datahost_statistics";
const TABLE_STATS_SERVER = "statsServer";

const LIMIT_MAX = 50;


module.exports = {

  addStat: function(endpointApi, objectId) {

    MongoClient.connect(CONNECTION_URL, function(err, db) {
      if (err) throw err;
      var dbo = db.db(DATABASE_NAME);

      var todaynow = new Date().toISOString()

      var myobj = { date: todaynow, endpointAPI: endpointApi, objectID: objectId };
      dbo.collection(TABLE_STATS_SERVER).insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
      });
    });


  }

};
