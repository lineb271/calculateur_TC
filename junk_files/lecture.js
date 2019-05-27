var fs = require('fs');
var stoptimes = [];

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
} // loadJSONfile

stoptimes = loadJSON("C:\\Users\\Anne-Julie\\Documents\\Code\\CalculateurTC_HIV18\\stop_times.json");

console.log (stoptimes[0]);
