'use strict';

var dbMongo = require ('../dbmongo.js');

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

        var eventIdArray=[];
        
        // build the query filter
        var query;

        // TAXON FILTER
        if (body.hasOwnProperty('taxon')) {
          if (body.taxon.hasOwnProperty('ids')) {
            var idDyntaxaArray=Object.values(body.taxon.ids);
            var collEvents = dbMongo.getCollection("Events");

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
          query = {"eventID":{"$in":eventIdArray}};
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
          
          /*if(startDate!="" && endDate!="") {
            query["eventDate"]={"$gte":startDate, "$lte":endDate};
          }
          else if (startDate!="") {
            query["eventDate"]={"$gte":startDate};
          }
          else if (endDate!="") {
            query["eventDate"]={"$lte":endDate};
          }*/
          
          switch(dateFilterType) {
            
            case "BetweenStartDateAndEndDate": //  => Start AND EndDate of the event must be within the specified interval
              if (startDate!="") {
                query["eventStartTime"]={"$gte":startDate};
              }
              if (endDate!="") {
                query["eventEndTime"]={"$lte":endDate};
              }
              break;

            case "OnlyStartDate": //  => Only StartDate of the event must be within the specified interval

              if(startDate!="" && endDate!="") {
                query["eventStartTime"]={"$gte":startDate, "$lte":endDate};
              }
              else if (startDate!="") {
                query["eventStartTime"]={"$gte":startDate};
              }
              else if (endDate!="") {
                query["eventStartTime"]={"$lte":endDate};
              }
              break;

            case "OnlyEndDate": //  => Only EndDate of the event must be within the specified interval
              if(startDate!="" && endDate!="") {
                query["eventEndTime"]={"$gte":startDate, "$lte":endDate};
              }
              else if (startDate!="") {
                query["eventEndTime"]={"$gte":startDate};
              }
              else if (endDate!="") {
                query["eventEndTime"]={"$lte":endDate};
              }
              break;

            case "OverlappingStartDateAndEndDate": // => Start OR EndDate of the event may be within the specified interval
            default:
              if (startDate!="") {
                query["eventEndTime"]={"$gte":startDate};
              }
              if (endDate!="") {
                query["eventStartTime"]={"$lte":endDate};
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
        }

        // the siteIds from the county filter 
        if (siteIdArray.length>0) {
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

