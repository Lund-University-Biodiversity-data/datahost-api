'use strict';


/**
 * Get API information
 *
 * returns List
 **/
exports.getApiInfo = function() {
  return new Promise(function(resolve, reject) {
    var examples = {};
    examples['application/json'] = [ {
  "apiName" : "lu-api-documentation-template",
  "apiVersion" : "1.0.6",
  "apiDocumentation" : "https://github.com/Lund-University-Biodiversity-data/datahost-api",
  "apiStatus" : "apiStatus",
  "apiReleased" : "2023-09-04T08:57:07.000+00:00"
}, {
  "apiName" : "lu-api-documentation-template",
  "apiVersion" : "1.0.5",
  "apiDocumentation" : "https://github.com/Lund-University-Biodiversity-data/datahost-api",
  "apiStatus" : "active",
  "apiReleased" : "2000-01-23T04:56:07.000+00:00"
} ];
    if (Object.keys(examples).length > 0) {
      resolve(examples[Object.keys(examples)[0]]);
    } else {
      resolve();
    }
  });
}

