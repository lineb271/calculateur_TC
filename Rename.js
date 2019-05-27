var fs = require('fs');

fs.rename('C:/Users/Moham/Desktop/routes.txt', 'C:/Users/Moham/Desktop/routes.json', function (err) {
if (err) {console.log(err); return; }

console.log('The file has been re-named to: ' + newFilePath);
});

fs.rename('C:/Users/Moham/Desktop/stop_times.txt', 'C:/Users/Moham/Desktop/stop_times.json', function (err) {
if (err) {console.log(err); return; }

console.log('The file has been re-named to: ' + newFilePath);
});

fs.rename('C:/Users/Moham/Desktop/stops.txt', 'C:/Users/Moham/Desktop/stops.json', function (err) {
if (err) {console.log(err); return; }

console.log('The file has been re-named to: ' + newFilePath);
});

fs.rename('C:/Users/Moham/Desktop/trips.txt', 'C:/Users/Moham/Desktop/trips.json', function (err) {
if (err) {console.log(err); return; }

console.log('The file has been re-named to: ' + newFilePath);
});
