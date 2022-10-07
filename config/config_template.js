var config = {};

config.apiServerUrl='http://URL';

config.SLUAPIkey = "YOUR_KEY_HERE";
config.speciesFilePath = "PATH";
config.speciesHierarchyFilePath = "PATH";
config.urlAPIListsALABirds = "URL";
config.urlAPISLUdetails = "URLwith{taxonId}andyourkey=";+config.SLUAPIkey;
config.urlAPISLUgetTaxa = "URLwith{taxonId}andyourkey=";+config.SLUAPIkey;
config.dyntaxaIdAves=4000104;

// For YAML file generation
config.folderOpenApiFiles = "folder/";
config.templateOpenApiFile = config.folderOpenApiFiles + "templateOpenapi.yaml";
config.finalOpenApiFile = config.folderOpenApiFiles + "openapi.yaml";
config.specificEndpointsFile = config.folderOpenApiFiles + "specific_endpoints.yaml";
config.speciesFileMunicipalities = config.speciesFileMunicipalities + "municipalities.yaml";

// For obtaining the list of municipalities
config.urlAPIMunicipalities = 'https://catalog.skl.se/rowstore/dataset/ed60ba69-f267-4b63-9f62-840342ba29f6/json';

export default config;