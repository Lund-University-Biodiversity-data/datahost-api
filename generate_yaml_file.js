
var config = require ('./config/config.js');

var fs = require ('fs');

const templateOpenApiFile= config.templateOpenApiFile;
const finalOpenApiFile= config.finalOpenApiFile;
const specificEndpointsFile = config.specificEndpointsFile;

var today = new Date();

var tempOpenApiFile = config.folderOpenApiFiles + today.toISOString().slice(0,19).replace(/-/g,"").replace(/T/g,"_").replace(/:/g,"") + "_openapi.yml";

var okGeneration = false;

var tempYmlContent;

// get the template content
tempYmlContent=fs.readFileSync(templateOpenApiFile, "utf8");

tempYmlContent = tempYmlContent.replace('%%FILE_TITLE%%', "LU API-documentation Template");
tempYmlContent = tempYmlContent.replace('%%FILE_DESC%%', "Created by the DPS-group. Updated by LU");
tempYmlContent = tempYmlContent.replace('%%FILE_CONTACTNAME%%', "Mathieu Blanchet");
tempYmlContent = tempYmlContent.replace('%%FILE_EMAIL%%', "mathieu.blanchet@biol.lu.se");
tempYmlContent = tempYmlContent.replace('%%SERVER_URL%%', config.apiServerUrl);


// get the specific stuff from LU for new endpoints
specificEndpointsContent=fs.readFileSync(specificEndpointsFile, "utf8");
console.log(typeof specificEndpointsContent);

tempYmlContent = tempYmlContent.replace('%%SPECIFIC_ENDPOINTS%%', specificEndpointsContent);


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



