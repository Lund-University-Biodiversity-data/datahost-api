
const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "datahost";

const LIMIT_MAX = 50;

var database, collEvents, collOccurrences, collDatasets, collSites;

var _db;


module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true, useNewUrlParser: true }, (error, client) => {
	    if(error) {
          console.log(error);
	        throw error;
	    }
	    database = client.db(DATABASE_NAME);
	    collEvents = database.collection("events");
      collOccurrences = database.collection("records");
      collDatasets = database.collection("datasets");
      collSites = database.collection("sites");
	    console.log("Connected to `" + DATABASE_NAME + "`!");

    });
  },

  getDb: function() {
    return database;
  },

  getCollection: function(name) {
    //console.log("search collection with name "+name);
  	if (name == "Events") return collEvents;
    else if (name == "Occurrences") return collOccurrences;
    else if (name == "Datasets") return collDatasets;
    else if (name == "Sites") return collSites;
    else {
      return false;
    }
  }


};
