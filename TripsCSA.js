var fs = require('fs');

var trips = [];

function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}
var trips = [];
trips = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/CalculateurTC_HIV18/trips.json");

//console.log(stoptimes.length);

var TripsCSA = []; //longueur indéfinie
//Parcourir l'ensemble de la table "stoptimes" pour remplir timetable
for (let i = 0; i < trips.length; i++) {
  const tripvalide = {};
  tripvalide["trip_id"] = parseInt(trips[i].trip_id);
  tripvalide["is_reached"] = 0;
  tripvalide["enter_connection"] = {};
  TripsCSA.push(tripvalide);
}

fs.writeFileSync("TripsCSA.json", JSON.stringify(TripsCSA), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});
