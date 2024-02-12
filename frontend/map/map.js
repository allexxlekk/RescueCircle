let mymap = L.map("mapid").setView([38.242, 21.727], 12);
let theMarker = null;
document.addEventListener("DOMContentLoaded", () => {


  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(mymap);
  mymap.on('click', onMapClick);

});


function onMapClick(e) {

  if (theMarker != null) {
    theMarker.setLatLng(e.latlng);
  } else {
    theMarker = L.marker(e.latlng, { draggable: true }).addTo(mymap);
    theMarker.on('dragend', function (event) {
      var marker = event.target;
      var position = marker.getLatLng();
      console.log("Marker new position: ", position);
    });


  }
};

let center = [38.242, 21.727];
const radius = 5000;
const circle = L.circle(center, {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.5,
  radius: radius
}).addTo(mymap);
