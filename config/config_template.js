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

export default config;