//Connexion à la librairie file system
const fs = require('fs');

/*
const longitudeDepart = -0.867179360500059; //ultimement, input de l'usager
const latitudeDepart = 45.5692535674762; //ultimement, input de l'usager
const longitudeArrivee = -0.867179360500059; //ultimement, input de l'usager
const latitudeArrivee = 45.5692535674762; //ultimement, input de l'usager
*/
let heureDepart = 25200;//clavier.in en format timestamp? À utiliser dans le SCAN DE LA TABLE CONNECTIONS (partie 1)


//Identification du nombre d'arrêts dans le réseau de transport à partir d'un des fichiers
//let nbArrets = 678; //normalement, une boucle devrait lire un fichier et compter le nombre de lignes
//Tentative de comptabilisation du nombre d'arrêts - ABANDONNÉ car non requis avec JSON

//let stops = []; Nécessaire? ou le try ci-dessous créera-t-il le tableau?
function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}


//IMPORTATION DES JSON REQUIS
let stops = [];
stops = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/stops.json");

let connections = [];//correspondance avec la table "connections" créée au préalable dans TableConnections - conversion en JSON??
connections = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/connections.json");

let arretsDepartPotentiels = [];
arretsDepartPotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsDepartPotentiels.json");

let arretsArriveePotentiels = [];
arretsArriveePotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsArriveePotentiels.json");


//INITIALISATION DE LA TABLE STOPS[]
let Stops = [];
for (let i = 0; i < stops.length; i++) {
  const arret = {};
  arret["stop_id"] = parseInt(stops[i].stop_id);
  arret["heure_arrivee"] = Infinity;
  Stops.push(arret);
}
//AJUSTEMENT DES HEURES DE DÉPART POUR LES ARRÊTS DE DÉPART POTENTIELS
for (let i = 0; i < Stops.length; i++) {
  for (let j = 0; j < arretsDepartPotentiels.length; j++){
    if (Stops[i].stop_id == arretsDepartPotentiels[j].stop_id){
      Stops[i].heure_arrivee = heureDepart + arretsDepartPotentiels[j].temps_acces; //HEURE D'ARRIVÉE À CE STOP_ID
    }
  }
}

fs.writeFileSync("Stops.json", JSON.stringify(Stops), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});

//INITIALISATION DE LA TABLE JOURNEYS[]
let Journeys = [];
for (let i = 0; i < stops.length; i++) {
  Journeys[i] = new Array(4);
  Journeys[i][0] = parseInt(stops[i].stop_id);
  Journeys[i][1] = {}; //Objet vide destiné à accueillir "enter_connection" lors du scan {6}
  Journeys[i][2] = {}; //Objet vide destiné à accueillir "exit_connection" lors du scan {6}
  Journeys[i][3] = {}; //Objet vide destiné à accueillir le "final footpath" {3}
}

fs.writeFileSync("Journeys.json", JSON.stringify(Journeys), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});


//Création de la Map relative à la table Stops[]
let StopsMap = new Map();
let keyObj = undefined;
let heureArr = undefined;
for (let i = 0; i < Stops.length; i++){
  keyObj = Stops[i].stop_id;
  heureArr = Stops[i].heure_arrivee;
  StopsMap.set(keyObj,heureArr);
}

//Création de la Map relative à la table Trips[]
let TripsMap = new Map();
let keyObj = undefined;
let valeur = {};
for (let i = 0; i < Trips.length; i++){
  keyObj = Trips[i].trip_id;
  valeur["is_reached"] = Trips[i].is_reached;
  valeur["enter_connection"] = Trips[i].enter_connection; //RESTE À VOIR SI ENREGISTRERA TOUTE LA CONNECTION
  TripsMap.set(keyObj,valeur);
}

//Création de la Map relative à la table Journeys[]
let JourneyMaps = new Map();
let keyObj = undefined;
let valeur = {};
for (let i = 0; i < Stops.length; i++){
  keyObj = Stops[i].stop_id;
  valeur["enter_connection"] = {}; //Mettre seulement l'identifiant unique de la connection
  valeur["exit_connection"] = {}; //Mettre seulement l'identifiant unique de la connection
  valeur["final_footpath"] = {}; //Mettre seulement l'identifiant unique du footpath
  JourneysMap.set(keyObj,valeur);
}

//Algorithme des lignes 9 à 12 - ESSAI
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
