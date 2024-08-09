import apiUtils from "../utils/apiUtils.mjs";

const masterFilter = document.getElementById('masterFilter');
const assumedRequestsFilter = document.getElementById('filter-assumed-requests');
const pendingRequestsFilter = document.getElementById('filter-pending-requests');
const assumedOffersFilter = document.getElementById('filter-assumed-offers');
const pendingOffersFilter = document.getElementById('filter-pending-offers');
const loadInventoryButton = document.getElementById('load-inventory-button');
const unloadInventoryButton = document.getElementById('unload-inventory-button');

const logoutButton = document.getElementById("logoutButton");

let activeTasks = 0
let taskRequests = []
let taskOffers = []

let myMap;
let nearBase;
let rescuer;
let offers = []
let requests = []

let filterStates = {
    assumedRequests: assumedRequestsFilter.checked,
    pendingRequests: pendingRequestsFilter.checked,
    assumedOffers: assumedOffersFilter.checked,
    pendingOffers: pendingOffersFilter.checked,
};


const requestFilters = [
    assumedRequestsFilter,
    pendingRequestsFilter,
];

const offerFilters = [
    assumedOffersFilter,
    pendingOffersFilter,
];

const uiFilters = [
    assumedRequestsFilter,
    pendingRequestsFilter,
    assumedOffersFilter,
    pendingOffersFilter,
];

document.addEventListener('DOMContentLoaded', async () => {

    rescuer = await fetchRescuer();
    nearBase = await isNearBase();
    updateBaseButtons();
    console.log(rescuer);

    myMap = L.map("map").setView([38.242, 21.727], 17);

    // Add a tile layer (OpenStreetMap in this example)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    try {
        let baseLocation = await getBaseLocation();
        baseLocation = baseLocation[0];
        myMap.setView([baseLocation.latitude, baseLocation.longitude], 13);

        let center = [baseLocation.latitude, baseLocation.longitude];
        const radius = 5000;
        const circle = L.circle(center, {
            color: "red",
            fillColor: "#f03",
            fillOpacity: 0.1,
            radius: radius,
        }).addTo(myMap);

        placeBaseMarker(baseLocation.latitude, baseLocation.longitude)
    } catch (error) {
        console.error("Error setting up map:", error);
    }


    logoutButton.addEventListener("click", async () => {
        await apiUtils.logout()
    });


    await showTasks();

    requests = await fetchRequests(true, true);
    offers = await fetchOffers(true, true);
    applyFilters();

    initializeFilterListeners();

});


async function toggleAllFilters() {
    const isChecked = masterFilter.checked;
    uiFilters.forEach(filter => {
        filter.checked = isChecked;
    });
    updateFilterStates();
    await updateAll();
    applyFilters();
}

// Function to update master filter based on other filters
function updateMasterFilter() {
    masterFilter.checked = uiFilters.every(filter => filter.checked);
}

// Function to initialize event listeners
function initializeFilterListeners() {
    masterFilter.addEventListener('change', toggleAllFilters);

    requestFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            updateMasterFilter();
            updateFilterStates();
            await updateAll();
            applyFilters();
        });
    });

    offerFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            updateMasterFilter();
            updateFilterStates();
            await updateAll();
            applyFilters();
        });
    });


    masterFilter.addEventListener('change', applyFilters);
}


function updateFilterStates() {
    filterStates = {
        assumedRequests: assumedRequestsFilter.checked,
        pendingRequests: pendingRequestsFilter.checked,
        assumedOffers: assumedOffersFilter.checked,
        pendingOffers: pendingOffersFilter.checked,
    };
}

function updateBaseButtons() {
    unloadInventoryButton.disabled = !nearBase;
    loadInventoryButton.disabled = !nearBase
}


async function fetchInventory() {
    try {
        const response = await fetch("http://localhost:3000/rescuer/inventory");

        return await response.json()
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function fetchBaseItems() {
    try {
        const response = await fetch("http://localhost:3000/rescuer/base-items");

        return await response.json()
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function unloadInventory() {
    try {
        await fetch("http://localhost:3000/rescuer/inventory/unload");

        await showTasks();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function loadInventory(itemId, amount) {
    try {

        await fetch("http://localhost:3000/rescuer/inventory/load", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({itemId: itemId, amount: amount})
        });

        await showTasks()

    } catch (error) {
        console.error('Error moving rescuer:', error);
    }
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

async function isNearBase() {
    try {
        const response = await fetch("http://localhost:3000/rescuer/near-base");

        return await response.json(); // Return the data
    } catch (error) {
        console.error("Fetch error:", error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function updateAll() {
    rescuer = await fetchRescuer();
    requests = await fetchRequests(filterStates.pendingRequests, filterStates.assumedRequests);
    offers = await fetchOffers(filterStates.pendingOffers, filterStates.assumedOffers);

}

function applyFilters() {
    placeRescuerMarker()
    placeRequestMarkers()
    placeOfferMarkers()
}


async function fetchTaskRequests() {
    let response = await fetch("http://localhost:3000/rescuer/tasks/requests");
    return await response.json();
}

async function fetchTaskOffers() {
    let response = await fetch("http://localhost:3000/rescuer/tasks/offers");
    return await response.json();
}

async function fetchOffers(pending, assumed) {
    try {
        const response = await fetch("http://localhost:3000/rescuer/offers?pending=" + booleanAsString(pending) + "&assumed=" + booleanAsString(assumed));

        return await response.json();

    } catch (error) {
        console.error('Error fetching rescuers:', error);
        throw error;

    }
}

async function fetchRequests(pending, assumed) {
    try {
        const response = await fetch("http://localhost:3000/rescuer/requests?pending=" + booleanAsString(pending) + "&assumed=" + booleanAsString(assumed));

        return await response.json();

    } catch (error) {
        console.error('Error fetching rescuers:', error);
        throw error;

    }
}

async function fetchRescuer() {
    try {
        const rescuer = await fetch("http://localhost:3000/rescuer/location");

        return await rescuer.json();

    } catch (error) {
        console.error('Error fetching rescuer:', error);
        throw error;

    }
}


async function showTasks() {
    taskRequests = await fetchTaskRequests();
    taskOffers = await fetchTaskOffers();
    generateTaskCards(taskRequests, 'requests');
    generateTaskCards(taskOffers, 'offers');
    // Update the count in the title
    const titleElement = document.querySelector('.container-title');
    titleElement.textContent = `Active Tasks (${taskRequests.length + taskOffers.length})`;
    activeTasks = taskRequests.length + taskOffers.length;
}

function generateTaskCards(tasks, type) {
    const listContainer = document.getElementById(`task-${type}-list`);
    listContainer.innerHTML = ''; // Clear existing content

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'active-task-card';
        li.id = `${type}-${task.id}`;

        li.innerHTML = `
            <p class="active-task-card-name">Name: ${task.name}</p>
            <p class="active-task-card-phone">Phone: ${task.phone}</p>
            <p class="active-task-card-date">Request Date: ${task.date}</p>
            <p class="active-task-card-item">Item: ${task.item} 
                <span class="active-task-card-category">${task.category}</span>
            </p>
            <p class="active-task-card-amount">Amount: ${task.amount}</p>
            <div class="tooltip">
                <button class="active-task-card-complete-button" 
                    ${!task.canComplete ? 'disabled' : ''}>
                    Complete
                </button>
                ${!task.canComplete ? `<span class="tooltiptext">${getTooltipText(task, type)}</span>` : ''}
            </div>
            <button class="active-task-card-cancel-button">Cancel</button>
        `;

        listContainer.appendChild(li);

        // Add event listeners to the buttons
        const completeButton = li.querySelector('.active-task-card-complete-button');
        const cancelButton = li.querySelector('.active-task-card-cancel-button');

        completeButton.addEventListener('click', () => handleComplete(type, task.id));
        cancelButton.addEventListener('click', () => handleCancel(type, task.id));
    });

    // Update the count in the title
    const titleElement = document.querySelector(`#task-${type}-list-container .container-subtitle`);
    titleElement.textContent = `${type[0].toUpperCase() + type.substring(1)} (${tasks.length})`;
}

async function fetchOfferById(id) {
    try {
        const offer = await fetch("http://localhost:3000/admin/overview/offers/" + encodeURI(id));

        return await offer.json();

    } catch (error) {
        console.error('Error fetching offer:', error);
        throw error;

    }
}

async function fetchRequestById(id) {
    try {
        const request = await fetch("http://localhost:3000/admin/overview/requests/" + encodeURI(id));

        return await request.json();

    } catch (error) {
        console.error('Error fetching request:', error);
        throw error;

    }
}


async function handleComplete(type, id) {
    try {
        const endpoint = type === 'requests'
            ? `http://localhost:3000/rescuer/tasks/complete-request/${id}`
            : `http://localhost:3000/rescuer/tasks/complete-offer/${id}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to complete task');
        }

        // Remove the completed task from the list
        document.getElementById(`${type}-${id}`).remove();

        await showTasks();

        await updateAll();

        applyFilters();

    } catch (error) {
        console.error('Error completing task:', error);
        alert('Failed to complete task. Please try again.');
    }
}

window.handleAssume = async function (type, id) {
    try {
        const endpoint = type === 'requests'
            ? `http://localhost:3000/rescuer/tasks/accept-request/${id}`
            : `http://localhost:3000/rescuer/tasks/accept-offer/${id}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to complete task');
        }


        await showTasks();


        await updateAll();
        applyFilters();

    } catch (error) {
        console.error('Error accepting task:', error);
        alert('Failed to accept task. Please try again.');
    }
}

window.changeRescuerLocation = async function (latitude, longitude) {
    try {

        await fetch("http://localhost:3000/rescuer/location", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({latitude: latitude, longitude: longitude})
        });

        await showTasks()

    } catch (error) {
        console.error('Error moving rescuer:', error);
    }
}

async function handleCancel(type, id) {
    try {
        const endpoint = type === 'requests'
            ? `http://localhost:3000/rescuer/tasks/cancel-request/${id}`
            : `http://localhost:3000/rescuer/tasks/cancel-offer/${id}`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to cancel task');
        }

        // Remove the cancelled task from the list
        document.getElementById(`${type}-${id}`).remove();

        await showTasks();

        await updateAll();

        applyFilters();

    } catch (error) {
        console.error('Error cancelling task:', error);
        alert('Failed to cancel task. Please try again.');
    }
}

function getTooltipText(task, type) {
    if (type === 'requests') {
        let message = "";
        if (!task.inRange) {
            message += " You are not within 50m range of the requester. ";
        }
        if (!task.hasInventory) {
            message += " You don't have the required items in your inventory. ";
        }
        if (message !== "") {
            return message;
        }
    } else if (type === 'offers') {
        if (!task.inRange) {
            return "You are not within 50m range of the offerer.";
        }
    }
    return "Cannot complete the task.";
}

function placeRequestMarkers() {
    if (window.requestMarkers) {
        window.requestMarkers.forEach(marker => myMap.removeLayer(marker));
    }
    window.requestMarkers = [];

    requests.forEach(request => {
        const markerColor = request.status === 'ASSUMED' ? 'orange' : 'red';
        const requestIcon = L.divIcon({
            className: 'request-marker',
            html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; display: inline-block; position: relative;">
                     <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px;">R</span>
                   </span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([request.latitude, request.longitude], {icon: requestIcon})
            .addTo(myMap)
            .on('click', async () => {
                const requestDetails = await fetchRequestById(request.id);
                const popupContent = createRequestPopupContent(requestDetails);
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'request-popup'
                }).openPopup();
            });

        window.requestMarkers.push(marker);
    });
}

function placeOfferMarkers() {
    if (window.offerMarkers) {
        window.offerMarkers.forEach(marker => myMap.removeLayer(marker));
    }
    window.offerMarkers = [];

    offers.forEach(offer => {
        const markerColor = offer.status === 'ASSUMED' ? 'purple' : 'blue';
        const offerIcon = L.divIcon({
            className: 'offer-marker',
            html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; display: inline-block; position: relative;">
                     <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-weight: bold; font-size: 14px;">O</span>
                   </span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([offer.latitude, offer.longitude], {icon: offerIcon})
            .addTo(myMap)
            .on('click', async () => {
                const offerDetails = await fetchOfferById(offer.id);
                const popupContent = createOfferPopupContent(offerDetails);
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'offer-popup'
                }).openPopup();
            });

        window.offerMarkers.push(marker);
    });
}

function placeRescuerMarker() {
    if (window.rescuerMarkers) {
        window.rescuerMarkers.forEach(marker => myMap.removeLayer(marker));
    }
    window.rescuerMarkers = [];

    const markerColor = 'blue';
    const rescuerIcon = L.divIcon({
        className: 'rescuer-marker',
        html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const marker = L.marker([rescuer.latitude, rescuer.longitude], {icon: rescuerIcon, draggable: true})
        .addTo(myMap)
    marker.on('dragend', async function (event) {
        const position = marker.getLatLng();
        await window.changeRescuerLocation(position.lat, position.lng);

        // Update the rescuer object with new coordinates
        rescuer.latitude = position.lat;
        rescuer.longitude = position.lng;

        nearBase = await isNearBase();
        updateBaseButtons();
    });

    window.rescuerMarkers.push(marker);
}

function placeBaseMarker(latitude, longitude) {
    if (window.baseMarkers) {
        window.baseMarkers.forEach(marker => myMap.removeLayer(marker));
    }
    window.baseMarkers = [];

    const markerColor = 'black';
    const rescuerIcon = L.divIcon({
        className: 'rescuer-marker',
        html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    const marker = L.marker([latitude, longitude], {icon: rescuerIcon})
        .addTo(myMap)


    window.baseMarkers.push(marker);
}

function createRequestPopupContent(request) {
    const isAssumeDisabled = activeTasks >= 4 || request.status !== 'PENDING';
    const assumeButton = `
        <button 
            class="assume-button" 
            onclick="handleAssume('requests', ${request.id})"
            ${isAssumeDisabled ? 'disabled' : ''}
        >
            Assume Request
        </button>
    `;

    return `
        <div class="popup-content request-popup-content">
            <h3>Request #${request.id}</h3>
            <p><strong>Status:</strong> <span class="status-${request.status.toLowerCase()}">${request.status}</span></p>
            <p><strong>Created:</strong> ${new Date(request.created_at).toLocaleString()}</p>
            ${request.assumed_at ? `<p><strong>Assumed:</strong> ${new Date(request.assumed_at).toLocaleString()}</p>` : ''}
            <p><strong>Item:</strong> ${request.itemName} (${request.itemCategory})</p>
            <p><strong>Quantity:</strong> ${request.quantity}</p>
            <h4>Citizen Information</h4>
            <p><strong>Name:</strong> ${request.citizenName}</p>
            <p><strong>Phone:</strong> ${request.citizenPhone}</p>
            ${request.status === 'PENDING' ? assumeButton : ''}
        </div>
    `;
}

function createOfferPopupContent(offer) {
    const isAssumeDisabled = activeTasks > 4 || offer.status !== 'PENDING';
    const assumeButton = `
        <button 
            class="assume-button" 
            onclick="handleAssume('offers', ${offer.id})"
            ${isAssumeDisabled ? 'disabled' : ''}
        >
            Assume Request
        </button>
    `;


    return `
        <div class="popup-content offer-popup-content">
            <h3>Offer #${offer.id}</h3>
            <p><strong>Status:</strong> <span class="status-${offer.status.toLowerCase()}">${offer.status}</span></p>
            <p><strong>Created:</strong> ${new Date(offer.created_at).toLocaleString()}</p>
            ${offer.assumed_at ? `<p><strong>Assumed:</strong> ${new Date(offer.assumed_at).toLocaleString()}</p>` : ''}
            <p><strong>Item:</strong> ${offer.itemName} (${offer.itemCategory})</p>
            <p><strong>Quantity:</strong> ${offer.quantity}</p>
            <h4>Citizen Information</h4>
            <p><strong>Name:</strong> ${offer.citizenName}</p>
            <p><strong>Phone:</strong> ${offer.citizenPhone}</p>
            ${offer.status === 'PENDING' ? assumeButton : ''}
        </div>
    `;
}


function booleanAsString(booleanValue) {
    return booleanValue ? "true" : "false";
}

