var fs = require('fs');

//fonction permettant de créer la table connections
var runcnn = function  runcnn(){


function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}


//Importation des données JSON
var stoptimes = [];
var trips = [];
stoptimes = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stop_times.json");
trips = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/trips.json");


//Création de la table intermédiaire timetable
var timetable = [];

for (let i = 0; i < stoptimes.length; i++) {
  timetable[i] = new Array(6);
  timetable[i][0] = stoptimes[i].trip_id;
  timetable[i][1] = stoptimes[i].stop_sequence;
  for (let j = 0; j < trips.length; j++){
    if (trips[j].trip_id == stoptimes[i].trip_id){
      timetable[i][2] = trips[j].service_id;
      timetable[i][3] = trips[j].route_id;
    }
  }
  timetable[i][4] = stoptimes[i].stop_id;
  timetable[i][5] = stoptimes[i].arrival_time;
  timetable[i][6] = stoptimes[i].departure_time;
}

//Création de la table connections à partir de timetable
var connections = [];
for (let i = 0; i < timetable.length; i++){
  const connection = {};
  connection["trip_id"] = parseInt(timetable[i][0]); //trip_id
  connection["stop_sequence"] = parseInt(timetable[i][1]); //stop_sequence
  connection["service_id"] = parseInt(timetable[i][2]); //service_id
  connection["route_id"] = parseInt(timetable[i][3]); //route_id
  connection["stop_id_DEPART"] = parseInt(timetable[i][4]); //stop_id (DÉPART)
  connection["departure_time"] = convertHMStoSeconds(timetable[i][6]); //departure_time (DÉPART)
  for (let j = 0; j < timetable.length; j++){
    if (connection["trip_id"] == parseInt(timetable[j][0]) //correspondance du trip_id
    && connection["service_id"] == parseInt(timetable[j][2]) //correspondance du service_id
    && Number(timetable[j][1]) == Number(connection["stop_sequence"])+Number(1)){ //vérification de la séquence = celui de timetable est +1 p/r à connections
      connection["stop_id_ARRIVEE"] = parseInt(timetable[j][4]); //stop_id (ARRIVÉE)
      connection["arrival_time"] = convertHMStoSeconds(timetable[j][5]); //arrival_time (ARRIVÉE)
    }
  }
  if (connection["arrival_time"] !== null && connection["arrival_time"] !== undefined) {
    connections.push(connection);
  }
}

//Tri des connections par heure de départ croissante
connections.sort(compareFourthColumn);
function compareFourthColumn(a, b) {
    if (a["arrival_time"] === b["arrival_time"]) {
        return 0;
    }
    else {
        return (a["arrival_time"] < b["arrival_time"]) ? -1 : 1;
    }
}
// Convertir les format hms en secondes
const convertHMStoSeconds = function(hms){
  var splittedhms = hms.split(':'); // split it at the :
  return (+splittedhms[0]) * 60 * 60 + (+splittedhms[1]) * 60 + (+splittedhms[2]);
}


//Écriture du fichier connections.json
fs.writeFileSync("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/connections.json", JSON.stringify(connections), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});

};

module.exports.runcnn = runcnn;
