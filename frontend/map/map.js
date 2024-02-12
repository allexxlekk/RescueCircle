var mymap = L.map("mapid").setView([38.242, 21.727], 12);
var theMarker = null;
document.addEventListener("DOMContentLoaded", () => {


  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(mymap);
  mymap.on('click', onMapClick);

});


function onMapClick(e) {
  // Check if the marker already exists
  if (theMarker != null) {
    // Move the existing marker to the new location
    theMarker.setLatLng(e.latlng);
  } else {
    // Create a new draggable marker at the clicked position
    theMarker = L.marker(e.latlng, { draggable: true }).addTo(mymap);

    // Event listener for the marker to log new position after drag ends
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
