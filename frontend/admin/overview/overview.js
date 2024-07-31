const masterFilter = document.getElementById('masterFilter');
const assumedRequestsFilter = document.getElementById('filter-assumed-requests');
const pendingRequestsFilter = document.getElementById('filter-pending-requests');
const assumedOffersFilter = document.getElementById('filter-assumed-offers');
const pendingOffersFilter = document.getElementById('filter-pending-offers');
const activeRescuersFilter = document.getElementById('filter-active-rescuers');
const inactiveRescuersFilter = document.getElementById('filter-inactive-rescuers');
const mapLinesFilter = document.getElementById('filter-map-lines');

let myMap;

let rescuers = []
let offers = []
let requests = []

// Array of all filters except the master filter
let filterStates = {
    assumedRequests: assumedRequestsFilter.checked,
    pendingRequests: pendingRequestsFilter.checked,
    assumedOffers: assumedOffersFilter.checked,
    pendingOffers: pendingOffersFilter.checked,
    activeRescuers: activeRescuersFilter.checked,
    inactiveRescuers: inactiveRescuersFilter.checked,
    mapLines: mapLinesFilter.checked
};


const rescuerFilters = [
    activeRescuersFilter,
    inactiveRescuersFilter,
];

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
    activeRescuersFilter,
    inactiveRescuersFilter,
    mapLinesFilter,
];

document.addEventListener('DOMContentLoaded', async () => {
    initializeFilterListeners();
    await updateAll();

    // Initialize the map
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
    } catch (error) {
        console.error("Error setting up map:", error);
    }

    applyFilters()
});

// Function to toggle all filters based on master filter state
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
            await updateRequests();
        });
    });

    rescuerFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            updateMasterFilter();
            updateFilterStates();
            await updateRescuers();
        });
    });

    offerFilters.forEach(filter => {
        filter.addEventListener('change', async () => {
            updateMasterFilter();
            updateFilterStates();
            await updateOffers();
        });
    });
    mapLinesFilter.addEventListener('change', () => {
        updateMasterFilter();
        showLines();
    });

    masterFilter.addEventListener('change', applyFilters);
}

// Function to get current filter states
function updateFilterStates() {
    filterStates = {
        assumedRequests: assumedRequestsFilter.checked,
        pendingRequests: pendingRequestsFilter.checked,
        assumedOffers: assumedOffersFilter.checked,
        pendingOffers: pendingOffersFilter.checked,
        activeRescuers: activeRescuersFilter.checked,
        inactiveRescuers: inactiveRescuersFilter.checked,
        mapLines: mapLinesFilter.checked
    };
}

function showLines() {
}

async function fetchRescuers(active, inactive) {
    try {
        const response = await fetch("http://localhost:3000/admin/overview/rescuers?active=" + booleanAsString(active) + "&inactive=" + booleanAsString(inactive));

        return await response.json();

    } catch (error) {
        console.error('Error fetching rescuers:', error);
        throw error;

    }
}

async function fetchOffers(pending, assumed) {
    try {
        const response = await fetch("http://localhost:3000/admin/overview/offers?pending=" + booleanAsString(pending) + "&assumed=" + booleanAsString(assumed));

        return await response.json();

    } catch (error) {
        console.error('Error fetching rescuers:', error);
        throw error;

    }
}

async function fetchRequests(pending, assumed) {
    try {
        const response = await fetch("http://localhost:3000/admin/overview/requests?pending=" + booleanAsString(pending) + "&assumed=" + booleanAsString(assumed));

        return await response.json();

    } catch (error) {
        console.error('Error fetching rescuers:', error);
        throw error;

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

async function fetchRescuerById(id) {
    try {
        const rescuer = await fetch("http://localhost:3000/admin/overview/rescuers/" + encodeURI(id));

        return await rescuer.json();

    } catch (error) {
        console.error('Error fetching rescuer:', error);
        throw error;

    }
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

async function updateAll() {
    rescuers = await fetchRescuers(filterStates.activeRescuers, filterStates.inactiveRescuers);
    offers = await fetchOffers(filterStates.pendingOffers, filterStates.assumedOffers);
    requests = await fetchRequests(filterStates.pendingRequests, filterStates.assumedRequests);
}

async function updateRescuers() {
    rescuers = await fetchRescuers(filterStates.activeRescuers, filterStates.inactiveRescuers);
    applyFilters()
}

async function updateOffers() {
    offers = await fetchOffers(filterStates.pendingOffers, filterStates.assumedOffers);
    applyFilters()
}

async function updateRequests() {
    requests = await fetchRequests(filterStates.pendingRequests, filterStates.assumedRequests);
    applyFilters()
}

function applyFilters() {

    placeRescuerMarkers()
    placeRequestMarkers()
    placeOfferMarkers()
}


function placeRescuerMarkers() {
    // Clear existing rescuer markers if any
    if (window.rescuerMarkers) {
        window.rescuerMarkers.forEach(marker => myMap.removeLayer(marker));
    }
    window.rescuerMarkers = [];

    rescuers.forEach(rescuer => {
        const markerColor = rescuer.status === 'ACTIVE' ? 'green' : 'blue';
        const rescuerIcon = L.divIcon({
            className: 'rescuer-marker',
            html: `<span style="background-color: ${markerColor}; width: 20px; height: 20px; border-radius: 50%; display: inline-block;"></span>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker([rescuer.latitude, rescuer.longitude], {icon: rescuerIcon})
            .addTo(myMap)
            .on('click', async () => {
                const rescuerDetails = await fetchRescuerById(rescuer.id);
                const popupContent = createRescuerPopupContent(rescuerDetails);
                marker.bindPopup(popupContent, {
                    maxWidth: 300,
                    className: 'rescuer-popup'
                }).openPopup();

                if (filterStates.mapLines) {
                    drawLinesToAssignedTasks(rescuer.id, [rescuer.latitude, rescuer.longitude]);
                }
            });

        window.rescuerMarkers.push(marker);
    });
}

function createRescuerPopupContent(rescuer) {
    const inventoryHTML = rescuer.inventory.length > 0
        ? rescuer.inventory.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.amount}</td>
                <td>${item.category}</td>
            </tr>
        `).join('')
        : '<tr><td colspan="3">No items in inventory</td></tr>';

    return `
        <div class="rescuer-popup-content">
            <h3>${rescuer.username}</h3>
            <p><strong>Status:</strong> <span class="status-${rescuer.status.toLowerCase()}">${rescuer.status}</span></p>
            <p><strong>Tasks:</strong> ${rescuer.tasks}</p>
            <h4>Inventory</h4>
            <table class="inventory-table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Amount</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    ${inventoryHTML}
                </tbody>
            </table>
        </div>
    `;
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

function createRequestPopupContent(request) {
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
            ${request.rescuerId ? `
                <h4>Rescuer Information</h4>
                <p><strong>Name:</strong> ${request.rescuerUsername}</p>
            ` : ''}
        </div>
    `;
}

function createOfferPopupContent(offer) {
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
            ${offer.rescuerId ? `
                <h4>Rescuer Information</h4>
                <p><strong>Name:</strong> ${offer.rescuerUsername}</p>
            ` : ''}
        </div>
    `;
}

function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

function booleanAsString(booleanValue) {
    return booleanValue ? "true" : "false";
}
