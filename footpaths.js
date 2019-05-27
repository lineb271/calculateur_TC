let fs = require('fs');
const toolkit = require("./Toolkit/toolkit.js");

let runftp = function runftp(){

//Get distance between two stops from coordinates
function getDistanceBetweenStops(stopid1, stopid2){
 const latLongStop1 = toolkit.getLatLong(stopid1);
 const latLongStop2 = toolkit.getLatLong(stopid2);
 const distanceBetweenStops = toolkit.getDistanceFromLatLonInKm(latLongStop1[0], latLongStop1[1], latLongStop2[0], latLongStop2[1]);
 return Math.round(distanceBetweenStops*100)/100;
}

//Fonction permettant de créer la table footpaths (correspondances)
function calculTransfert(){

const rayonMax = 1.0;
let distance_transfert = [];
//Première boucle qui crée un objet transfertFrom comprenant l'ID de l'arrêt, la latitude et la longitude à partir du fichier GTFS
for(let i = 0; i < stopsTable.length; i++){
	const transfertFrom = {};
	transfertFrom.fromStopId = stopsTable[i].stop_id;
	transfertFrom.fromStopLat = stopsTable[i].stop_lat;
	transfertFrom.fromStopLon = stopsTable[i].stop_lon;
	//Pour chacun des arrêts From, on cherche les arrêts correspondant TO en parcourant à nouveau le GTFS et un crée un deuxième objet avec l'ID, la la latitude et la longitude
	for(let j = 0; j <stopsTable.length; j++){
	  const transfertTo = {};
  	transfertTo.toStopId = stopsTable[j].stop_id;
  	transfertTo.toStopLat = stopsTable[j].stop_lat;
  	transfertTo.toStopLon = stopsTable[j].stop_lon;
  	//On crée une condition afin de ne conserver que les arrêts qui sont à 1 km les uns des autres. Ce sera le dernier objet qui comprendra la distance à partir de la fonction getDistanceFromLatLonInKm
  	let dist = toolkit.getDistanceFromLatLonInKm(transfertFrom.fromStopLat,transfertFrom.fromStopLon,transfertTo.toStopLat,transfertTo.toStopLon);
  		if (rayonMax > dist){
  		const transfert = {
    		fDepart: parseInt(transfertFrom.fromStopId),
    		fArrivee: parseInt(transfertTo.toStopId),
    		distance: getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId)),
    	  duree: (getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId))/3.6)*3600
  		  };
  			//Les données valides sont poussées dans l'array défini au début
  			distance_transfert.push(transfert);
  			//console.log([transfertFrom.fromStopId,transfertTo.toStopId,getDistanceBetweenStops(parseInt(transfertFrom.fromStopId),parseInt(transfertTo.toStopId))/3.6])
    	}
    }
    
  }

  //On écrit le fichier en JSON
  fs.writeFileSync("./generated_files/footpaths.json", JSON.stringify(distance_transfert), function (err) {
    if (err) throw err;
    });
  	console.log('Fichier créé avec succès');
    };

  // Télécharger le fichier en JSON afin de l'utiliser avec les fonctions précédentes
  //OD = toolkit.loadJSON('C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/OD.json');
  let stopsTable = toolkit.loadJSON('C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json');
  console.log('Téléchargement des fichiers');
  footpaths = calculTransfert();
};

module.exports.runftp = runftp;
