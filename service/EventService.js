'use strict';

var dbMongo = require ('../dbmongo.js');

var Site = require('../service/SiteService');
var Occurrence = require('../service/OccurrenceService');

//var geolib = require('geolib');
var turf = require('@turf/turf');

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


exports.getDateFilterFromBody = function(body) {

  var query = [];

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


  return query;
}



exports.getGeographicFilterFromBody = async function(body) {

  var siteIdArray=[];

  if (body.area.hasOwnProperty('county')) {
    var countyArray=Object.values(body.area.county);
    let sits = await Site.getSitesFromCountiesAsync(countyArray); 

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
      if (body.area.area.geographicArea.hasOwnProperty('featurePBB')) {
        if (body.area.area.geographicArea.featurePBB.hasOwnProperty('geometry')) {
          if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('type')) {
            if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('coordinates')) {

              var inputPBBCoord = body.area.area.geographicArea.featurePBB.geometry.coordinates;

              if (body.area.area.geographicArea.featurePBB.geometry.type=="Point") {

                // COMPARE THE COORDINATE SYSTEMS ???

                listSites.forEach(function(eltSite) {
                  //console.log(eltSite.emplacement.geometry.coordinates);
                  var siteCoord = eltSite.emplacement.geometry.coordinates;

                  // with turf
                  // need to reverse latitude/longitude
                  var distance = turf.distance(
                    [inputPBBCoord[1], inputPBBCoord[0]], 
                    [siteCoord[1], siteCoord[0]], 
                    {units: 'meters'}
                  );

                  if (distance < maxDistanceFromGeometries) {
                    //console.log("adding site "+eltSite.locationID);
                    siteIdArray.push(eltSite.locationID);
                  }
                })

              }
              else if (body.area.area.geographicArea.featurePBB.geometry.type=="BoundingBox") {

                var invertCoordPBB = [];

                // can get more than 2 points
                inputPBBCoord.forEach(function(eltPt) {
                  invertCoordPBB.push([eltPt[1], eltPt[0]]);
                });

                /*
                var line = turf.lineString([[-74, 40], [-78, 42], [-82, 35]]);
                var bbox = turf.bbox(line);
                var bboxPolygon = turf.bboxPolygon(bbox);   
                */
                //var poly = turf.polygon([invertCoordPoly]);
                var line = turf.lineString(invertCoordPBB);
                var bbox = turf.bbox(line);
                var bboxPolygon = turf.bboxPolygon(bbox);  

                listSites.forEach(function(eltSite) {
                  //console.log(eltSite.emplacement.geometry.coordinates);
                  var siteCoord = eltSite.emplacement.geometry.coordinates;
                  var pt = turf.point([siteCoord[1], siteCoord[0]]);

                  // with turf
                  var isInPolygon = turf.booleanPointInPolygon(pt, bboxPolygon);
                  if (isInPolygon){
                    console.log("in polygon BBox :"+eltSite.locationID);
                    siteIdArray.push(eltSite.locationID);
                  }
                  /*
                  if (distance < maxDistanceFromGeometries) {
                    //console.log("adding site "+eltSite.locationID);
                    siteIdArray.push(eltSite.locationID);
                  }
                  */
                })

              }

              
            }
          }
        }
      }


      if (body.area.area.geographicArea.hasOwnProperty('featureLP')) {
        if (body.area.area.geographicArea.featureLP.hasOwnProperty('geometry')) {
          if (body.area.area.geographicArea.featureLP.geometry.hasOwnProperty('type')) {
            if (body.area.area.geographicArea.featureLP.geometry.hasOwnProperty('coordinates')) {
              
              var inputLPCoord = body.area.area.geographicArea.featureLP.geometry.coordinates;

              if (body.area.area.geographicArea.featureLP.geometry.type=="Polygon") {

                var invertCoordLP = [];

                // can get more than 2 points
                inputLPCoord.forEach(function(eltPt) {
                  invertCoordLP.push([eltPt[1], eltPt[0]]);
                });

                var line = turf.lineString(invertCoordLP);
                var bbox = turf.bbox(line);
                var bboxPolygon = turf.bboxPolygon(bbox);  

                listSites.forEach(function(eltSite) {
                  //console.log(eltSite.emplacement.geometry.coordinates);
                  var siteCoord = eltSite.emplacement.geometry.coordinates;
                  var pt = turf.point([siteCoord[1], siteCoord[0]]);

                  // with turf
                  var isInPolygon = turf.booleanPointInPolygon(pt, bboxPolygon);
                  if (isInPolygon){
                    console.log("in polygon :"+eltSite.locationID);
                    siteIdArray.push(eltSite.locationID);
                  }
                  /*
                  if (distance < maxDistanceFromGeometries) {
                    //console.log("adding site "+eltSite.locationID);
                    siteIdArray.push(eltSite.locationID);
                  }
                  */
                })
              }
              else if (body.area.area.geographicArea.featureLP.geometry.type=="lineString") {
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

  return siteIdArray;

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
        var collEvents = dbMongo.getCollection("Events");

        var eventIdArray=[];
        
        // build the query filter, defined as an object (and NOT an array)
        var query = {};

        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);

            let occs = await Occurrence.getOccurrencesFromDyntaxaIdAsync(idDyntaxaArray);

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

          var queryDate=exports.getDateFilterFromBody(body);

          if (queryDate["eventStartDate"]!="") query["eventStartDate"]=queryDate["eventStartDate"];
          if (queryDate["eventEndDate"]!="") query["eventEndDate"]=queryDate["eventEndDate"];

        }


        // GEOGRAPHIC FILTER

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {

          var siteIdArray = exports.getGeographicFilterFromBody(body);
          /*
          if (body.area.hasOwnProperty('county')) {
            var countyArray=Object.values(body.area.county);
            let sits = await Site.getSitesFromCountiesAsync(countyArray); 

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
              if (body.area.area.geographicArea.hasOwnProperty('featurePBB')) {
                if (body.area.area.geographicArea.featurePBB.hasOwnProperty('geometry')) {
                  if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('type')) {
                    if (body.area.area.geographicArea.featurePBB.geometry.hasOwnProperty('coordinates')) {

                      var inputPBBCoord = body.area.area.geographicArea.featurePBB.geometry.coordinates;

                      if (body.area.area.geographicArea.featurePBB.geometry.type=="Point") {

                        // COMPARE THE COORDINATE SYSTEMS ???

                        listSites.forEach(function(eltSite) {
                          //console.log(eltSite.emplacement.geometry.coordinates);
                          var siteCoord = eltSite.emplacement.geometry.coordinates;

                          // with turf
                          // need to reverse latitude/longitude
                          var distance = turf.distance(
                            [inputPBBCoord[1], inputPBBCoord[0]], 
                            [siteCoord[1], siteCoord[0]], 
                            {units: 'meters'}
                          );

                          if (distance < maxDistanceFromGeometries) {
                            //console.log("adding site "+eltSite.locationID);
                            siteIdArray.push(eltSite.locationID);
                          }
                        })

                      }
                      else if (body.area.area.geographicArea.featurePBB.geometry.type=="BoundingBox") {

                        var invertCoordPBB = [];

                        // can get more than 2 points
                        inputPBBCoord.forEach(function(eltPt) {
                          invertCoordPBB.push([eltPt[1], eltPt[0]]);
                        });

                        //var poly = turf.polygon([invertCoordPoly]);
                        var line = turf.lineString(invertCoordPBB);
                        var bbox = turf.bbox(line);
                        var bboxPolygon = turf.bboxPolygon(bbox);  

                        listSites.forEach(function(eltSite) {
                          //console.log(eltSite.emplacement.geometry.coordinates);
                          var siteCoord = eltSite.emplacement.geometry.coordinates;
                          var pt = turf.point([siteCoord[1], siteCoord[0]]);

                          // with turf
                          var isInPolygon = turf.booleanPointInPolygon(pt, bboxPolygon);
                          if (isInPolygon){
                            console.log("in polygon BBox :"+eltSite.locationID);
                            siteIdArray.push(eltSite.locationID);
                          }
                        })

                      }

                      
                    }
                  }
                }
              }


              if (body.area.area.geographicArea.hasOwnProperty('featureLP')) {
                if (body.area.area.geographicArea.featureLP.hasOwnProperty('geometry')) {
                  if (body.area.area.geographicArea.featureLP.geometry.hasOwnProperty('type')) {
                    if (body.area.area.geographicArea.featureLP.geometry.hasOwnProperty('coordinates')) {
                      
                      var inputLPCoord = body.area.area.geographicArea.featureLP.geometry.coordinates;

                      if (body.area.area.geographicArea.featureLP.geometry.type=="Polygon") {

                        var invertCoordLP = [];

                        // can get more than 2 points
                        inputLPCoord.forEach(function(eltPt) {
                          invertCoordLP.push([eltPt[1], eltPt[0]]);
                        });

                        var line = turf.lineString(invertCoordLP);
                        var bbox = turf.bbox(line);
                        var bboxPolygon = turf.bboxPolygon(bbox);  

                        listSites.forEach(function(eltSite) {
                          //console.log(eltSite.emplacement.geometry.coordinates);
                          var siteCoord = eltSite.emplacement.geometry.coordinates;
                          var pt = turf.point([siteCoord[1], siteCoord[0]]);

                          // with turf
                          var isInPolygon = turf.booleanPointInPolygon(pt, bboxPolygon);
                          if (isInPolygon){
                            console.log("in polygon :"+eltSite.locationID);
                            siteIdArray.push(eltSite.locationID);
                          }
                        })
                      }
                      else if (body.area.area.geographicArea.featureLP.geometry.type=="lineString") {
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
          */
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

