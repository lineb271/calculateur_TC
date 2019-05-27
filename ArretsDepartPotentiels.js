var fs = require('fs');
const toolkit = require("./Toolkit/toolkit.js");


var runadp = function  runadp(){

const rayonMax = 1.0; //km, 20 minutes marche environ

//Get distance between two stops from coordinates
 function getDistanceBetweenStops(stopid1, stopid2){
	 const latLongStop1 = toolkit.getLatLong(stopid1);
	 const latLongStop2 = toolkit.getLatLong(stopid2);
	 const distanceBetweenStops = toolkit.getDistanceFromLatLonInKm(latLongStop1[0], latLongStop1[1], latLongStop2[0], latLongStop2[1]);
	 return Math.round(distanceBetweenStops*100)/100;
}

//Importation des données de l'usager
const OD = toolkit.loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/OD.json");
let orig_lat = OD.origine.lat;
let orig_lon = OD.origine.lon;
let dest_lat = OD.destination.lat;
let dest_lon = OD.destination.lon;


//Importation du fichier stpsGTFS.json
var stopsGTFS = [];
stopsGTFS = toolkit.loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json");


//Initialisation de la table d'arrêts d'arrivée potentiels
var arretsDepartPotentiels = []; //longueur indéfinie
var distance;
for (let i = 0; i < stopsGTFS.length; i++){
  distance = toolkit.getDistanceFromLatLonInKm(orig_lat, orig_lon, Number(stopsGTFS[i].stop_lat),Number(stopsGTFS[i].stop_lon));
  if (distance < rayonMax){
    const arretValide = {};
    arretValide.orig_id = -100;
    arretValide.orig_lat =  parseFloat(orig_lat);
    arretValide.orig_lon = parseFloat(orig_lon);
    arretValide.stop_id = parseFloat(stopsGTFS[i].stop_id);
    arretValide.stop_lat = parseFloat(stopsGTFS[i].stop_lat);
    arretValide.stop_lon = parseFloat(stopsGTFS[i].stop_lon);
    arretValide.temps_acces = (getDistanceBetweenStops(parseInt(arretValide.orig_id), parseInt(arretValide.stop_id))/3.6)*3600;
    arretsDepartPotentiels.push(arretValide);
  }
}


//Écriture du fichier en JSON
fs.writeFileSync("./imported_files/arretsDepartPotentiels.json", JSON.stringify(arretsDepartPotentiels), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});

};

module.exports.runadp = runadp;
