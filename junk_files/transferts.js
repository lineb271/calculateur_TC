let fs = require('fs');

//Fonction pour lire JSON
function loadJSON(filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) == 'undefined') encoding = 'utf8';

		// read file synchroneously
		var contents = fs.readFileSync(filename, encoding);

		// parse contents as JSON
		return JSON.parse(contents);

	} catch (err) {
		// an error occurred
		throw err;
	}
};

function calculDistance () {
	console.log('Calcul des distances en cours');
	const rayonMax = 1.0;
	//On crée un array qui comprendra les objets
	let distance_transfert = [];

	//Première boucle qui crée un objet transfertFrom comprenant l'ID de l'arrêt, la latitue et la longitude à partir du fichier GTFS
	for(let i = 0; i < stopsTable.length; i++){
		const transfertFrom = {};
		transfertFrom.fromStopId = stopsTable[i].stop_id;
		transfertFrom.fromStopLat = stopsTable[i].stop_lat;
		transfertFrom.fromStopLon = stopsTable[i].stop_lon;
		//Pour chacun des arrêts From, on cherche les arrêts correspondant TO en parcourant à nouveau le GTFS et un crée un deuxième objet avec l'ID, la la latitude et la longitude
		for(let j = 0; j < stopsTable.length; j++){
			const transfertTo = {};
			transfertTo.toStopId = stopsTable[j].stop_id;
			transfertTo.toStopLat = stopsTable[j].stop_lat;
			transfertTo.toStopLon = stopsTable[j].stop_lon;
			//On crée une condition afin de ne conserver que les arrêts qui sont à 1 km les uns des autres. Ce sera le dernier objet qui comprendra la distance à partir de la fonction getDistanceFromLatLonInKm
			let dist = getDistanceFromLatLonInKm(transfertFrom.fromStopLat, transfertFrom.fromStopLon, transfertTo.toStopLat, transfertTo.toStopLon);
				if (rayonMax > dist){
					const transfert = {
					fromStopId: transfertFrom.fromStopId,
					fromStoplat: transfertFrom.fromStopLat,
					FromStopLon: transfertFrom.fromStopLon,
					toStopId: transfertTo.toStopId,
					toStopLat: transfertTo.toStopLat,
					toStopLon: transfertTo.toStopLon,
					distance: dist
					};
				//Les données valides sont poussées dans l'array défini au début
				distance_transfert.push(transfert);
			}
		}
	}
	//On écrit le fichier en JSON
	fs.writeFileSync("distance_transfert.json", JSON.stringify(distance_transfert), function (err) {
	if (err) throw err;
	});
	console.log('Fichier créé avec succès');
};

function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
};

function deg2rad(deg) {
  return deg * (Math.PI/180)
};

// Télécharger le fichier GTFS en JSON afin de l'utiliser avec les fonctions précédentes
let stopsTable = loadJSON('C:/Users/Anne-Julie/Documents/Code/CalculateurTC_HIV18/stops.json');
	console.log('Téléchargement du fichier "stops"');
	transferts = calculDistance ();
