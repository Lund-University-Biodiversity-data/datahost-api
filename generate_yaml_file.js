
var config = require ('./config/config.js');

var fs = require ('fs');

const templateOpenApiFile= config.templateOpenApiFile;
const finalOpenApiFile= config.finalOpenApiFile;
const specificEndpointsFile = config.specificEndpointsFile;
const municipalitiesFilePath= config.municipalitiesFilePath;
const provincesFilePath= config.provincesFilePath;
const parishesFilePath= config.parishesFilePath;

var today = new Date();

var tempOpenApiFile = config.folderOpenApiArchivesFiles + today.toISOString().slice(0,19).replace(/-/g,"").replace(/T/g,"_").replace(/:/g,"") + "_openapi.yml";

var okGeneration = false;

var tempYmlContent;

// get the template content
tempYmlContent=fs.readFileSync(templateOpenApiFile, "utf8");

// get the specific stuff from LU for new endpoints
specificEndpointsContent=fs.readFileSync(specificEndpointsFile, "utf8");

tempYmlContent = tempYmlContent.replace('%%SPECIFIC_ENDPOINTS%%', specificEndpointsContent);


tempYmlContent = tempYmlContent.replace('%%FILE_TITLE%%', "LU API-documentation Template");
tempYmlContent = tempYmlContent.replace('%%FILE_DESC%%', "Created by the DPS-group. Updated by LU");
tempYmlContent = tempYmlContent.replace('%%FILE_CONTACTNAME%%', "Mathieu Blanchet");
tempYmlContent = tempYmlContent.replace('%%FILE_EMAIL%%', "mathieu.blanchet@biol.lu.se");
tempYmlContent = tempYmlContent.replace('%%SERVER_URL%%', config.apiServerUrl+config.apiServerUrlVersion);
// REPLACE ALL the API_VERSION_URL
//tempYmlContent = tempYmlContent.replace(new RegExp('%%API_VERSION_URL%%', 'g'), config.apiServerUrlVersion);


// get the different long enum lists
municipalitiesList=fs.readFileSync(municipalitiesFilePath, "utf8");
tempYmlContent = tempYmlContent.replace('%%LIST_MUNICIPALITIES%%', municipalitiesList);

provincesList=fs.readFileSync(provincesFilePath, "utf8");
tempYmlContent = tempYmlContent.replace('%%LIST_PROVINCES%%', provincesList);

parishesList=fs.readFileSync(parishesFilePath, "utf8");
tempYmlContent = tempYmlContent.replace('%%LIST_PARISHES%%', parishesList);

fs.writeFile(tempOpenApiFile, tempYmlContent, function (err) {
  if (err) return console.log(err);
  console.log('File created : '+tempOpenApiFile);

  okGeneration=true;

  // if ok => replace the finalName file
  if (okGeneration) {
    // Copying the file to a the same name
    fs.copyFile(tempOpenApiFile, finalOpenApiFile, (err) => {
      if (err) {
        console.log("Error Found when copying TEMP to final:", err);
      }
      else {
        console.log("Final file created "+finalOpenApiFile)
        // Get the current filenames
        // after the function
        //getCurrentFilenames();
        //console.log("\nFile Contents of copied_file:",
        //fs.readFileSync("copied_file.txt", "utf8"));
      }
    });
  }
});



