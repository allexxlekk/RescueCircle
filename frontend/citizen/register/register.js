import apiUtils from "../../utils/apiUtils.mjs";

let mymap = L.map("map").setView([51.505, -0.09], 13);
let theMarker = null;

document.addEventListener("DOMContentLoaded", async () => {
  let baseLocation = await apiUtils.getBaseLocation();
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


const registerUser = async () => {

  if (await validateDetails()) {
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
    await apiUtils.register(registerObject);

    //TODO show alert and go to the login page
    alert("Register Completed Successfully");

    window.location.href = '/login';
  }
};

const validateDetails = async () => {
  let isValid = true;
  // Clear previous errors
  document.querySelectorAll('.validation-error-message').forEach(function (el) {
    el.textContent = '';
  });

  // Username validation
  const username = document.getElementById("username").value;
  if (!username || username === "") {
    document.getElementById("val-error-username").innerHTML = "Username is required"
    isValid = false;
  } else if (!await apiUtils.usernameAvailable(username)) {
    document.getElementById("val-error-username").innerHTML = "Username is not available"
    isValid = false;
  }

  // Full Name validation
  const fullName = document.getElementById("fullname").value;
  if (!fullName || fullName === "") {
    document.getElementById("val-error-fullname").innerHTML = "Full Name is required"
    isValid = false;
  }

  // Email Validation
  const email = document.getElementById("email").value;
  let emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || email === "") {
    document.getElementById("val-error-email").innerHTML = "Email is required"
    isValid = false;
  }
  else if (!emailPattern.test(email)) {
    document.getElementById('val-error-email').textContent = 'Please enter a valid email address.';
    isValid = false;
  }
  else if (!await apiUtils.emailAvailable(email)) {
    document.getElementById("val-error-email").innerHTML = "Email is not available"
    isValid = false;
  }

  // Password Validation
  const password = document.getElementById("password").value;
  let passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/;
  if (!password || password === "") {
    document.getElementById("val-error-password").innerHTML = "Password is required"
    isValid = false;
  }
  else if (!passwordPattern.test(password)) {
    document.getElementById('val-error-password').textContent = 'Password must contain at least one uppercase letter, one number, and one special character, and be at least 8 characters long.';
    isValid = false;
  }

  // Phone Validation
  const phone = document.getElementById("phone").value;
  let phonePattern = /^\d{10}$/;
  if (!phone || phone === "") {
    document.getElementById("val-error-phone").innerHTML = "Phone is required"
    isValid = false;
  }
  else if (!phonePattern.test(phone)) {
    document.getElementById('val-error-phone').textContent = 'Phone must be 10 digits';
    isValid = false;
  }

  // Marker validation
  if (!theMarker) {
    document.getElementById("val-error-map").innerHTML = "Choose your location on the map"
  }

  return isValid;
}
