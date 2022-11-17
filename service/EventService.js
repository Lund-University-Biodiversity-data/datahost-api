'use strict';

var dbMongo = require ('../dbmongo.js');

var Site = require('../service/SiteService');
var Occurrence = require('../service/OccurrenceService');

//var geolib = require('geolib');
var turf = require('@turf/turf');

const util = require('util');

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



exports.getDateFilterForAggregate = function (date) {
  let pipeline = [];
  var element = {};

  // dateFilterType
  // default : OverlappingStartDateAndEndDate
  var dateFilterType="OverlappingStartDateAndEndDate";
  if (date.hasOwnProperty('dateFilterType')) {
    dateFilterType=date.dateFilterType;
  }

  var startDate="";
  var endDate="";
  if (date.hasOwnProperty('startDate')) {
    //console.log(date.startDate);
    startDate=date.startDate;
  }
  
  if (date.hasOwnProperty('endDate')) {
    //console.log(date.endDate);
    endDate=date.endDate;
  }
  
  switch(dateFilterType) {
    
    case "BetweenStartDateAndEndDate": //  => Start AND EndDate of the event must be within the specified interval
      if (startDate!="") {
        pipeline.push({ "$gte" : [ "$eventStartDate", startDate ] });
      }
      if (endDate!="") {
        pipeline.push({ "$lte" : [ "$eventEndDate", endDate ] });
      }
      break;

    case "OnlyStartDate": //  => Only StartDate of the event must be within the specified interval

      if(startDate!="" && endDate!="") {
        //query["eventStartDate"]={"$gte":startDate, "$lte":endDate};
        pipeline.push({ "$gte" : [ "eventStartDate", startDate ] });
        pipeline.push({ "$lte" : [ "eventStartDate", endDate ] });
      }
      else if (startDate!="") {
        pipeline.push({ "$gte" : [ "eventStartDate", startDate ] });
      }
      else if (endDate!="") {
        pipeline.push({ "$lte" : [ "eventStartDate", endDate ] });
      }
      break;

    case "OnlyEndDate": //  => Only EndDate of the event must be within the specified interval
      if(startDate!="" && endDate!="") {
        pipeline.push({ "$gte" : [ "eventEndDate", startDate ] });
        pipeline.push({ "$lte" : [ "eventEndDate", endDate ] });
      }
      else if (startDate!="") {
        pipeline.push({ "$gte" : [ "eventEndDate", startDate ] });
      }
      else if (endDate!="") {
        //query["eventEndDate"]={"$lte":endDate};
        pipeline.push({ "$lte" : [ "eventEndDate", endDate ] });
      }
      break;

    case "OverlappingStartDateAndEndDate": // => Start OR EndDate of the event may be within the specified interval
    default:
      if (startDate!="") {
        pipeline.push({ '$gte' : [ "$eventEndDate", startDate ] });
      }
      if (endDate!="") {
        pipeline.push({ "$lte" : [ "$eventStartDate", endDate ] });
      }
      break;
  } 

  return pipeline;
  
}

exports.getDateFilterFromBody = function(body) {

  var query = [];

  // dateFilterType
  
  // default : OverlappingStartDateAndEndDate
  var dateFilterType="OverlappingStartDateAndEndDate";
  if (body.datum.hasOwnProperty('dateFilterType')) {
    dateFilterType=body.datum.dateFilterType;
  }

  var startDate="";
  var endDate="";
  if (body.datum.hasOwnProperty('startDate')) {
    //console.log(body.datum.startDate);
    startDate=body.datum.startDate;
  }
  
  if (body.datum.hasOwnProperty('endDate')) {
    //console.log(body.datum.endDate);
    endDate=body.datum.endDate;
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



exports.getGeographicFilterFromBodyArea = async function(area, listDataset) {


  var siteIdArray=[];

  if (area.hasOwnProperty('county')) {

    var countyArray=Object.values(area.county);
    let sits = await Site.getSitesFromCountiesAsync(countyArray); 

    if (sits) {
      sits.forEach(function(element, index) {
        siteIdArray.push(element.locationID);
      })
    }
  }

  if (area.hasOwnProperty('area')) {
    //console.log("area.area");


    var listSites = await Site.getAllSitesCoordinates(listDataset);

    var maxDistanceFromGeometries=0;
    if (area.area.hasOwnProperty('maxDistanceFromGeometries')) {
      maxDistanceFromGeometries=area.area.maxDistanceFromGeometries;
      //console.log("area.area.maxDistanceFromGeometries : "+maxDistanceFromGeometries);
    }

    if (area.area.hasOwnProperty('geographicArea')) {
      if (area.area.geographicArea.hasOwnProperty('featurePBB')) {
        if (area.area.geographicArea.featurePBB.hasOwnProperty('geometry')) {
          if (area.area.geographicArea.featurePBB.geometry.hasOwnProperty('type')) {
            if (area.area.geographicArea.featurePBB.geometry.hasOwnProperty('coordinates')) {

              var inputPBBCoord = area.area.geographicArea.featurePBB.geometry.coordinates;

              if (area.area.geographicArea.featurePBB.geometry.type=="Point") {

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
              else if (area.area.geographicArea.featurePBB.geometry.type=="BoundingBox") {

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


      if (area.area.geographicArea.hasOwnProperty('featureLP')) {
        if (area.area.geographicArea.featureLP.hasOwnProperty('geometry')) {
          if (area.area.geographicArea.featureLP.geometry.hasOwnProperty('type')) {
            if (area.area.geographicArea.featureLP.geometry.hasOwnProperty('coordinates')) {
              
              var inputLPCoord = area.area.geographicArea.featureLP.geometry.coordinates;

              if (area.area.geographicArea.featureLP.geometry.type=="Polygon") {

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
              else if (area.area.geographicArea.featureLP.geometry.type=="lineString") {
              }

              
            }
          }
        }
      }

    }

    if (area.area.hasOwnProperty('maxDistanceFromGeometries')) {
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
 * exportMode String  (optional)
 * responseCoordinateSystem ResponseCoordinateSystem  (optional)
 * returns List
 **/
exports.getEventsBySearch = function(body,skip,take,exportMode,responseCoordinateSystem) {
  return new Promise(async function(resolve, reject) {
    console.log("getEventsBySearch")
    var examples = {};
    //examples['application/json'] = [ "", "" ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      if(body) {
        //console.log("body received :");
        //console.log(body);

        var collEvents = dbMongo.getCollection("Events");

        var eventIdArray=[];
        
        // build the query filter, defined as an object (and NOT an array)
        var query = {};

        /*
        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);

            let occs = await Occurrence.getOccurrencesFromDyntaxaIdAsync(idDyntaxaArray);

            if (occs && occs.length>0) {
              occs.forEach(function(element, index) {
                eventIdArray.push(element.eventID);
              })
            }
            // if no occurrence returned, no event. It has to be specified because the filter will be skipped instead
            else {
              eventIdArray.push("NOOCCURRENCEWITHINPUTTAXON");
            }
          }
        }

        // with the eventIds from the taxon filter
        if (eventIdArray.length>0) {
          
          //console.log("eventIdArray length : "+eventIdArray.length);
          //eventIdArray = eventIdArray.slice(700000, eventIdArray.length);
          //console.log("eventIdArray length after cut : "+eventIdArray.length);
          
          //query = {"eventID":{"$in":eventIdArray}};
          query["eventID"]={"$in":eventIdArray};
        }
        */

        
        // TAXON FILTER
        var joinOccurrences={};

        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {

            var idDyntaxaArray=Object.values(body.taxon.ids);
            
            var listTaxonFinal=Occurrence.getListTaxonIncludingHierarchy(idDyntaxaArray);

            // join with records collection
            joinOccurrences["$lookup"]= {
              "from": "records",
              "localField": "eventID",
              "foreignField": "eventID",
              "as": "rec"
            };
            // add the TAXON FILTER
            joinOccurrences["$match"] = {
              "rec.taxon.dyntaxaId": {
                "$in": listTaxonFinal
              }
            } 
            // 
            joinOccurrences["$project"] = {
              "rec": 0
            } 
          }
        }
        
        // DATE FILTER
        if (body.hasOwnProperty('datum')) {

          var queryDate=exports.getDateFilterFromBody(body);

          if (typeof queryDate["eventStartDate"] !== 'undefined' && queryDate["eventStartDate"]!="" && queryDate["eventStartDate"]!=null) query["eventStartDate"]=queryDate["eventStartDate"];
          if (typeof queryDate["eventEndDate"] !== 'undefined' && queryDate["eventEndDate"]!="" && queryDate["eventEndDate"]!=null) query["eventEndDate"]=queryDate["eventEndDate"];          

        }


        // GEOGRAPHIC FILTER

        var siteIdArray=[];

        if (body.hasOwnProperty('area')) {

          var listDataset=null;
          if (body.hasOwnProperty('datasetIds')) {
            listDataset = body.datasetIds;
          }

          var siteIdArray = await exports.getGeographicFilterFromBodyArea(body.area, listDataset);

        }

        // the siteIds from the geographic filter 
        if (body.hasOwnProperty('area') && body.area.hasOwnProperty('area') && siteIdArray.length==0) {
          query["site"]="NORESULT";
        }
        else if (siteIdArray.length>0) {
          query["site"]={"$in":siteIdArray};
        }
        
        // set the datasetIds filter
        if (body.hasOwnProperty('datasetIds')) {
          query["datasetID"]={"$in":body.datasetIds};
        }

        
        var pipeline = [];

        if (Object.entries(joinOccurrences).length == 0) {
          pipeline = [
            { "$match": query }
          ];
        }
        else {
          // create the pipeline for the aggregation
          pipeline = [
              { "$match": query } ,
              { "$lookup" : joinOccurrences["$lookup"] },
              { "$match" : joinOccurrences["$match"] },
              { "$project" : joinOccurrences["$project"] },
          ];
        }

        console.log("pipeline query:");
        console.log(util.inspect(pipeline, false, null, true ));

        collEvents.aggregate(pipeline).toArray(function(err, result) {
          if (err) {
            throw err;
            resolve();
          }

          console.log(result.length+" result(s)");

          // in order to deal with pagination, should return as well other parameters :
          // "skip": XX,
          // "take": YY,
          // "count": ZZ,          
          var responseFinal = {
            "totalCount": result.length,
            "results": result
          }

          resolve(responseFinal);
        });
        
        /*
        console.log("event query:");
        console.log(query);

        collEvents.find(query).toArray(function(err, result) {
          if (err) {
            throw err;
            resolve();
          }

          console.log(result.length+" result(s)");
          
          resolve(result);
        });
        */
      }
      else {
        resolve();
      }
    }
  });
}

