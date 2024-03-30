let mymap = L.map("mapid").setView([51.505, -0.09], 13);
let theMarker = null;

document.addEventListener("DOMContentLoaded", async () => {
  let baseLocation = await getBaseLocation();
  baseLocation = baseLocation[0];

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(mymap);

  mymap.setView([baseLocation.latitude, baseLocation.longitude], 12);
  let center = [baseLocation.latitude, baseLocation.longitude];
  const radius = 5000;
  const circle = L.circle(center, {
    color: "red",
    fillColor: "#f03",
    fillOpacity: 0.1,
    radius: radius,
  }).addTo(mymap);

  circle.on("click", onMapClick);

  const registerButton = document.getElementById("register-button");
  registerButton.addEventListener('click', registerUser);

});

function onMapClick(e) {
  // Check if the marker already exists
  if (theMarker != null) {
    // Move the existing marker to the new location
    theMarker.setLatLng(e.latlng);
  } else {
    // Create a new draggable marker at the clicked position
    theMarker = L.marker(e.latlng, { draggable: false }).addTo(mymap);
  }
  var position = theMarker.getLatLng();
  console.log("Marker new position: ", position);
}

//API CALLS

async function postRegister(registerUser) {
  const postRegister = await fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerUser),
  });
}

//

const registerUser = async () => {
  let position = theMarker.getLatLng();


  const registerObject = {
    username: document.getElementById("username").value,
    fullname: document.getElementById("fullname").value,
    role: 'CITIZEN',
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone: document.getElementById("phone").value,
    longitude: position.lng,
    latitude: position.lat,
  };

  try {
    await postRegister(registerObject);
    alert("Register Confirmed");
    // Redirect to the login page after successful registration
    // window.location.href = '../login.html'; // Adjust '/login' to the path of your login page if different
  } catch (error) {
    // Handle or log the error
    console.error("Registration failed", error);
    alert("Registration failed. Please try again.");
  }
};


async function getBaseLocation() {
  try {
    const response = await fetch("http://localhost:3000/baseLocation");

    return await response.json(); // Return the data
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}
