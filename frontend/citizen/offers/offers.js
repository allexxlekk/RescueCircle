import apiUtils from "../../utils/apiUtils.mjs";

let selectedAnnouncementId = 1;
let citizenId = 7; // TODO: take this from jwt
let announcements = null;
const createOfferButton = document.getElementById("create-offer-button");
const seeOffersButton = document.getElementById("see-offers-button");
let statusFilter = "all-statuses";
const itemList = document.createElement("div");
itemList.classList.add("list-group");
const selectedStatusText = document.getElementById("selected-offers-text");
let offers;
const viewOffersContainer = document.getElementById("view-offers-container");
const viewAnnouncementsContainer = document.getElementById("view-announcements-container");
const logoutButton = document.getElementById("logoutButton");

const statusPriority = {
    'ASSUMED': 1,
    'PENDING': 2,
    'COMPLETED': 3
};

document.addEventListener("DOMContentLoaded", async () => {
    await initViewAnnouncements();
    createStatusDropdown();

    seeOffersButton.addEventListener("click", async () => {
        await initViewOffers();
    });
    createOfferButton.addEventListener("click", async () => {
        await initViewAnnouncements();
    });

    logoutButton.addEventListener("click", async () => {
        await apiUtils.logout()
    });
});

const initViewAnnouncements = async () => {
    viewAnnouncementsContainer.style.display = "inline";
    viewOffersContainer.style.display = "none";
    statusFilter = "all-statuses";
    selectedStatusText.innerHTML = "All";
    announcements = await apiUtils.fetchAnnouncements();
    showAnnouncements(announcements);
};

const initViewOffers = async () => {
    viewOffersContainer.style.display = "inline";
    viewAnnouncementsContainer.style.display = "none";
    statusFilter = "all-statuses";
    selectedStatusText.innerHTML = "All";
    offers = await apiUtils.fetchCitizensOffers();
    showOffers(offers);
};

function showAnnouncements(announcements) {
    const announcementListElement = document.getElementById("announcement-list");
    announcementListElement.innerHTML = "";

    announcements.forEach((announcement) => {
        // Create the list announcement
        let announcementElement = createAnnouncementElement(announcement);
        // Add it to the list
        announcementListElement.appendChild(announcementElement);
        announcementListElement.appendChild(document.createElement("br"));
    });
}

function createAnnouncementElement(announcement) {
    const announcementElement = document.createElement("div");
    announcementElement.className = "announcement";
    announcementElement.id = "announcement-" + announcement.id;

    // Add classes to the div
    announcementElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';

    // Set the innerHTML of the div with the item's details
    announcementElement.innerHTML = `
        <h5 class="mb-1 list-item-name">${announcement.name}</h5>
        <p class="mb-1">${announcement.description}</p>
    `;

    announcementElement.addEventListener("click", async () => {
        itemList.innerHTML = '';
        if (itemList.parentElement !== announcementElement) {
            const announcementNeeds = await apiUtils.fetchAnnouncement(announcement.id);
            announcementNeeds.items.forEach((item) => {
                // Create the list item
                let itemElement = createItemElement(item);
                // Add it to the list
                itemList.appendChild(itemElement);
                itemList.appendChild(document.createElement("br"));
            });
            announcementElement.appendChild(itemList);
        } else {
            try {
                announcementElement.removeChild(itemList);
            } catch {

            }
        }
    });

    return announcementElement;
}

function createItemElement(item) {
    const itemElement = document.createElement("div");
    itemElement.className = "item";
    itemElement.id = "item-" + item.id;

    // Add classes to the div
    itemElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';

    // Set the innerHTML of the div with the item's details
    itemElement.innerHTML = `
    <h5 class="mb-1 list-item-name">${item.name}</h5>
    <small class="list-item-category">${item.category}</small>
    <p class="mb-1">${item.description}</p>
    <input type="number" class="input-quantity" min="1" step="1" value="1" required>
    <button class="btn btn-primary submit-button">Submit</button>
`;

    // Get references to the newly created input and button
    const inputElement = itemElement.querySelector('.input-quantity');
    const buttonElement = itemElement.querySelector('.submit-button');

    inputElement.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    itemElement.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Add event listener to the button
    buttonElement.addEventListener('click', async (event) => {

        event.stopPropagation();
        // Ensure input value is a positive integer
        const quantity = parseInt(inputElement.value, 10);
        if (quantity !== undefined && quantity !== null && quantity > 0) {
            await apiUtils.postOffer({
                itemId: item.id,
                quantity: quantity,
                citizenId: citizenId,
                announcementId: selectedAnnouncementId
            });
            alert("Your offer has been completed successfully! Thank you!");
        } else {
            alert("You must enter a valid number to complete the donation");
        }
    });

    return itemElement;
}

function showOffers(offers) {
    offers.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
    const offerListElement = document.getElementById("offer-list");
    offerListElement.innerHTML = "";

    offers.forEach((request) => {
        let offerElement = createOfferElement(request);
        // Add it to the list
        offerListElement.appendChild(offerElement);
        offerListElement.appendChild(document.createElement("br"));
    });
}

function createOfferElement(offer) {
    const offerElement = document.createElement("div");
    offerElement.id = "offer-" + offer.offerId;

    // Add classes to the div
    offerElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';

    offerElement.classList.add(offer.status.toLowerCase() + "-offer");

    // Set the innerHTML of the div with the item's details
    offerElement.innerHTML = `
       <h5 class="mb-1 offer-item-name">${offer.item.name}</h5>
       <small class="request-item-quantity">Quantity: ${offer.quantity}</small>
       <p class="mb-1 offer-status">Status: ${offer.status.substring(0, 1).toUpperCase() + offer.status.substring(1).toLowerCase()}</p>
       <p class="mb-1 offer-date">Request Date: <span class="offer-date-value">${offer.createdAt}</span></p>
       <p class="mb-1 assumed-date">Assumed Date: <span class="assume-date-value">${offer.assumedAt}</span></p>
       <p class="mb-1 completed-date">Completed Date: <span class="assume-date-value">${offer.completedAt}</span></p>
       <button class="btn btn-danger delete-offer-button">Cancel Offer</button>
    `;

    // Delete button in each offer element 
    const deleteButton = offerElement.querySelector('.delete-offer-button');
    deleteButton.addEventListener('click', async (event) => {
        event.stopPropagation();
        if (confirm('Are you sure you want to cancel this offer?')) {
            try {
                await apiUtils.cancelOffer(offer.offerId);
                alert('Offer deleted successfully.');

                offerElement.remove();
            } catch (err) {
                alert('Failed to delete the offer. Please try again.');
            }
        }
    });

    return offerElement;
}

const createStatusDropdown = () => {
    const statusDropdown = document.getElementById("status-dropdown");
    const selectedStatusText = document.getElementById("selected-offers-text");
    const allStatusDropDownChoice = document.getElementById("all-status");

    statusFilter = "all-statuses";

    const statuses = ["PENDING", "ASSUMED", "COMPLETED"];
    statuses.forEach((status) => {
        const statusDropdownElement = document.createElement("div");
        statusDropdownElement.className = 'dropdown-item dropdown-status-name';
        statusDropdownElement.id = status;
        statusDropdownElement.innerHTML = status;

        statusDropdownElement.addEventListener("click", () => {
            const filteredOffers = offers.filter(off => off.status === status);
            showOffers(filteredOffers);
            selectedStatusText.textContent = ` ${status}`;
        });

        allStatusDropDownChoice.addEventListener("click", () => {
            showOffers(offers);
            selectedStatusText.textContent = "All";
        });

        statusDropdown.appendChild(statusDropdownElement);
    });
};
