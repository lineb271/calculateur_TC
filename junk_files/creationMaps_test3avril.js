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

//Importation des fichiers JSON
let stops = [];
stops = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/stops.json");

let trips = [];
trips = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/trips.json");

let connections = [];//correspondance avec la table "connections" créée au préalable dans TableConnections - conversion en JSON??
connections = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/connections.json");

let arretsDepartPotentiels = [];
arretsDepartPotentiels = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/arretsDepartPotentiels.json");

let arretsArriveePotentiels = [];
arretsArriveePotentiels = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/arretsArriveePotentiels.json");

let footpaths = [];
footpaths = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/footpaths.json");

let journeys = [];
journeys = loadJSON("C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/journeys.json");

let heureDepart = 25200;

//Création des Maps
const footpathsDepart = new Map();
const footpathsArrivee = new Map();
const footpathsTransfertById = new Map();
for (let i = 0, count = footpaths.length; i < count; i++){
  const footpath = footpaths[i];
  if (footpath.fDepart == 0){
    footpathsDepart.set(parseInt(footpath.fArrivee), footpath);
  } else if (footpath.fArrivee == 0) {
    footpathsArrivee.set(parseInt(footpath.fDepart), footpath);
  } else {
    const fromStopId = parseInt(footpath.fDepart);
    const toStopId = parseInt(footpath.fArrivee);
    const travelTime = parseInt(footpath.duree);
    if (!footpathsTransfertById.get(fromStopId)){
      footpathsTransfertById.set(fromStopId, []);
    }
    footpathsTransfertById.get(fromStopId).push({"fromStopId": fromStopId, "toStopId": toStopId, "travelTime": travelTime});
  }
}

const stopsMap = new Map();
for (let i = 0, count = stops.length; i < count; i++){
  const stop = stops[i];
  stop.footpaths = footpathsTransfertById.get(stop.stop_id);
  stop.arrival_time = Infinity;
  for (let j = 0, count = arretsDepartPotentiels.length; j < count; j++){
    if (stop.stop_id == arretsDepartPotentiels[j].stop_id){
      stop.arrival_time = heureDepart + arretsDepartPotentiels[j].temps_acces;
    }
  }
  stopsMap.set(parseInt(stop.stop_id),stop);
}


const tripsMap = new Map();
for (let i = 0, count = trips.length; i < count; i++){
  const trip = trips[i];
  trip.connection = null;
  tripsMap.set(parseInt(trip.trip_id),trip);
}


const journeysMap = new Map();
for (let i = 0, count = journeys.length; i < count; i++){
  const journey = journeys[i];
  journeysMap.set(journey.stop_id, journey);
}

//Test d'affichage
/*
const stopTest = stopsMap.get(383);
console.log(stopTest);

const tripTest = tripsMap.get(34);
console.log(tripTest);

const fdepTest = footpathsDepart.get(383);
console.log(fdepTest);

const farrTest = footpathsArrivee.get(390);
console.log(farrTest);

const footpathsTransfertTest = footpathsTransfertById.get(383);
console.log(footpathsTransfertTest);

const journeysTest = journeysMap.get(383);
console.log(journeysTest);
*/

//Algorithme des lignes 9 à 12 - ESSAI

/*
let tentativeArrival;
for (let i = 0; i < connections.length; i++){
  for (let j = 0; j < Footpaths.length; j++){
    if (connections[i].stop_id_ARRIVEE === Footpaths[j].f_depstop.stop_id){
      tentativeArrival = StopMaps.get(Footpaths[j].f_arrstop.stop_id); //envoit au get le stop_id de l'arrêt de destination du footpath
      if (connections[i].arrival_time + Footpaths[j].f_dur < tentativeArrival){
        tentativeArrival = connections[i].arrival_time + Footpaths[j].f_dur;
        StopsMaps.set(Footpaths[j].f_arrstop.stop_id,tentativeArrival); //selon Pierre-Léo: devrait enregistrer la nouvelle heure d'arrivée
        JourneyMaps.set(Footpaths[j].f_arrstop.stop_id,valeur);//triplet (c_enter, c_out, final_footpath) avec indices seulement?
      }
    }
  }
}
*/
//console.log(arretsDepartPotentiels.length);
let transferts = [];
let tripsTemporaire = {};
let stopsTemporaire = {};
let journeysTemporaire = {};
for (let i = 0, count = connections.length; i < count; i++){
  if (connections[i].service_id == 3){ //service_id = 3 pour service en semaine
    transferts = footpathsTransfertById.get(connections[i].stop_id_ARRIVEE);
    //console.log(transferts);
    if (tripsMap.get(connections[i].trip_id).connection || stopsMap.get(connections[i].stop_id_DEPART).arrival_time <= connections[i].departure_time){
      if (tripsMap.get(connections[i].trip_id).connection == null){
          tripsTemporaire = tripsMap.get(connections[i].trip_id);
          //console.log(tripsTemporaire);
          //console.log(connections[i]);
          tripsTemporaire.connection = connections[i];
          //tripsMap.get(connections[i].trip_id).connection = connections[i];
          tripsMap.set(connections[i].trip_id, tripsTemporaire);
          //console.log(tripsMap.get(connections[i].trip_id));
      }
      for (let j = 0, count = transferts.length; j < count; j++){ //transferts = footpathsTransfertById.get(connections[i].stop_id_ARRIVEE);
        if (connections[i].heure_arrivee + transferts[j].travelTime < stopsMap.get(transferts[j].toStopId).arrival_time){
          stopsTemporaire = stopsMap.get(transferts[j].toStopId);
          stopsTemporaire.arrival_time = connections[i].heure_arrivee + transferts[j].travelTime;
          stopsMap.set(transferts[j].toStopId, stopsTemporaire);
          //stopsMap.get(transferts[j].toStopId).arrival_time = connections[i].heure_arrivee + transferts[j].travelTime;
          journeysTemporaire = journeysMap.get(transferts[j].toStopId);
          journeysTemporaire.enter_connection = tripsMap.get(connections[i].trip_id).connection;
          journeysTemporaire.exit_connection = connections[i];
          journeysTemporaire.final_footpath = transferts[j];
          journeysMap.set(transferts[j].toStopId, journeysTemporaire);
          //journeysMap.get(transferts[j].toStopId).enter_connection = tripsMap.get(connections[i].trip_id).connection;
          //journeysMap.get(transferts[j].toStopId).exit_connection = connections[i];
          //journeysMap.get(transferts[j].toStopId).final_footpath = transferts[j];
        }
      }
    }
  }
}
//console.log(compteur);
const journeysTest = journeysMap.get(384);
console.log(journeysTest);
//if (tripsMap.connection != null){
  //console.log(tripsMap);
