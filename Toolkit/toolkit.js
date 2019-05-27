//Importing files & libraries
let fs = require('fs');
const os = require('os');

//Convert degrees to radius
function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const stopsGenerated = JSON.parse(fs.readFileSync('C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/generated_files/stopsGenerated.json'));
//Création d'une map nécessaire à la fonction getLatLong
const stopsMap = new Map();
for (let i = 0, count = stopsGenerated.length; i < count; i++){
  const stop = stopsGenerated[i];
  stopsMap.set(parseInt(stop.stop_id),stop);
}

module.exports = {
//reading JSON file
  loadJSON : function(filename, encoding) {
    return JSON.parse(fs.readFileSync(filename, encoding));
},

//Convert timestamp to seconds
convertHMStoSeconds : function(hms){
  const splittedhms = hms.split(':'); // split it at the :
    if(splittedhms.length == 2) {
    splittedhms.push(0)
    }
    return (splittedhms[0]) * 60 * 60 + (splittedhms[1]) * 60 + (splittedhms[2]);
},

  /*compareFourthColumn : function (a, b) {
      if (a["arrival_time"] === b["arrival_time"]) {
          return 0;
      }
      else {
          return (a["arrival_time"] < b["arrival_time"]) ? -1 : 1;
      }
  }, Mettre in line dans le fichier correspondant */

  //Convert degrees to radius
deg2rad : function(deg) {
  return deg * (Math.PI/180)
},

//Get distance from coordinates
getDistanceFromLatLonInKm : function (lat1,lon1,lat2,lon2) {
  const R = 6371; // Rayon de la terre en degrés
  const dLat = deg2rad(lat2-lat1);  // Fonction deg2grad ci-dessous
  const dLon = deg2rad(lon2-lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c; // Distance en km
  return d;
},

//Obtention des coordonnées des stopid fournis à partir d'une map
 getLatLong : function(stopid){
  const lat = stopsMap.get(stopid).stop_lat;
  const lon = stopsMap.get(stopid).stop_lon;
  const coord = [parseFloat(lat),parseFloat(lon)];
  return coord;
},

//Fonction permettant de séparer un string selon un séparateur
splitString : function(stringToSplit, separator) {
  var arrayOfStrings = stringToSplit.split(separator);
  return arrayOfStrings;
},

//let stopID = 0;
//Obtain stop noame from stop id
giveStopName : function(stopID){
for (let i = 0; i < stops.length; i++){
  if (Number(stops[i].stop_id) == stopID){
  return (stops[i].stop_name);
    }
  }
}

};
