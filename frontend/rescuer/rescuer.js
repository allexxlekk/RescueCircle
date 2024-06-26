const rescuerId = 9; // Get from logged in rescuer

let mymap = L.map("mapid").setView([38.242, 21.727], 12);

document.addEventListener('DOMContentLoaded', async () => {

    let items = await fetchItems();

    showItems(items);

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


//// Load Inventory code////
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}
const loadInventory = async (itemId, amount, rescuerId) => {

    const inventory = {
        itemId: itemId,
        amount: amount,
        rescuerId: rescuerId,

    };

    const postResponse = await fetch('http://localhost:3000/rescuers/load', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventory),
    });

    const response = await postResponse.json();
    console.log(response);
    alert('Item Loaded Successfully');
};

//Check if is correct
const unloadInventory = async (rescuerId) => {
    try {
        const response = await fetch('http://localhost:3000/rescuers/unload/' + rescuerId);

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}



function showItems(items) {
    const itemListElement = document.getElementById('item-list');
    itemListElement.innerHTML = '';

    items.forEach(item => {
        // Create the list item
        let itemElement = createItemElement(item);
        // Add it to the list
        itemListElement.appendChild(itemElement);
        itemListElement.appendChild(document.createElement("br"));

    });

}

function createItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = "item";
    itemElement.id = item.id;

    let itemNameElement = document.createElement("span");
    itemNameElement.className = "name";
    itemNameElement.textContent = `${item.name}`;
    const itemNameDiv = document.createElement("div");
    itemNameDiv.textContent = "Name: ";
    itemNameDiv.appendChild(itemNameElement);

    let itemCategoryElement = document.createElement("span");
    itemCategoryElement.className = "category";
    itemCategoryElement.textContent = `${item.category_name}`;
    const itemCategoryDiv = document.createElement("div");
    itemCategoryDiv.textContent = "Category: ";
    itemCategoryDiv.appendChild(itemCategoryElement);

    let itemQuantity = document.createElement("span");
    itemQuantity.className = "quantity";
    itemQuantity.textContent = `${item.quantity}`;
    const itemQuantityDiv = document.createElement("div");
    itemQuantityDiv.textContent = "Quantity: ";
    itemQuantityDiv.appendChild(itemQuantity);

    itemElement.appendChild(itemNameDiv);
    itemElement.appendChild(itemCategoryDiv);
    itemElement.appendChild(itemQuantityDiv);


    if (item.quantity > 0) {
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = 1;
        quantityInput.max = item.quantity;
        quantityInput.value = 1; // Set default value to 1
        quantityInput.className = "quantity-input";
        itemElement.appendChild(quantityInput);

        let loadButton = document.createElement("button");
        loadButton.className = "load";
        loadButton.textContent = `Load`;
        loadButton.onclick = async function () {
            await loadInventory(item.id, quantityInput.value, rescuerId);
            let items = await fetchItems();
            showItems(items);
        };
        itemElement.appendChild(loadButton);
    }



    return itemElement;
}


///////////Map code//////
//API CALLS////
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



//HELPER FUNCTIONS////////////////////////////////

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


