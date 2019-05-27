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
  arret["stop_id"] = stops[i].stop_id;
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


//INITIALISATION DE LA TABLE JOURNEYS[]
let Journeys = [];
for (let i = 0; i < stops.length; i++) {
  Journeys[i] = new Array(4);
  Journeys[i][0] = parseInt(stops[i].stop_id);
  Journeys[i][1] = {}; //Objet vide destiné à accueillir "enter_connection" lors du scan {6}
  Journeys[i][2] = {}; //Objet vide destiné à accueillir "exit_connection" lors du scan {6}
  Journeys[i][3] = {}; //Objet vide destiné à accueillir le "final footpath" {3}
}
/*
let inConnection = [];
for (var i = 0; i < stops.length; i++) {
  const arret = {};
  arret["stop_id"] = stops[i].stop_id;
  arret["connection"] = []; //array vide au départ, qui accueillera éventuellement une connection
  inConnection.push(arret);
}
*/
console.log(Journeys);


//DÉBUT DE RÉFLEXION POUR LES LIGNES 9 À 12 DE L'ALGO
if (connections[i].arrival_time_ARRIVEE + Footpaths[j].f_dur < Stops[Footpaths[j].arr_stop].heure_arrivee){
  Journeys[i][1] = Trips[i].connection; //connection pour laquelle le trip_id a été atteint la 1ère fois
  Journeys[i][2] = connections[i];
  Journeys[i][3] = Footpaths[i]; //on envoit le triplet {f_depstop, f_arrstop, f_dur}
}


/*function scanTimetable() {
  readTextFile(timetable);
  while (timetable != end){ ////boucle jusqu'à la fin de fichier
    const lines = $('textarea').val().split('\n');
    const tabLigne = new Array(4);
    for (var i=0 ; i<4; i++) {
      tabLigne[i] = lines.val().split(','); //champs dans txt séparés par des virgules
    }
    for(var i = 0;i < lines.length;i++){
  //code here using lines[i] which will give you each line
    }
  }
}
*/
/*
for (var i = 0; i < connections.length; i++){
  console.log(connections[i].stop_id_DEPART);
}
*/

//IDÉE SEULEMENT DE STRUCTURE - À FAIRE PAR LIONEL
function identificationConnections() {
  //Input: la table "connections" (lecture slmt) et les tables "ArrivalTimestamp" et "inConnection" (modifications)
  //But: modifier dynamiquement les valeurs des deux tables "ArrivalTimestamp" et "inConnection" pour obtenir les quadruplets
  //correspondant aux connections permettant d'atteindre chaque arrêt (stop) le plus rapidement possible à partir de la station de départ
  //Output: tables "ArrivalTimestamp" et "inConnection" modifiées

let heureMax = Infinity; //au début, infini, puis se verra attribuer l'heure d'arrivée d'un arrêt de ArrêtsArrivéePotentiels

for (var i = 0; i < connections.length; i++){

  while (connections[i].departure_time >= heureDepart && connections[i].arrival_time <= heureMax){ //pas sûr pour conn[i].dep_time... ?

    if (Stops[connections[i].stop_id_DEPART].heure_arrivee <= connections[i].departure_time //connections[i][3] = stop_id_DEPART, connections[i][4] = departure_time_DEPART
      && Stops[connections[i].stop_id_ARRIVEE].heure_arrivee > connections[i].arrival_time) { //connections[i][5] = stop_id_ARRIVEE, connections[i][6] = arrival_time_ARRIVEE
        Stops[connections[i].stop_id_ARRIVEE].heure_arrivee = connections[i].arrival_time;
        inConnection[connections[i].stop_id_ARRIVEE].connection = connections[i]; //assigner un tableau fonctionnera-t-il ou doit-il être initialisé?
    }

    for (let j = 0; j < arretsArriveePotentiels.length; j++){

      if (connections[i].stop_id_ARRIVEE == arretsArriveePotentiels[j].stop_id){
        heureMax = connections[i].arrival_time + arretsArriveePotentiels[j].temps_acces;
        //normalement, on doit arrêter la boucle seulement après que le temps de marche maximal se soit écoulé..
      }

    }
  }
}
/* ANCIENNE VERSION AVANT 20 MARS
for (var i = 0; i < connections.length; i++){
  if (arrivalTimestamp[connections[i].stop_id_DEPART].heure_arrivee <= connections[i].departure_time //connections[i][3] = stop_id_DEPART, connections[i][4] = departure_time_DEPART
    && arrivalTimestamp[connections[i].stop_id_ARRIVEE].heure_arrivee > connections[i].arrival_time) { //connections[i][5] = stop_id_ARRIVEE, connections[i][6] = arrival_time_ARRIVEE
      arrivalTimestamp[connections[i].stop_id_ARRIVEE].heure_arrivee = connections[i].arrival_time;
      inConnection[connections[i].stop_id_ARRIVEE].connection = connections[i]; //assigner un tableau fonctionnera-t-il ou doit-il être initialisé?
    }
}

for (var i = 0; i < Stops.length; i++){
  if (Stops[i].stop_id == stationDepart){
    //console.log(Stops);
  }
}


/*
function reconstructionTrajet() {
  //Input: stationArrivee et table "inConnection"
  //But: accéder aux infos contenues dans les quadruplets de la table "inConnection" à partir de la Destination (stationArrivee) et reconstruire
  //l'itinéraire jusqu'à l'Origine (stationDepart) tout en sauvegardant tous les segments parcourus
  //Output: Liste des quadruplets (avec trip_id, service_id, stop_sequence) en ordre permettant de faire le trajet O-D
  let stationDepartTemporaire;
  let stationArriveeTemporaire = stationArrivee; //stationArrivee établi selon le choix de l'utilisateur
  let connectionsTrajet = [];
  let indiceTrajet = 0;
  while (stationDepartTemporaire != stationDepart) {
    for (var i = 0; i < inConnection.length; i++) {
      if (inConnection[i][1][5] == stationArriveeTemporaire) {
        connectionsTrajet[indiceTrajet] = inConnection[i][1]; //enregistrement de la connection d'arrivée = quadruplet = trip_id, service_id, stop_sequence
        indiceTrajet++;
        stationDepartTemporaire = inConnection[i][1][3];
      }
      stationArriveeTemporaire = stationDepartTemporaire;
    }
  }
  //La boucle while s'arrête lorsqu'on a atteint la station de départ
  //On obtient alors la table "connectionsTrajet" avec les connections nécessaires, mais à l'envers (de la destination vers l'origine)
  //Ladite table contient le quadruplet, mais aussi trip_id, service_id et stop_sequence (utile pour l'affichage et le groupement des
  //connections appartenant au même trip_id = aucun transfert nécessaire)
}
*/
