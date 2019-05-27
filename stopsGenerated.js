const fs = require('fs');

var rundata = function  rundata(){

function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}

//Importation des valeurs de OD de l'usager - comprendra ultimement l'heure de départ
let OD = { "origine":{
  "lat": "45.63319",
  "lon": "-1.019489"
},
"destination":{
  "lat": "45.7762551653927",
  "lon": "-1.14634051700202"
}
};

//Écriture du fichier OD.json
fs.writeFileSync("./generated_files/OD.json", JSON.stringify(OD), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});



//Création de la table stopsGenerated avec O et D
const origine = {};
origine.stop_id = -100;
origine.stop_lat = OD.origine.lat;
origine.stop_lon = OD.origine.lon;

const destination = {};
destination.stop_id = -200;
destination.stop_lat = OD.destination.lat;
destination.stop_lon = OD.destination.lon;


//Création de stopsGenerated pour créer les footpaths (étape suivante du main.js)
let stopsGTFS = [];
stopsGTFS = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json");
stopsGTFS.push(origine);
stopsGTFS.push(destination);
fs.writeFileSync("./generated_files/stopsGenerated.json", JSON.stringify(stopsGTFS), function (err) {
if (err) throw err;
});


//Initialisation de la table journeys.json
let journeys = [];
for (let i = 0, count = stopsGTFS.length; i < count; i++) {
  const journey = {};
  journey.stop_id = parseInt(stopsGTFS[i].stop_id);
  journey.enter_connection = {}; //Objet vide destiné à accueillir "enter_connection" lors du scan {6}
  journey.exit_connection = {}; //Objet vide destiné à accueillir "exit_connection" lors du scan {6}
  journey.final_footpath = {}; //Objet vide destiné à accueillir le "final footpath" {3}
  journeys.push(journey);
}
fs.writeFileSync("./imported_files/journeys.json", JSON.stringify(journeys), function (err) {
if (err) throw err;
});


};



module.exports.rundata = rundata;
