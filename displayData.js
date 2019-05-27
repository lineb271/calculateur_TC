let fs = require('fs');
const toolkit = require("./Toolkit/toolkit.js");

let timetable = toolkit.loadJSON('./imported_files/Timetables.json');
let displayData = [];
for (let i = 0, count = timetable.length; i < count; i++){
    if (timetable[i].route_id == 34){
    const trip = {
    Ligne: timetable[i].trip_headsign,
    Arrêt: timetable[i].stop_name
    };
    displayData.push(trip);
    } else {
    i++;
  }
};
console.log(displayData);
