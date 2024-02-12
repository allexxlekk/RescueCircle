let mymap = L.map("mapid").setView([38.242, 21.727], 12);

document.addEventListener("DOMContentLoaded", async () => {
    let role = "citizen";
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

    let userMarkers = await fetchMarkers(role);
    showUserMarkers(mymap, userMarkers);

    showRequests(await fetchCitizenRequests());
});





async function fetchRequests(citizenId) {
    try {
        const response = await fetch('http://localhost:3000/requests/citizen/' + citizenId);

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function fetchCitizenRequests() {
    try {
        const response = await fetch('http://localhost:3000/requests/citizens');

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function fetchMarkers(role) {
    try {
        const response = await fetch('http://localhost:3000/users/markers/' + role);

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function showRequests(requests) {
    const requestListContainer = document.getElementById('request-list');

    const requestListElement = requestListContainer.querySelector('ul');

    // Check if the title and total number div already exists, if not create it
    let titleDiv = requestListContainer.querySelector('.request-list-title');
    if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'request-list-title';
        requestListContainer.insertBefore(titleDiv, requestListElement);
    }

    // Set the title and total number of requests
    titleDiv.textContent = `Requests (${requests.length})`;

    requestListElement.innerHTML = ''; // Clear existing items

    requests.forEach(request => {
        // Create the request card with details
        let requestCardElement = createRequestCardElement(request);
        // Add it to the list
        requestListElement.appendChild(requestCardElement);
    });
}

function showUserMarkers(map, users) {
    users.forEach(function (user) {
        // Create a marker for each user
        let marker = L.marker([user.latitude, user.longitude])
            .addTo(map)

        // You can also store the user id as a property of the marker
        marker.userId = user.id;

        marker.addEventListener('click', async () => {
            showRequests(await fetchRequests(marker.userId))
        });

    })
}

function createRequestCardElement(request) {
    const li = document.createElement('li');
    li.className = `request-card ${request.status.toLowerCase()}`; // Add status-based class for styling

    const nameDiv = document.createElement('div');
    nameDiv.className = "item";
    nameDiv.textContent = request.fullName;

    const itemDiv = document.createElement('div');
    itemDiv.className = "item";
    itemDiv.textContent = request.item.name;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = "details";

    const statusDiv = document.createElement('div');
    statusDiv.className = "status";
    statusDiv.textContent = `Status: ${request.status}`;

    const numberOfPeopleDiv = document.createElement('div');
    numberOfPeopleDiv.className = "number-of-people";
    numberOfPeopleDiv.textContent = `Number Of People: ${request.numberOfPeople}`;

    const quantityDiv = document.createElement('div');
    quantityDiv.className = "quantity";
    quantityDiv.textContent = `Quantity: ${request.quantity}`;

    const createdAtDiv = document.createElement('div');
    createdAtDiv.className = "created-at";
    createdAtDiv.textContent = `Requested At: ${request.createdAt}`;

    const completedAtDiv = document.createElement('div');
    completedAtDiv.className = "completed-at";
    completedAtDiv.textContent = `Completed at: ${request.completedAt}`;

    // Assemble the details
    detailsDiv.appendChild(nameDiv);
    detailsDiv.appendChild(statusDiv);
    detailsDiv.appendChild(numberOfPeopleDiv);
    detailsDiv.appendChild(quantityDiv);
    detailsDiv.appendChild(createdAtDiv);
    detailsDiv.appendChild(completedAtDiv);


    // Assemble the card
    li.appendChild(itemDiv);
    li.appendChild(detailsDiv);
    li.addEventListener('mouseover', function () {

        const markerId = request.userId;
        // Iterate over each layer (marker) on the map
        mymap.eachLayer(function (layer) {
            // Check if the layer is a marker and has the matching user ID
            if (layer instanceof L.Marker && layer.userId == markerId) {
                // Add a class on mouseover
                layer._icon.classList.add('selected-marker');
            }
        });
    })
    li.addEventListener('mouseout', function () {
        const markerId = request.userId;

        mymap.eachLayer(function (layer) {
            if (layer instanceof L.Marker && layer.userId == markerId) {
                // Remove the class on mouseout
                layer._icon.classList.remove('selected-marker');
            }
        });
    });

    return li;

}


async function getBaseLocation() {
    try {
        const response = await fetch("http://localhost:3000/baseLocation");

        return await response.json(); // Return the data
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}