'use strict';

var dbMongo = require ('../dbmongo.js');


var Site = require('../service/SiteService');
var geolib = require('geolib');

/**
 * Get event by ID
 * Get event by ID
 *
 * eventId String EventId of the event to get
 * returns List
 **/
exports.getEventsByID = function(eventId) {

  return new Promise(function(resolve, reject) {
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
        var collEvents = dbMongo.getCollection("Events");
        collEvents.findOne({ "eventID": eventId }, (error, result) => {
          if(error) {
            resolve(500);
              //return response.status(500).send(error);
          }
          resolve(result);
          //response.send(result);
        });
    }
  });
}



async function getOccurrencesFromDyntaxaIdAsync (idsArray) {
  var collOccurrences = dbMongo.getCollection("Occurrences");
  let occs = await collOccurrences.find({"taxon.dyntaxaId":{"$in":idsArray}}).toArray();

  return occs;
}


async function getSitesFromCountiesAsync (idsArray) {
  var collSites = dbMongo.getCollection("Sites");
  let occs = await collSites.find({"county":{"$in":idsArray}}).toArray();

  return occs;
}


/**
 * Get event by search
 * Get event by search
 *
 * body EventsFilter Filter used to limit the search. (optional)
 * skip Integer Start index (optional)
 * take Integer Number of items to return. 1000 items is the max to return in one call. (optional)
 * returns List
 **/
exports.getEventsBySearch = function(body,skip,take) {
  return new Promise(async function(resolve, reject) {
    console.log("getEventsBySearch")
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      if(body) {
        var collOccurrences = dbMongo.getCollection("Occurrences");
        var collEvents = dbMongo.getCollection("Events");

        var eventIdArray=[];
        
        // build the query filter, defined as an object (and NOT an array)
        var query = {};

        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);

            let occs = await getOccurrencesFromDyntaxaIdAsync(idDyntaxaArray);

            if (occs) {
              occs.forEach(function(element, index) {
                eventIdArray.push(element.event);
              })
            }
          }
        }

        // with the eventIds from the taxon filter
        if (eventIdArray.length>0) {
          //query = {"eventID":{"$in":eventIdArray}};
          query["eventID"]={"$in":eventIdArray};
        }

        // DATE FILTER
        if (body.hasOwnProperty('date')) {

          // dateFilterType
          
          // default : OverlappingStartDateAndEndDate
          var dateFilterType="OverlappingStartDateAndEndDate";
          if (body.date.hasOwnProperty('dateFilterType')) {
            dateFilterType=body.date.dateFilterType;
          }

          var startDate="";
          var endDate="";
          if (body.date.hasOwnProperty('startDate')) {
            //console.log(body.date.startDate);
            startDate=body.date.startDate;
          }
          
          if (body.date.hasOwnProperty('endDate')) {
            //console.log(body.date.endDate);
            endDate=body.date.endDate;
          }
          
          switch(dateFilterType) {
            
            case "BetweenStartDateAndEndDate": //  => Start AND EndDate of the event must be within the specified interval
              if (startDate!="") {
                query["eventStartDate"]={"$gte":startDate};
              }
              if (endDate!="") {
                query["eventEndDate"]={"$lte":endDate};
              }
              break;

            case "OnlyStartDate": //  => Only StartDate of the event must be within the specified interval

              if(startDate!="" && endDate!="") {
                query["eventStartDate"]={"$gte":startDate, "$lte":endDate};
              }
              else if (startDate!="") {
                query["eventStartDate"]={"$gte":startDate};
              }
              else if (endDate!="") {
                query["eventStartDate"]={"$lte":endDate};
              }
              break;

            case "OnlyEndDate": //  => Only EndDate of the event must be within the specified interval
              if(startDate!="" && endDate!="") {
                query["eventEndDate"]={"$gte":startDate, "$lte":endDate};
              }
              else if (startDate!="") {
                query["eventEndDate"]={"$gte":startDate};
              }
              else if (endDate!="") {
                query["eventEndDate"]={"$lte":endDate};
              }
              break;

            case "OverlappingStartDateAndEndDate": // => Start OR EndDate of the event may be within the specified interval
            default:
              if (startDate!="") {
                query["eventEndDate"]={"$gte":startDate};
              }
              if (endDate!="") {
                query["eventStartDate"]={"$lte":endDate};
              }
              break;
          } 


        }


        // GEOGRAPHIC FILTER

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {
          if (body.area.hasOwnProperty('county')) {
            var countyArray=Object.values(body.area.county);
            let sits = await getSitesFromCountiesAsync(countyArray); 

            if (sits) {
              sits.forEach(function(element, index) {
                siteIdArray.push(element.locationID);
              })
            }
          }

          if (body.area.hasOwnProperty('area')) {
            //console.log("area.area");


            var listSites = await Site.getAllSitesCoordinates();

            var maxDistanceFromGeometries=0;
            if (body.area.area.hasOwnProperty('maxDistanceFromGeometries')) {
              maxDistanceFromGeometries=body.area.area.maxDistanceFromGeometries;
              //console.log("area.area.maxDistanceFromGeometries : "+maxDistanceFromGeometries);
            }

            if (body.area.area.hasOwnProperty('geographicArea')) {
              //console.log("area.area.geographicArea");

              if (body.area.area.geographicArea.hasOwnProperty('featurePBB')) {
                //console.log("area.area.geographicArea.featurePBB");
                if (body.area.area.geographicArea.featurePBB.hasOwnProperty('geometry')) {
                  //console.log("area.area.geographicArea.featurePBB.geometry");

                  if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('type')) {
                    //console.log("area.area.geographicArea.featurePBB.geometry.type");

                    if (body.area.area.geographicArea.featurePBB.geometry.type=="Point") {

                      if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('coordinates')) {
                        //console.log("area.area.geographicArea.featurePBB.geometry.coordinates");
                        //console.log(body.area.area.geographicArea.featurePBB.geometry.coordinates);
                        
                        var inputBBCoord = body.area.area.geographicArea.featurePBB.geometry.coordinates;

                        // COMPARE THE COORDINATE SYSTEMS ???

                        listSites.forEach(function(eltSite) {
                          //console.log(eltSite.emplacement.geometry.coordinates);
                          var siteCoord = eltSite.emplacement.geometry.coordinates;


                          var distance = geolib.getDistance(
                            {latitude: inputBBCoord[0], longitude: inputBBCoord[1]}, 
                            {latitude: siteCoord[0], longitude: siteCoord[1]}
                          );
                          //console.log("distance : "+distance);

                          if (distance < maxDistanceFromGeometries) {
                            //console.log("adding site "+eltSite.locationID);
                            siteIdArray.push(eltSite.locationID);
                          }
                        })


                     }



                    }
                  }

                }
              }
            }

            if (body.area.area.hasOwnProperty('maxDistanceFromGeometries')) {
              console.log("area.area.maxDistanceFromGeometries");
            }
          }
        }

        // the siteIds from the geographic filter 
        if (body.hasOwnProperty('area') && body.area.hasOwnProperty('area') && siteIdArray.length==0) {
          query["site"]="NORESULT";
        }
        else if (siteIdArray.length>0) {
          query["site"]={"$in":siteIdArray};
        }
        
        console.log(query);

        collEvents.find(query).toArray(function(err, result) {
          console.log(result.length+" result(s)");
          //if (err) throw err;
          resolve(result);
        });

      }
      else {
        resolve();
      }
    }
  });
}

