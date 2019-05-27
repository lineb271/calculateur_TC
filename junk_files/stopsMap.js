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
stops = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/Stops.json");

let connections = [];//correspondance avec la table "connections" créée au préalable dans TableConnections - conversion en JSON??
connections = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/connections.json");

let arretsDepartPotentiels = [];
arretsDepartPotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsDepartPotentiels.json");

let arretsArriveePotentiels = [];
arretsArriveePotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsArriveePotentiels.json");

let footpaths = [];
footpaths = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/footpaths.json");


//Création des Maps
const stopsMap = new Map();
for (let i = 0, count = stops.length; i < count; i++){
  const stop = stops[i];
  stop.footpaths = footpathsTransfertById.get(stop.stop_id);
  stopsMap.set(stop.stop_id,stop);
}

const tripsMap = new Map();
for (let i = 0, count = trips.length; i < count; i++){
  const trip = trips[i];
  trip.connection = {};
  stopsMap.set(trips.trip_id,trip);
}

const footpathsDepart = new Map();
const footpathsArrivee = new Map();
const footpathsTransfertById = new Map();
for (let i = 0, count = footpaths.length; i < count; i++){
  const footpath = footpaths[i];
  if (footpath.fDepart == null){
    footpathsDepart.set(footpath.fArrivee, footpath);
  } else if (footpath.fArrivee == null) {
    footpathsArrivee.set(footpath.fDepart, footpath);
  } else {
    const fromStopId = footpath.fDepart;
    const toStopId = footpath.fArrivee;
    const travelTime = footpath.duree;
    if (!footpathsTransfertById.get(fromStopId)){
      footpathsTransfertById.set(fromStopId, []);
    }
    footpathsTransfertById.get(fromStopId).push({toStopId: toStopId, tt: tt});
  }
}

const journeysMap = new Map();


//Test d'affichage
let heureTest = StopsMap.get(383);
console.log(heureTest);
