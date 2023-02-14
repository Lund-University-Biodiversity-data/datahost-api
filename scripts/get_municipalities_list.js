
var config = require ('../config/config.js');

var https = require ('https');

var fs = require ('fs');

var url=config.urlAPIMunicipalities;
const speciesFileMunicipalities= config.speciesFileMunicipalities;

//const listMunicipalities= [];
var listMunicipalities="";
var nbMunicipalities = 0;
//while (url != "")  {


async function getMunicipalities(url) {

  return new Promise((resolve) => {
    https.get(url,(res) => {
      let body = "";

      res.on("data", (chunk) => {
          body += chunk;
      });

      res.on("end", async () => {
        try {
          let json = JSON.parse(body);

          Object.entries(json.results).forEach(([parentKey, parentVal]) => {

            //console.log(parentVal.namn);
            //listMunicipalities.push(parentVal.namn);
            listMunicipalities = listMunicipalities + "      - " + '"' + parentVal.namn + '"\n';
            nbMunicipalities = nbMunicipalities + 1;
          });

          console.log("count listMunicipalities : "+nbMunicipalities);

          if (json.hasOwnProperty("next") && json.next!="") {
            var nextUrl = new URL(json.next);
            await getMunicipalities(nextUrl);
          }

          resolve(1);

        } catch (error) {
          console.error(error.message);
          resolve(0);
        };
      });
    }).on("error", (error) => {
      console.error(error.message);
      resolve(0);
    });
  });
}

const municipalities = async _ => {
  await getMunicipalities(url);
  console.log("apres await");

  fs.writeFile(speciesFileMunicipalities, listMunicipalities, function (err) {
    if (err) return console.log(err);
    console.log('File created : '+speciesFileMunicipalities);
  });


}
let rt=municipalities();



//}