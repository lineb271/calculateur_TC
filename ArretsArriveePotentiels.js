var fs = require('fs');
const toolkit = require("./Toolkit/toolkit.js");

var runaap = function  runaap(){

const rayonMax = 1.0; //km, 20 minutes marche environ


//Get distance between two stops from coordinates
 function getDistanceBetweenStops(stopid1, stopid2){
	 const latLongStop1 = toolkit.getLatLong(stopid1);
	 const latLongStop2 = toolkit.getLatLong(stopid2);
	 const distanceBetweenStops = toolkit.getDistanceFromLatLonInKm(latLongStop1[0], latLongStop1[1], latLongStop2[0], latLongStop2[1]);
	 return Math.round(distanceBetweenStops*100)/100;
}

//Importation des informations de l'usager
OD = toolkit.loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/OD.json");
let orig_lat = OD.origine.lat;
let orig_lon = OD.origine.lon;
let dest_lat = OD.destination.lat;
let dest_lon = OD.destination.lon;

//Importation du fichier stopsGTFS.json
var stopsGTFS = [];
stopsGTFS = toolkit.loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json");

//Initialisation de la table d'arrêts d'arrivée potentiels
let arretsArriveePotentiels = []; //longueur indéfinie
let distance;
for (let i = 0; i < stopsGTFS.length; i++){
  distance = toolkit.getDistanceFromLatLonInKm(dest_lat, dest_lon, Number(stopsGTFS[i].stop_lat),Number(stopsGTFS[i].stop_lon));
  if (distance < rayonMax){
    const arretValide = {};
    arretValide.dest_id = -200;
    arretValide.dest_lat = parseFloat(dest_lat);
    arretValide.dest_lon = parseFloat(dest_lon);
    arretValide.stop_id = parseInt(stopsGTFS[i].stop_id);
    arretValide.stop_lat = parseFloat(stopsGTFS[i].stop_lat);
    arretValide.stop_lon = parseFloat(stopsGTFS[i].stop_lon);
    arretValide.temps_marche = (getDistanceBetweenStops(parseInt(arretValide.dest_id), parseInt(arretValide.stop_id))/3.6)*3600;
    arretValide.heure_arrivee = null; //calculé seulement après la boucle CSA, afin de déterminer quel arrêt de destination choisir (avec Stops[])
    arretsArriveePotentiels.push(arretValide);
  }
}

//Écriture en JSON
fs.writeFileSync("./imported_files/arretsArriveePotentiels.json", JSON.stringify(arretsArriveePotentiels), function (err) {
if (err) throw err;
	console.log('Fichier créé avec succès');
});

};

module.exports.runaap = runaap;
