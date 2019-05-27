const fs = require ('fs');
const toolkit = require("./toolkit/toolkit.js");

//IMPORTATION DES FICHIERS JSON (LIGNES 67 - 80)

const stoptimes = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/stop_times.json");

const trips = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/trips.json");

const arretsDepartPotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsDepartPotentiels.json");

const arretsArriveePotentiels = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/arretsArriveePotentiels.json");

const heureDepart = 25200;


//CRÉATION DE LA TABLE INTERMÉDIAIRE TIMETABLE (LIGNES 83 - 97)
let timetable = []; //longueur indéfinie
for (let i = 0; i < stoptimes.length; i++) {
  timetable[i] = new Array(6);
  timetable[i][0] = stoptimes[i].trip_id;
  timetable[i][1] = stoptimes[i].stop_sequence;
  for (let j = 0; j < trips.length; j++){
    if (trips[j].trip_id == stoptimes[i].trip_id){
      timetable[i][2] = trips[j].service_id;
    }
  }
  timetable[i][3] = stoptimes[i].stop_id;
  timetable[i][4] = stoptimes[i].arrival_time;
  timetable[i][5] = stoptimes[i].departure_time;
}


//CRÉATION DE LA TABLE CONNECTIONS (LIGNES 100 - 128)
let connections = [];
for (let i = 0; i < timetable.length; i++){
  const connection = {};
  connection["trip_id"] = parseInt(timetable[i][0]); //trip_id
  connection["stop_sequence"] = parseInt(timetable[i][1]); //stop_sequence
  connection["service_id"] = parseInt(timetable[i][2]); //service_id
  connection["stop_id_DEPART"] = parseInt(timetable[i][3]); //stop_id (DÉPART)
  connection["departure_time"] = convertHMStoSeconds(timetable[i][5]); //departure_time (DÉPART)
  for (let j = 0; j < timetable.length; j++){
    if (connection["trip_id"] == parseInt(timetable[j][0]) //correspondance du trip_id
    && connection["service_id"] == parseInt(timetable[j][2]) //correspondance du service_id
    && Number(timetable[j][1]) == Number(connection["stop_sequence"])+Number(1)){ //vérification de la séquence = celui de timetable est +1 p/r à connections
      connection["stop_id_ARRIVEE"] = parseInt(timetable[j][3]); //stop_id (ARRIVÉE)
      connection["arrival_time"] = convertHMStoSeconds(timetable[j][4]); //arrival_time (ARRIVÉE)
    }
  }
  if (connection["arrival_time"] !== null && connection["arrival_time"] !== undefined) {
    connections.push(connection);
  }
}
connections.sort(compareFourthColumn); //remettre en ordre d'heure de départ croissant

fs.writeFileSync("connections.json", JSON.stringify(connections), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});

//const connections = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/connections.json");


//CRÉATION DE LA TABLE FOOTPATHS (LIGNES 131 - 230)
//Fonction qui permet de créer la table footpaths
let footpaths = [];
function calculFootpaths(){
	console.log('Calcul des départs et arrivées en cours');
	//let footpaths = []; //Création d'un array vide dans lequel seront stockés les objets

	// Boucle scannant la table arrêtsDépartspotentiels
	for(let i = 0; i < arretsDepartPotentiels.length; i++){
	  const f_dep1 = {};
	  f_dep1.id =  arretsDepartPotentiels[i].stop_id; //Équiavaut à f_depstop dans CSA
	  f_dep1.lat = arretsDepartPotentiels[i].orig_lat;
	  f_dep1.lon = arretsDepartPotentiels[i].orig_lon;
	  for(let j = 0; j < arretsDepartPotentiels.length; j++){
	    const f_arr1 = {};
	    f_arr1.id = arretsDepartPotentiels[j].stop_id; //Équivaut à f_arrstop dans CSA
	    f_arr1.lat = arretsDepartPotentiels[j].stop_lat;
	    f_arr1.lon = arretsDepartPotentiels[j].stop_lon;
	      const f_depPot = {
					fDepart: parseInt(f_dep1.id),
					fArrivee: parseInt(f_arr1.id),
					distance: getDistanceBetweenStops(parseInt(f_dep1.id), parseInt(f_arr1.id)),
			    duree: getDistanceBetweenStops(parseInt(f_dep1.id), parseInt(f_arr1.id))/3.6
					}; //C'est dans cet objet que l'arrêt de départ et d'arrivée est stocké en plus de la durée obtenue avec OSRM
					footpaths.push(f_depPot); // On pousse cet objet dans l'array
			}
		}

		// Deuxième boucle qui scanne la table arrêtsArrivéepotentiels
		for(let i = 0; i < arretsArriveePotentiels.length; i++){
		  const f_dep2 = {};
		  f_dep2.id = arretsArriveePotentiels[i].stop_id; //Équivaut à f_depstop dans CSA
		  f_dep2.lat = arretsArriveePotentiels[i].orig_lat;
		  f_dep2.lon = arretsArriveePotentiels[i].orig_lon;
		  for(let j = 0; j < arretsArriveePotentiels.length; j++){
		    const f_arr2 = {};
		    f_arr2.id =  arretsArriveePotentiels[j].stop_id; //Équivaut à f_arrstop dans CSA
		    f_arr2.lat = arretsArriveePotentiels[j].stop_lat;
		    f_arr2.lon = arretsArriveePotentiels[j].stop_lon;
		      const f_arrPot = {
		      fDepart: parseInt(f_dep2.id),
				  fArrivee: parseInt(f_arr2.id),
					distance: getDistanceBetweenStops(parseInt(f_dep2.id), parseInt(f_arr2.id)),
					duree: getDistanceBetweenStops(parseInt(f_dep2.id), parseInt(f_arr2.id))/3.6
		      };  //C'est dans cet objet que l'arrêt de départ et d'arrivée est stocké en plus de la durée obtenue avec OSRM
		      footpaths.push(f_arrPot);  // On pousse cet objet dans l'array
				}
			}
	//On ajoute les nouvelles infos au fichier créé précédemment
  fs.writeFileSync("footpaths.json", JSON.stringify(footpaths), function (err) {
  if (err) throw err;
	});
};

//Fonction qui calcul ajoute les transferts au fichier footpaths
function calculTransfert () {
	console.log('Calcul des transferts en cours');
	const rayonMax = 1.0;
	//On crée un array qui comprendra les objets
	let distance_transfert = [];

	//Première boucle qui crée un objet transfertFrom comprenant l'ID de l'arrêt, la latitue et la longitude à partir du fichier GTFS
	for(let i = 0; i < stops.length; i++){
		const transfertFrom = {};
		transfertFrom.fromStopId = stops[i].stop_id;
		transfertFrom.fromStopLat = stops[i].stop_lat;
		transfertFrom.fromStopLon = stops[i].stop_lon;
		//Pour chacun des arrêts From, on cherche les arrêts correspondant TO en parcourant à nouveau le GTFS et un crée un deuxième objet avec l'ID, la la latitude et la longitude
		for(let j = 0; j <stops.length; j++){
			const transfertTo = {};
			transfertTo.toStopId = stops[j].stop_id;
			transfertTo.toStopLat = stops[j].stop_lat;
			transfertTo.toStopLon = stops[j].stop_lon;
			//On crée une condition afin de ne conserver que les arrêts qui sont à 1 km les uns des autres. Ce sera le dernier objet qui comprendra la distance à partir de la fonction getDistanceFromLatLonInKm
			let dist = getDistanceFromLatLonInKm(transfertFrom.fromStopLat,transfertFrom.fromStopLon,transfertTo.toStopLat,transfertTo.toStopLon);
				if (rayonMax > dist){
					const transfert = {
					fDepart: parseInt(transfertFrom.fromStopId),
					fArrivee: parseInt(transfertTo.toStopId),
					distance: getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId)),
			    duree: getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId))/3.6
					};
				//Les données valides sont poussées dans l'array défini au début
				distance_transfert.push(transfert);
				//console.log([transfertFrom.fromStopId,transfertTo.toStopId,getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId))/3.6])

				//console.log([transfertFrom.fromStopId,transfertTo.toStopId])

			}
		}
	}
	//On écrit le fichier en JSON
	fs.appendFileSync("footpaths.json", JSON.stringify(distance_transfert), function (err) {
  if (err) throw err;
  });
	console.log('Fichier créé avec succès');
};

footpaths = calculFootpaths();
footpaths = calculTransfert();
console.log(footpaths);
//const footpaths = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/footpaths.json");

/*
//CREATION DE LA TABLE JOURNEYS INITIALE
let journeys = [];
for (let i = 0; i < stops.length; i++) {
  const journey = {};
  journey.stop_id = parseInt(stops[i].stop_id);
  journey.enter_connection = {}; //Objet vide destiné à accueillir "enter_connection" lors du scan {6}
  journey.exit_connection = {}; //Objet vide destiné à accueillir "exit_connection" lors du scan {6}
  journey.final_footpath = {}; //Objet vide destiné à accueillir le "final footpath" {3}
  journeys.push(journey);
}
//const journeys = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/journeys.json");

//CRÉATION DES MAPS (LIGNES 233 - 282)
//Maps (3) du fichier footpaths
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

//Map du fichier stops
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

//Map du fichier trips
const tripsMap = new Map();
for (let i = 0, count = trips.length; i < count; i++){
  const trip = trips[i];
  trip.connection = null;
  tripsMap.set(parseInt(trip.trip_id),trip);
}

//Map du fichier journeys
const journeysMap = new Map();
for (let i = 0, count = journeys.length; i < count; i++){
  const journey = journeys[i];
  journeysMap.set(journey.stop_id, journey);
}


//SCAN CSA DE LA TABLE CONNECTIONS (LIGNES 285 - 322)
let transferts = []; //pour importer les correspondances possibles à la lecture de chaque connection
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

/*
//RECONSTRUCTION DU TRAJET (LIGNES 325 - 418)
//Fonctions permettant de donner le nom d'un arrêt à partir de son stopID et inversement
let stopID = 0;
function giveStopName (stopID){
for (let i = 0; i < stops.length; i++){
  if (Number(stops[i].stop_id) == stopID){
    return (stops[i].stop_name);
    }
  }
}

let stopName = "";
function giveStopID (stopName){
  for (let i = 0; i < stops.length; i++){
    if (stops[i].stop_name == stopName){
      return (stops[i].stop_id);
      }
    }
}

//Fonction permettant de séparer un string selon un séparateur
function splitString(stringToSplit, separator) {
  var arrayOfStrings = stringToSplit.split(separator);
  return arrayOfStrings;
}

//Séparer toute la table journeys selon les virgules
let enterConnectionTab = [];
let exitConnectionTab = [];
let finalFootpathTab = [];
for (i=0; i<journeys.length; i++){
  enterConnectionTab[i] = splitString(journeys[i].enter_connection, ",");
  exitConnectionTab[i] = splitString(journeys[i].exit_connection, ",");
  finalFootpathTab[i] = splitString(journeys[i].final_footpath, ",");
}

//Fonction transformant une connection/footpath du tableau journeys en string
function affichage(caseJourneys){
  let caseJourneysTab = splitString (caseJourneys, ",");
  if (caseJourneysTab.length == 5){
    let dep = giveStopName(Number(caseJourneysTab[1]));
    let arr = giveStopName(Number (caseJourneysTab[2]));
    let hrdep = caseJourneysTab[3];
    let hrarr = caseJourneysTab[4];
    console.log ("Je vais de l'arrêt " + dep + " à l'arrêt " + arr + " de " + hrdep + " à " + hrarr);
  } else if (caseJourneysTab.length == 3){
    let depfp = giveStopName(Number(caseJourneysTab[0]));
    let arrfp = giveStopName(Number (caseJourneysTab[1]));
    let durfp = caseJourneysTab[2];
    console.log ("Je vais de l'arrêt " + depfp + " à l'arrêt " + arrfp + " en marchant " + durfp + " minutes");
  }
}

Définir l'arret d'arrivée à partir de arretsArriveePotentiels
let TabHeureArrivee=[];
for (i=0; i<arretsArriveePotentiels.length; i++){
  TabHeureArrivee[i] = arretsArriveePotentiels[i].heure_arrivee;
}

let HeureArrivee = Math.min(TabHeureArrivee);
let ArretArriveeID = 0;

for (let i = 0; i < arretsArriveePotentiels.length; i++){
    if (arretsArriveePotentiels[i].heure_arrivee == HeureArrivee){
      ArretArriveeID = Number(arretsArriveePotentiels[i].stop_id);
      }

let abc =0;
while (  abc < journeysMap.length && connections[journeys.enter_connection].stopid_DEPART ==! null){
  const trajet = journeysMap.get(ArretArriveeID);
  arretArriveeID = connections[trajet.enter_connection].stopid_DEPART;
  console.log(trajet);
  abc++;
}

const fin = journeysMap.get(arretArriveeID);
console.log (fin);

/*Reconstruction du trajet avec boucles for
for (let i=0; i<journeys.length; i++){
   if (Number(journeys[i].stop_id) == ArretArriveeID && journeys[i].enter_connection !== {}){
        affichage(journeys[i].final_footpath);
        affichage(journeys[i].exit_connection);
        affichage(journeys[i].enter_connection);
        ArretArriveeID = enterConnectionTab[i][1];
    }
}

for (let i=0; i<journeys.length; i++){
    if (Number(journeys[i].stop_id) == ArretArriveeID && journeys[i].enter_connection == {}){
      console.log("Je marche " + finalFootpathTab[i][2] + " minutes de mon domicile jusqu'à l'arrêt de départ " + giveStopName(journeys[i].stop_id));
    }
  }
*/
