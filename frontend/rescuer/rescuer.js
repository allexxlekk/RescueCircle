const rescuerId = 4; // Get from logged in rescuer

let mymap = L.map("mapid").setView([38.242, 21.727], 17);

const baseIcon = L.divIcon({
    html: '<i class="material-icons" style="color: red; font-size: 52px;">location_on</i>',
    className: 'custom-div-icon', // Add any additional classes here
    iconSize: [32, 32], // Size of the icon (optional, adjust as needed)
    iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
    popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
});

const rescuerIcon = L.divIcon({
    html: '<i class="material-icons" style="color: blue; font-size: 52px;">person_pin_circle</i>',
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

document.addEventListener('DOMContentLoaded', async () => {
    let baseLocation = await getBaseLocation();
    baseLocation = baseLocation[0];

    let items = await fetchItems();

    showItems(items);

    let role = "CITIZEN";
    let rescuer = 'RESCUER';



    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(mymap);

    L.marker([baseLocation.latitude, baseLocation.longitude], { icon: baseIcon }).addTo(mymap)

        .openPopup();



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

    let rescuerMarkers = await fetchMarkers(rescuer);
    showRescuerMarkers(mymap, rescuerMarkers);

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

async function fetchInventory(rescuerId) {
    try {
        const response = await fetch('http://localhost:3000/rescuers/inventory?id=' + rescuerId);

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

    try {
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
        await updateInventoryDisplay(rescuerId);
    } catch (error) {
        console.error('Error loading inventory:', error);
    }
};

//updateInventoryDisplay after clicking load item button 
async function updateInventoryDisplay(rescuerId) {
    try {
        const inventoryItems = await fetchInventory(rescuerId);
        const inventoryListElement = document.getElementById('inventory-list');
        inventoryListElement.innerHTML = ''; // Clear existing items

        inventoryItems.forEach(item => {
            let itemElement = createInventoryItemElement(item);
            inventoryListElement.appendChild(itemElement);
        });
    } catch (error) {
        console.error('Error updating inventory display:', error);
    }
}

function createInventoryItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = "inventory-item";
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

    let itemAmountElement = document.createElement("span");
    itemAmountElement.className = "amount";
    itemAmountElement.textContent = `${item.amount}`;
    const itemAmountDiv = document.createElement("div");
    itemAmountDiv.textContent = "Amount: ";
    itemAmountDiv.appendChild(itemAmountElement);

    itemElement.appendChild(itemNameDiv);
    itemElement.appendChild(itemCategoryDiv);
    itemElement.appendChild(itemAmountDiv);

    return itemElement;
}


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
            await updateInventoryDisplay(rescuerId);
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

// window.acceptRequest = function (requestId) {

//     console.log("Accepting request:", requestId);
//     console.log("Rescuer ID:", rescuerId);
// };





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
function showUserMarkers(map, citizens) {
    citizens.forEach(function (citizen) {
        let marker = L.marker([citizen.latitude, citizen.longitude]).addTo(map);
        marker.userId = citizen.id;

        marker.on('click', async () => {
            try {
                const requests = await fetchRequests(marker.userId);
                if (requests && requests.length > 0) {
                    let popupContent = `<div style="max-height: 160px; width:130%;overflow: auto;">
                                            <h3>User: ${requests[0].fullName}</h3>`;
                    requests.forEach((request, index) => {
                        if (request.status !== "COMPLETED") {
                            popupContent += `<div style="margin-top: 10px;">
                                                <p>Item: <strong>${request.item.name}</strong></p>
                                                <p>Status: <strong>${request.status}</strong></p>
                                                <p>Quantity: <strong>${request.quantity}</strong></p>
                                                <p>Date: <strong>${request.createdAt}</strong></p>
                                                <button class="accept-btn" data-rescuer-id="${request.rescuerId}" data-request-id="${request.requestId}">Accept Request</button>
                                            </div>`;
                        }
                    });
                    popupContent += '</div>';

                    marker.bindPopup(popupContent).on('popupopen', function () {
                        document.querySelectorAll('.accept-btn').forEach(button => {
                            button.addEventListener('click', function () {
                                // const rescuerId = button.getAttribute('data-rescuer-id');
                                const rescuerId = 4;
                                const requestId = button.getAttribute('data-request-id');
                                console.log(rescuerId);  // Debug line to check rescuerId
                                acceptRequest(rescuerId, requestId);
                            });
                        });
                    }).openPopup();
                } else {
                    let fallbackContent = `<div><p>No active requests for this user found.</p></div>`;
                    marker.bindPopup(fallbackContent).openPopup();
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
                let errorContent = `<div>
                    <h3>Citizen: ${citizen.fullName}</h3>
                    <p>Location: ${citizen.latitude}, ${citizen.longitude}</p>
                    <p>User ID: ${citizen.id}</p>
                    <p>Error fetching requests.</p>
                </div>`;
                marker.bindPopup(errorContent).openPopup();
            }
        });
    });
}

//TODO: BACKEND CReate FetchRESCUERS 
function showRescuerMarkers(map, rescuers) {
    rescuers.forEach(function (rescuer) {
        let marker = L.marker([rescuer.latitude, rescuer.longitude], { icon: rescuerIcon }).addTo(map);
        marker.rescuerId = rescuer.id;

        marker.bindPopup(`<div>
            <h3>Rescuer: ${rescuer.fullName}</h3>
            <p>Location: ${rescuer.latitude}, ${rescuer.longitude}</p>
        </div>`);
    });
}



window.acceptRequest = async function (rescuerId, requestId) {
    if (!rescuerId || !requestId) {
        console.error("Missing rescuerId or requestId");
        return false;
    }
    try {
        const url = `http://localhost:3000/rescuers/accept-request?rescuer=${encodeURIComponent(rescuerId)}&request=${encodeURIComponent(requestId)}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);  // Display a message to the user
            console.log(result.message);
            return result.message;
        } else {
            throw new Error(result.message || 'Failed to accept the request');
        }
    } catch (error) {
        console.error("Error while accepting the request:", error);
        alert("Failed to accept request due to an error.");  // Notify the user
        return false;
    }
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


