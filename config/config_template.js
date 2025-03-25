var config = {};

config.apiServerPort=8088;
config.apiServerUrl='http://URL:'+config.apiServerPort;
config.apiServerUrlVersion='/v1';

config.SLUAPIkey = "YOUR_KEY_HERE";
config.speciesFilePath = "PATH";
config.speciesHierarchyFilePath = "PATH";

config.urlAPISLUdetails = "URLwith{taxonId}andyourkey=";+config.SLUAPIkey;
config.urlAPISLUgetTaxa = "URLwith{taxonId}andyourkey=";+config.SLUAPIkey;

config.urlAPILists=[
	"https://lists.biodiversitydata.se/ws/URL", // butterflies
	"https://lists.biodiversitydata.se/ws/URL", // birds
	"https://lists.biodiversitydata.se/ws/URL" // mammals
];
config.dyntaxaIdFinalStoppingTaxon=[ 123456 ];

// For YAML file generation
config.folderOpenApiFiles = "folder/";
config.folderOpenApiArchivesFiles = config.folderOpenApiFiles + "openapi_yml_archives/";
config.templateOpenApiFile = config.folderOpenApiFiles + "templateOpenapi.yaml";
config.finalOpenApiFile = config.folderOpenApiFiles + "openapi.yaml";
config.specificEndpointsFile = config.folderOpenApiFiles + "specific_endpoints.yaml";
config.speciesFileMunicipalities = config.speciesFileMunicipalities + "list_municipalities.yaml";
config.speciesFileParishes = config.folderOpenApiFiles + "list_parishes.yaml";
config.speciesFileProvinces = config.folderOpenApiFiles + "list_provinces.yaml";

// For obtaining the list of municipalities
config.urlAPIMunicipalities = 'https://catalog.skl.se/rowstore/dataset/ed60ba69-f267-4b63-9f62-840342ba29f6/json';

// STATISTICS
config.databaseStatisticsUrl = "mongodb://localhost:27017";
config.databaseStatisticsName = "statsDB";
config.databaseStatisticsTable = "statsServer";

export default config;