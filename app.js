const fs = require('fs');


function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}

//Fonction liée à l'algorithme CSA
var runapp = function  runapp(){

//Importation des fichiers JSON
OD = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/OD.json");

let stopsGTFS = [];
stopsGTFS = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json");

let trips = [];
trips = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/trips.json");

let connections = [];//correspondance avec la table "connections" créée au préalable dans TableConnections - conversion en JSON??
connections = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/connections.json");

let arretsDepartPotentiels = [];
arretsDepartPotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/arretsDepartPotentiels.json");

let arretsArriveePotentiels = [];
arretsArriveePotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/arretsArriveePotentiels.json");

let footpaths = [];
footpaths = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/footpaths.json");

let journeys = [];
journeys = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/journeys.json");

//Normalement, devrait être importée à même le fichier OD.json
let heureDepart = 25200;


//Création du maps relatif aux footpaths (correspondances)
const footpathsTransfertById = new Map();
for (let i = 0, count = footpaths.length; i < count; i++){
  const footpath = footpaths[i];

    const fromStopId = parseInt(footpath.fDepart);
    const toStopId = parseInt(footpath.fArrivee);
    const travelTime = parseInt(footpath.duree);
    if (!footpathsTransfertById.get(fromStopId)){
      footpathsTransfertById.set(fromStopId, []);
    }
    footpathsTransfertById.get(fromStopId).push({"fromStopId": fromStopId, "toStopId": toStopId, "travelTime": travelTime});
}

//Création du maps relatif aux trips
const tripsMap = new Map();
for (let i = 0, count = trips.length; i < count; i++){
  const trip = trips[i];
  trip.connection = null;
  tripsMap.set(parseInt(trip.trip_id),trip);
}

//Création du maps relatif aux journeys
const journeysMap = new Map();
for (let i = 0, count = journeys.length; i < count; i++){
  const journey = journeys[i];
  journeysMap.set(journey.stop_id, journey);
}

//Création du maps relatif aux stopsGTFS
const stopsMap = new Map();
for (let i = 0, count = stopsGTFS.length; i < count; i++){
  const stop = stopsGTFS[i]; //à partir de stopsGTFS = ne devrait pas contenir -100 et -200
  stop.footpaths = footpathsTransfertById.get(parseInt(stop.stop_id));
  stop.arrival_time = Infinity;
  for (let j = 0, count = arretsDepartPotentiels.length; j < count; j++){
    if (stop.stop_id == arretsDepartPotentiels[j].stop_id){
      stop.arrival_time = heureDepart + arretsDepartPotentiels[j].temps_acces;
    }
  }
  stopsMap.set(parseInt(stop.stop_id),stop);


//Boucle CSA (figure 6)
let transferts = [];
let tripsTemporaire = {};
let stopsTemporaire = {};
let journeysTemporaire = {};
for (let i = 0, count = connections.length; i < count; i++){
  if (connections[i].service_id == 3){ //service_id = 3 pour service en semaine
    transferts = footpathsTransfertById.get(connections[i].stop_id_ARRIVEE);
    if (tripsMap.get(connections[i].trip_id).connection !== null || stopsMap.get(connections[i].stop_id_DEPART).arrival_time <= connections[i].departure_time){
      if (tripsMap.get(connections[i].trip_id).connection == null){
          tripsTemporaire = tripsMap.get(connections[i].trip_id); //objet {}
          tripsTemporaire.connection = connections[i]; //connection = objet {}
          tripsMap.set(connections[i].trip_id, tripsTemporaire);
      }
      for (let j = 0, count = transferts.length; j < count; j++){ //transferts = footpathsTransfertById.get(connections[i].stop_id_ARRIVEE);
        if (connections[i].arrival_time + transferts[j].travelTime < stopsMap.get(transferts[j].toStopId).arrival_time){
          stopsTemporaire = stopsMap.get(transferts[j].toStopId); //objet {}
          stopsTemporaire.arrival_time = connections[i].arrival_time + transferts[j].travelTime;
          stopsMap.set(transferts[j].toStopId, stopsTemporaire);
          journeysTemporaire = journeysMap.get(transferts[j].toStopId); //objet {stop_id, {enter_connection}, {exit_connection}, {final_footpath}}
          journeysTemporaire.enter_connection = tripsMap.get(connections[i].trip_id).connection; //objet {}
          journeysTemporaire.exit_connection = connections[i]; //objet {}
          journeysTemporaire.final_footpath = transferts[j]; //objet {}
          journeysMap.set(transferts[j].toStopId, journeysTemporaire);
        }
      }
    }
  }
}


//Modification des heures d'arrivée aux arrêts d'arrivée potentiels
for (let i = 0, count = arretsArriveePotentiels.length; i < count; i++){
  let id = arretsArriveePotentiels[i].stop_id;
  arretsArriveePotentiels[i].heure_arrivee = stopsMap.get(id).arrival_time;
}


//Écriture du fichier d'arrêts d'arrivée potentiels modifié
fs.writeFileSync("./generated_files/arretsArriveePotentiels.json", JSON.stringify(arretsArriveePotentiels), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});


//Écriture du fichier contenant les nouveaux journeys remplis
let nouveauxJourneys = [];
for (let i = 0, count = journeys.length; i < count; i++){
  let ligne = {};
  ligne = journeysMap.get(journeys[i].stop_id);
  nouveauxJourneys.push(ligne);
}
fs.writeFileSync("./generated_files/nouveauxJourneys.json", JSON.stringify(nouveauxJourneys), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});


};

module.exports.runapp = runapp;
