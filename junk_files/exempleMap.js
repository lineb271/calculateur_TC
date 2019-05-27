const fs = require('fs');

/*
var myMap = new Map();

var keyString = 'a string',
    keyObj = {},
    keyFunc = function() {};

// setting the values
myMap.set(keyString, "value associated with 'a string'");
myMap.set(keyObj, 'value associated with keyObj');
myMap.set(keyFunc, 'value associated with keyFunc');

myMap.size; // 3

// getting the values
myMap.get(keyString);    // "value associated with 'a string'"
myMap.get(keyObj);       // "value associated with keyObj"
myMap.get(keyFunc);      // "value associated with keyFunc"

myMap.get('a string');   // "value associated with 'a string'"
                         // because keyString === 'a string'
myMap.get({});           // undefined, because keyObj !== {}
myMap.get(function() {}) // undefined, because keyFunc !== function () {}
*/

//ESSAI avec table Stops[]

function loadJSON(filename, encoding) {
  try {
    if (typeof (encoding) == 'undefined') encoding = 'utf8';
    var contents = fs.readFileSync(filename, encoding);
    return JSON.parse(contents);
  } catch (err) {
    throw err;
  }
}
let Stops = [];
Stops = loadJSON("C:/Users/Charles/Documents/Polytechnique/Hiver2018/CIV6707A/PROJET/CodeAlgo/Stops.json");


let StopsMap = new Map();

let keyObj = 0;
let heureArr = 0;

for (let i = 0; i < Stops.length; i++){
  keyObj = Stops[i].stop_id;
  heureArr = Stops[i].heure_arrivee;
  StopsMap.set(keyObj,heureArr);
}

let heureTest = StopsMap.get(383);
console.log(heureTest);
