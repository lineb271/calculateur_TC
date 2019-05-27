var fs = require('fs');

let OD = [{
  "orig_lat" : "45.625197",
  "orig_lon" : "-1.014489",
  "dest_lat" : "45.620243",
  "dest_lon" : "-1.035518"
}];

fs.writeFileSync("./imported_files/OD.json", JSON.stringify(OD), function (err) {
	if (err) throw err;
	console.log('Fichier créé avec succès');
});
