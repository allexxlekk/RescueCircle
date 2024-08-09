import apiUtils from "../../utils/apiUtils.mjs";
const logoutButton = document.getElementById("logoutButton");

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
        .bindPopup("BASE LOCATION")
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
    showOffers(await fetchCitizenOffers());

    let rescuerMarkers = await fetchMarkers(rescuer);
    showRescuerMarkers(mymap, rescuerMarkers);

    await displayActiveTasks(4);
    logoutButton.addEventListener("click", async () => {
        await apiUtils.logout();
    });
});

async function fetchItems() {
    return [
        { id: 1, name: 'Water Bottle', category_name: 'Essentials', quantity: 50 },
        { id: 2, name: 'First Aid Kit', category_name: 'Medical', quantity: 30 },
        { id: 3, name: 'Blanket', category_name: 'Essentials', quantity: 20 },
    ];
}

async function fetchInventory(rescuerId) {
    return [
        { id: 1, name: 'Water Bottle', category_name: 'Essentials', amount: 10 },
        { id: 2, name: 'First Aid Kit', category_name: 'Medical', amount: 5 },
    ];
}

const loadInventory = async (itemId, amount, rescuerId) => {
    const inventory = {
        itemId: itemId,
        amount: amount,
        rescuerId: rescuerId,
    };
    // Fake loading success
    console.log('Item Loaded Successfully');
    alert('Item Loaded Successfully');
    await updateInventoryDisplay(rescuerId);
};

async function updateInventoryDisplay(rescuerId) {
    const inventoryItems = await fetchInventory(rescuerId);
    const inventoryListElement = document.getElementById('inventory-list');
    inventoryListElement.innerHTML = ''; // Clear existing items

    inventoryItems.forEach(item => {
        let itemElement = createInventoryItemElement(item);
        inventoryListElement.appendChild(itemElement);
    });
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

async function fetchCitizenRequests() {
    return [
        { id: 1, name: 'John Doe', phone: '123-456-7890', date: '2023-08-01', item: 'Water Bottle', category: 'Essentials', amount: 5, canComplete: true },
        { id: 2, name: 'Jane Smith', phone: '987-654-3210', date: '2023-08-02', item: 'First Aid Kit', category: 'Medical', amount: 2, canComplete: false },
    ];
}

async function fetchCitizenOffers() {
    return [
        { id: 1, name: 'Alice Johnson', phone: '555-123-4567', date: '2023-08-03', item: 'Blanket', category: 'Essentials', amount: 10, canComplete: true },
        { id: 2, name: 'Bob Brown', phone: '555-765-4321', date: '2023-08-04', item: 'Food Pack', category: 'Essentials', amount: 20, canComplete: true },
    ];
}

async function fetchMarkers(role) {
    if (role === "CITIZEN") {
        return [
            { id: 1, latitude: 38.245, longitude: 21.725, fullName: 'John Doe' },
            { id: 2, latitude: 38.240, longitude: 21.728, fullName: 'Jane Smith' },
        ];
    } else {
        return [
            { id: 1, latitude: 38.242, longitude: 21.726, fullName: 'Rescuer 1' },
            { id: 2, latitude: 38.243, longitude: 21.727, fullName: 'Rescuer 2' },
        ];
    }
}

const fetchActiveTasks = async (rescuerId) => {
    return 2; // Fake active tasks count
};

const displayActiveTasks = async (rescuerId) => {
    const activeTasks = await fetchActiveTasks(rescuerId);
    console.log('Active Tasks:', activeTasks); // Debug log
    if (activeTasks !== undefined) {
        const activeTasksElement = document.createElement('span');
        activeTasksElement.id = 'active-tasks-count';
        activeTasksElement.textContent = activeTasks;

        const activeTasksContainer = document.getElementById('active-tasks');
        activeTasksContainer.innerHTML = ''; // Clear any existing content
        activeTasksContainer.appendChild(document.createTextNode('Tasks assigned: '));
        activeTasksContainer.appendChild(activeTasksElement);
    } else {
        console.error('Active tasks is undefined');
    }
};

function showItems(items) {
    const itemListElement = document.getElementById('item-list');
    itemListElement.innerHTML = '';

    items.forEach(item => {
        let itemElement = createItemElement(item);
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

function showRequests(requests) {
    const requestListContainer = document.getElementById('request-list');
    const requestListElement = requestListContainer.querySelector('ul');

    let titleDiv = requestListContainer.querySelector('.request-list-title');
    if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'request-list-title';
        requestListContainer.insertBefore(titleDiv, requestListElement);

        titleDiv.addEventListener('click', () => {
            if (requestListElement.style.display === 'none' || requestListElement.style.display === '') {
                requestListElement.style.display = 'block';
            } else {
                requestListElement.style.display = 'none';
            }
        });
    }

    titleDiv.textContent = `Requests (${requests.length})`;

    requestListElement.innerHTML = ''; // Clear existing items

    requests.forEach(request => {
        let requestCardElement = createRequestCardElement(request);
        requestListElement.appendChild(requestCardElement);
    });
}

function showOffers(offers) {
    const offerListContainer = document.getElementById('offer-list');
    const offerListElement = offerListContainer.querySelector('ul');

    let titleDiv = offerListContainer.querySelector('.offer-list-title');
    if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'offer-list-title';
        offerListContainer.insertBefore(titleDiv, offerListElement);

        titleDiv.addEventListener('click', () => {
            if (offerListElement.style.display === 'none' || offerListElement.style.display === '') {
                offerListElement.style.display = 'block';
            } else {
                offerListElement.style.display = 'none';
            }
        });
    }

    titleDiv.textContent = `Offers (${offers.length})`;

    offerListElement.innerHTML = ''; // Clear existing items

    offers.forEach(offer => {
        let offerCardElement = createOfferCardElement(offer);
        offerListElement.appendChild(offerCardElement);
    });
}

function createRequestCardElement(request) {
    const li = document.createElement('li');
    li.className = `request-card ${request.canComplete ? 'complete' : 'incomplete'}`; // Add status-based class for styling

    const nameDiv = document.createElement('div');
    nameDiv.className = "item";
    nameDiv.textContent = request.name;

    const itemDiv = document.createElement('div');
    itemDiv.className = "item";
    itemDiv.textContent = request.item;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = "details";

    const statusDiv = document.createElement('div');
    statusDiv.className = "status";
    statusDiv.textContent = `Can Complete: ${request.canComplete}`;

    const amountDiv = document.createElement('div');
    amountDiv.className = "amount";
    amountDiv.textContent = `Amount: ${request.amount}`;

    const dateDiv = document.createElement('div');
    dateDiv.className = "date";
    dateDiv.textContent = `Date: ${request.date}`;

    detailsDiv.appendChild(nameDiv);
    detailsDiv.appendChild(statusDiv);
    detailsDiv.appendChild(amountDiv);
    detailsDiv.appendChild(dateDiv);

    li.appendChild(itemDiv);
    li.appendChild(detailsDiv);

    li.addEventListener('mouseover', function () {
        const markerId = request.id;
        mymap.eachLayer(function (layer) {
            if (layer instanceof L.Marker && layer.userId == markerId) {
                layer._icon.classList.add('selected-marker');
            }
        });
    });

    li.addEventListener('mouseout', function () {
        const markerId = request.id;
        mymap.eachLayer(function (layer) {
            if (layer instanceof L.Marker && layer.userId == markerId) {
                layer._icon.classList.remove('selected-marker');
            }
        });
    });

    return li;
}

function createOfferCardElement(offer) {
    const li = document.createElement('li');
    li.className = `offer-card ${offer.canComplete ? 'complete' : 'incomplete'}`; // Add status-based class for styling

    const nameDiv = document.createElement('div');
    nameDiv.className = "item";
    nameDiv.textContent = offer.name;

    const itemDiv = document.createElement('div');
    itemDiv.className = "item";
    itemDiv.textContent = offer.item;

    const detailsDiv = document.createElement('div');
    detailsDiv.className = "details";

    const statusDiv = document.createElement('div');
    statusDiv.className = "status";
    statusDiv.textContent = `Can Complete: ${offer.canComplete}`;

    const amountDiv = document.createElement('div');
    amountDiv.className = "amount";
    amountDiv.textContent = `Amount: ${offer.amount}`;

    const dateDiv = document.createElement('div');
    dateDiv.className = "date";
    dateDiv.textContent = `Date: ${offer.date}`;

    detailsDiv.appendChild(nameDiv);
    detailsDiv.appendChild(statusDiv);
    detailsDiv.appendChild(amountDiv);
    detailsDiv.appendChild(dateDiv);

    li.appendChild(itemDiv);
    li.appendChild(detailsDiv);

    li.addEventListener('mouseover', function () {
        const markerId = offer.id;
        mymap.eachLayer(function (layer) {
            if (layer instanceof L.Marker && layer.userId == markerId) {
                layer._icon.classList.add('selected-marker');
            }
        });
    });

    li.addEventListener('mouseout', function () {
        const markerId = offer.id;
        mymap.eachLayer(function (layer) {
            if (layer instanceof L.Marker && layer.userId == markerId) {
                layer._icon.classList.remove('selected-marker');
            }
        });
    });

    return li;
}

async function getBaseLocation() {
    return [{ latitude: 38.242, longitude: 21.727 }];
}

function showUserMarkers(map, citizens) {
    citizens.forEach(function (citizen) {
        let marker = L.marker([citizen.latitude, citizen.longitude]).addTo(map);
        marker.userId = citizen.id;

        marker.on('click', async () => {
            const requests = await fetchCitizenRequests();
            if (requests && requests.length > 0) {
                let popupContent = `<div style="max-height: 160px; width:130%;overflow: auto;">
                                        <h3>User: ${citizen.fullName}</h3>`;
                requests.forEach((request, index) => {
                    if (request.canComplete) {
                        popupContent += `<div style="margin-top: 10px;">
                                            <p>Item: <strong>${request.item}</strong></p>
                                            <p>Status: <strong>${request.canComplete}</strong></p>
                                            <p>Amount: <strong>${request.amount}</strong></p>
                                            <p>Date: <strong>${request.date}</strong></p>
                                            <button class="accept-btn" data-rescuer-id="${rescuerId}" data-request-id="${request.id}">Accept Request</button>
                                        </div>`;
                    }
                });
                popupContent += '</div>';

                marker.bindPopup(popupContent).on('popupopen', function () {
                    document.querySelectorAll('.accept-btn').forEach(button => {
                        button.addEventListener('click', function () {
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
        });
    });
}

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
