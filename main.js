const fs = require('fs');

//Conversion des fichiers GTFS en JSON
var csv2json = require("./csv2json.js");
csv2json.runcsv2json();

//Création de la table connections.JSON
var cnn = require("./Connections.js");
cnn.runcnn();

//Importation de OD et création de journeys.json et stopsGenerated.json
var data = require("./stopsGenerated.js");
data.rundata();

//Initialisation de la table ArrêtsArrivéePotentiels
var aap = require("./arretsArriveePotentiels.js");
aap.runaap();

//Initialisation de la table ArrêtsDépartPotentiels
var adp = require("./arretsDepartPotentiels.js");
adp.runadp();

//Initialisation de la table Footpaths
var ftp = require('./footpaths.js');
ftp.runftp();

//Scan CSA et remplissage des Maps
var app = require ("./app.js");
app.runapp();

//Reconstruction du trajet
var rt = require("./ReconstructionTrajet.js");
rt.runrt();
