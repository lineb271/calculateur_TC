//Code avec npm module csvtojson
const fs = require('fs');
const os = require('os');

var runcsv2json = function  runcsv2json(){

var Converter = require('csvtojson').Converter;
var converter1 = new Converter({});
var converter2 = new Converter({});
var converter3 = new Converter({});

// Repérer le fichier
converter1.fromFile("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/GTFS/trips.txt",function(err,result){
    // s'il y a une erreur
    if(err){
        console.log("An Error Has Occured!");
        console.log(err);
    } else {
      //variable json qui donne le résultats
      var data = result;
      //Envoyer le résultat
      //console.log(data);
      return fs.writeFileSync("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/trips.json", JSON.stringify(data));
    }
});

converter2.fromFile("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/GTFS/stops.txt",function(err,result){
    // s'il y a une erreur
    if(err){
        console.log("An Error Has Occured!");
        console.log(err);
    } else {
      //variable json qui donne le résultats
      var data = result;
      //Envoyer le résultat
      //console.log(data);
      return fs.writeFileSync("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stopsGTFS.json", JSON.stringify(data));
    }
});

converter3.fromFile("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/GTFS/stop_times.txt",function(err,result){
    // s'il y a une erreur
    if(err){
        console.log("An Error Has Occured!");
        console.log(err);
    } else {
      //variable json qui donne le résultats
      var data = result;
      //Envoyer le résultat
      //console.log(data);
      return fs.writeFileSync("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/Git/CalculateurTC_HIV18/imported_files/stop_times.json", JSON.stringify(data));
    }
});

};

module.exports.runcsv2json = runcsv2json;
