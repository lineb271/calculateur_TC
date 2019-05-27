L.mapbox.accessToken = 'pk.eyJ1IjoiZm1hcnRpbmV6YyIsImEiOiJjamUwMnp2MjUxb3B3MnlxcDhvYjFvaHlwIn0.BlU6OZTxUQ2mGEcnt0TWbg';
var map = L.mapbox.map('map', 'mapbox.streets')
  .setView([45.624, -1.024], 15);
var coordinates = document.getElementById('coordinates');

//rouge
var origin = L.marker([45.627588, -1.041257], {
  icon: L.mapbox.marker.icon({
    'marker-size': 'large',
    'marker-symbol': 'o',
    'marker-color': '#f86767'
  }),
  draggable: true
}).addTo(map);

// bleu
var destination = L.marker([45.627588, -1.031260], {
  icon: L.mapbox.marker.icon({
    'marker-size': 'large',
    'marker-symbol': 'd',
    'marker-color': '#3887be'
  }),
  draggable: true
}).addTo(map);

// origin.on('dragend', ondragend);
// destination.on('dragend', ondragend);
// ondragend();

var originlatitude = origin._latlng.lat;
var originlongitude = origin._latlng.lng;
var destlatitude = destination._latlng.lat;
var destlongitude = destination._latlng.lng;




  // originlatitude=document.getElementById("originlatitude");
  // originlongitude=document.getElementById("originlatitude");
  // destlatitude=document.getElementById("originlatitude");
  // destlatitude=document.getElementById("originlatitude");

  //return (originlatitude);

// console.log(originlatitude);
//carte();
