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

let stops = [];
stops = loadJSON("/Users/Lionel/Documents/Cours Polytechnique Montréal/Winter 2018/CIV 6707A - Technologie transports et innovations /interface/stops.json");

const stopsMap = new Map();
for (let i = 0, count = stops.length; i < count; i++){
  const stop = stops[i];
  //stop.footpaths = footpathsTransfertById.get(stop.stop_id);
  stopsMap.set(parseInt(stop.stop_id),stop);
}

function getLatLong(stopid){
  var a = stopsMap.get(stopid).stop_lat;
  var b = stopsMap.get(stopid).stop_lon;
  var test = [parseFloat(a),parseFloat(b)];
  return test;
}
getLatLong(242);


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
}
function deg2rad(deg) {
  return deg * (Math.PI/180)
}



 function getDistanceBetweenStops(stopid1,stopid2){
    var latLong1 = getLatLong(stopid1);
    var latLong2 = getLatLong(stopid2);

    var distanceBetweenStops=getDistanceFromLatLonInKm(latLong1[0],latLong1[1],latLong2[0],latLong2[1]);
    console.log("la distance entre les stops est de " + Math.round(distanceBetweenStops*100)/100  + "km");
}

getDistanceBetweenStops(383,390);
