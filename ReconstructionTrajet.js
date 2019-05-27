//Connexion à la librairie file system
const fs = require('fs');


var runrt = function  runrt(){

//Importer stops et journeys
function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}

//Importation de stopsGTFS.json et journeys.json
let stopsGTFS = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json");
let journeys = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/nouveauxJourneys.json");

//Création d'un map pour les journeys (remplis)
const journeysMap = new Map();
for (let i = 0, count = journeys.length; i < count; i++){
  const journey = journeys[i];
  journeysMap.set(journey.stop_id, journey);
}

//Importation de fichiers nécessaires à l'algo CSA
let connections = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/connections.json")
let arretsDepartPotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/arretsDepartPotentiels.json");
let arretsArriveePotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/arretsArriveePotentiels.json");


//Définir l'arret d'arrivée à partir de la Destination (-200: accessible depuis arretArriveePot + temps_marche)
let TabHeureArrivee=[];
for (i=0; i<arretsArriveePotentiels.length; i++){
  TabHeureArrivee[i] = arretsArriveePotentiels[i].heure_arrivee + arretsArriveePotentiels[i].temps_marche;
}

//Établissement de l'heure minimale d'arrivée
let HeureArrivee = Math.min.apply(null, TabHeureArrivee);


//Trouver l'arrêt d'arrivée ID permettant l'heure d'arrivée minimale
let arretArriveeID = 0;
let arretArrivee = {};
for (let i = 0; i < arretsArriveePotentiels.length; i++){
    if (arretsArriveePotentiels[i].heure_arrivee + arretsArriveePotentiels[i].temps_marche == HeureArrivee){
      arretArriveeID = parseInt(arretsArriveePotentiels[i].stop_id);
      arretArrivee = arretsArriveePotentiels[i];
      }
}


let key = 0;
let a = 0;
let sequenceTemporaire = [];

//On rentre le premier élément dans la séquence = footpath entre arrêt d'arrivée et Destination
sequenceTemporaire.push(arretArrivee);
var arretDepPot_is_reached = 0;

//Boucle pour itérer vers l'arrêt de départ potentiel et enregistrer les journeys dans la séquence
while (a < journeys.length && !Boolean(arretDepPot_is_reached)){

  var aaID = arretArriveeID;
  const trajet = journeysMap.get(aaID);
  sequenceTemporaire.push(trajet);
  const enter_connection = trajet.enter_connection;
  const stop_id_DEPART = enter_connection.stop_id_DEPART;
  console.log(stop_id_DEPART);
  aaID = stop_id_DEPART;
  for (let i = 0, count = arretsDepartPotentiels.length; i < count; i++){
    if (aaID == arretsDepartPotentiels[i].stop_id){
      key = aaID;
      arretDepPot_is_reached = 1;
    }
  }
  a++;
}

//Insertion du footpath de départ (Origine vers arrêt de départ potentiel)
let arretDepart = {};

for (let i = 0; i < arretsDepartPotentiels.length; i++){
  if (arretsDepartPotentiels[i].stop_id == key){
    arretDepart = arretsDepartPotentiels[i];
  }
}
sequenceTemporaire.push(arretDepart);
var sequence = sequenceTemporaire.reverse();


//Écriture de la séquence dans le bon ordre en JSON
fs.writeFileSync("./generated_files/sequence.json", JSON.stringify(sequence), function (err) {
if (err) throw err;
	console.log('Fichier créé avec succès');
});

//console.log(sequence.length);



//Création d'un stopsMap pour extraire les coordonnées des arrêts
const stopsMap = new Map();
for (let i = 0, count = stopsGTFS.length; i < count; i++){
  const stop = stopsGTFS[i]; //à partir de stopsGTFS = ne devrait pas contenir -100 et -200
  stopsMap.set(parseInt(stop.stop_id),stop);
}

//Pointer vers les stopsMap pour extraire les coordonnées et les enregistrer en vue de l'affichage
let nbObjets = sequence.length-1;
var output = [];
const objet = {};
let stopsMapDepart = {};
let stopsMapArrivee = {};
//footpath de Origine vers Arrêt départ potentiel
const depart = sequence[0];
objet.lat1 = depart.orig_lat;
objet.lon1 = depart.orig_lon;
objet.lat2 = depart.stop_lat;
objet.lon2 = depart.stop_lon;
output.push(objet);
//intégration des coordonnées des nouveauxJourneys[] --> pointer vers le stopsMap
//i = 1 et sequence.length-1 pour ne pas considérer les premier et dernier objets (= footpath départ et arrivée)
for (let i = 1, count = sequence.length-1; i < count; i++){
  const arretDepart = sequence[i].enter_connection.stop_id_DEPART;
  const arretArrivee = sequence[i].exit_connection.stop_id_ARRIVEE;
  console.log(arretDepart);
  console.log(arretArrivee);
  stopsMapDepart = stopsMap.get(arretDepart);
  stopsMapArrivee = stopsMap.get(arretArrivee);
  console.log(stopsMapDepart);
  console.log(stopsMapArrivee);
  objet.lat1 = parseFloat(stopsMapDepart.stop_lat);//parseInt(stopsMap.get(arretDepart).stop_lat);
  objet.lon1 = parseFloat(stopsMapDepart.stop_lon);//parseInt(stopsMap.get(arretDepart).stop_lon);
  objet.lat2 = parseFloat(stopsMapArrivee.stop_lat);//parseInt(stopsMap.get(arretArrivee).stop_lat);
  objet.lon2 = parseFloat(stopsMapArrivee.stop_lon);//parseInt(stopsMap.get(arretArrivee).stop_lon);
  output.push(objet);
}
//footpath de Arrêt arrivée potentiel vers Destination
objet.lat1 = sequence[nbObjets].orig_lat;
objet.lon1 = sequence[nbObjets].orig_lon;
objet.lat2 = sequence[nbObjets].stop_lat;
objet.lon2 = sequence[nbObjets].stop_lon;
output.push(objet);

//Fichier output servant à l'affichage (vers le html)
console.log(output);

};

module.exports.runrt = runrt;
