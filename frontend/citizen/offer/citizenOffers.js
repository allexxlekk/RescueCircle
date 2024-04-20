import apiUtils from "../../utils/apiUtils.mjs";

let selectedAnnouncementId = null;
let citizenId = 3; //TODO: take this from jwt
let announcements = null;
const createOfferButton = document.getElementById("create-offer-button");
const seeOffersButton = document.getElementById("see-offers-button");
let statusFilter = "all-statuses";
const itemList = document.createElement("div");
itemList.classList.add("list-group")
const selectedStatusText = document.getElementById("selected-offers-text");
let offers;
const viewOffersContainer = document.getElementById("view-offers-container");
const viewAnnouncementsContainer = document.getElementById("view-announcements-container");


const statusPriority = {
    'ASSUMED': 1,
    'PENDING': 2,
    'COMPLETED': 3
};

document.addEventListener("DOMContentLoaded", async () => {
    await initViewAnnouncements();
    // Show items at the start
    // await createCategoryDropdown();
    createStatusDropdown();
    // await initViewRequests();

    // searchFilter.addEventListener(
    //     "input",
    //     apiUtils.debounce(async (e) => {
    //         const searchString = e.target.value;
    //         await filterItemsBySearch(searchString, categoryFilter);
    //     }, 300)
    // );
    // addRequestButton.addEventListener("click", async () => {
    //         await apiUtils.postRequest({
    //             itemId: selectedItemId,
    //             numberOfPeople: numberOfPeople,
    //             citizenId: citizenId
    //         })
    //
    //         await initViewRequests();
    //     }
    // )
    seeOffersButton.addEventListener("click", async () => {
            await initViewOffers();
        }
    )
    createOfferButton.addEventListener("click", async () => {
        await initViewAnnouncements()
    });
});

const initViewAnnouncements = async () => {
    viewAnnouncementsContainer.style.display = "inline";
    viewOffersContainer.style.display = "none";
    statusFilter = "all-statuses";
    selectedStatusText.innerHTML = "All";
    announcements = await apiUtils.fetchAnnouncements();
    showAnnouncements(announcements);
}

const initViewOffers = async () => {
    viewOffersContainer.style.display = "inline";
    viewAnnouncementsContainer.style.display = "none";
}

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
            alert("You must enter a valid number to complete the donation")
        }
    });


    return itemElement;
}


// const initAddRequest = async () => {
//     viewRequestsContainer.style.display = "none";
//     addRequestContainer.style.display = "inline";
//     selectedCategoryText.innerHTML = "All";
//     selectedItemId = null;
//     categoryFilter = "all-categories";
//     numberOfPeople = 1;
//     let items = await apiUtils.fetchItems();
//     showItems(items);
//     createPeopleDropdown();
// }
//
// const initViewRequests = async () => {
//     viewRequestsContainer.style.display = "inline";
//     addRequestContainer.style.display = "none";
//     statusFilter = "all-statuses";
//     selectedStatusText.innerHTML = "All";
//     requests = await apiUtils.fetchCitizensRequests(citizenId);
//     showRequests(requests);
//
// }
//
// function showItems(items) {
//     const itemListElement = document.getElementById("item-list");
//     itemListElement.innerHTML = "";
//
//     items.forEach((item) => {
//         // Create the list item
//         let itemElement = createItemElement(item);
//         // Add it to the list
//         itemListElement.appendChild(itemElement);
//         itemListElement.appendChild(document.createElement("br"));
//     });
// }
//
//
// function createItemElement(item) {
//     const itemElement = document.createElement("div");
//     itemElement.className = "item";
//     itemElement.id = "item-" + item.id;
//
//     // Add classes to the div
//     itemElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';
//
//     // Set the innerHTML of the div with the item's details
//     itemElement.innerHTML = `
//         <h5 class="mb-1 list-item-name">${item.name}</h5>
//         <small class="list-item-category">${item.category_name}</small>
//         <p class="mb-1">${item.description}</p>
//     `;
//
//     itemElement.addEventListener("click", async () => {
//         if (selectedItemId !== null) {
//             let selectedItem = document.getElementById("item-" + selectedItemId);
//             if (selectedItemId) { // Check if the element exists
//                 selectedItem.classList.remove("active");
//             }
//         }
//         itemElement.classList.add("active");
//         selectedItemId = item.id;
//         addRequestButton.disabled = false;
//     });
//
//     return itemElement;
// }
//
// function showRequests(requests) {
//     requests.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
//     const requestListElement = document.getElementById("request-list");
//     requestListElement.innerHTML = "";
//
//     requests.forEach((request) => {
//         // Create the list request
//         let requestElement = createRequestElement(request);
//         // Add it to the list
//         requestListElement.appendChild(requestElement);
//         requestListElement.appendChild(document.createElement("br"));
//     });
// }
//
// function createRequestElement(request) {
//     const requestElement = document.createElement("div");
//     requestElement.id = "req-" + request.requestId;
//
//     // Add classes to the div
//     requestElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';
//
//     requestElement.classList.add(request.status.toLowerCase() + "-request")
//
//     // Set the innerHTML of the div with the item's details
//     requestElement.innerHTML = `
//        <h5 class="mb-1 request-item-name">${request.item.name}</h5>
//                 <small class="request-item-quantity">Quantity: ${request.quantity}</small>
//                 <p class="mb-1 request-status">Status: ${request.status.substring(0, 1).toUpperCase() + request.status.substring(1).toUpperCase()}</p>
//                 <p class="mb-1 request-date">Request Date: <span class="request-date-value"> ${request.createdAt}</span></p>
//                 <p class="mb-1 assumed-date">Assumed Date: <span class="assume-date-value"> ${request.assumedAt}</span></p>
//                 <p class="mb-1 completed-date">Completed Date:  <span class="assume-date-value"> ${request.completedAt}</span></p>
//     `;
//
//
//     return requestElement;
// }

const createStatusDropdown = () => {

    const statusDropdown = document.getElementById("status-dropdown");
    const selectedStatusText = document.getElementById("selected-offers-text");
    const allStatusDropDownChoice = document.getElementById("all-status");

    statusFilter = "all-statuses";

    const statuses = ["PENDING", "ASSUMED", "COMPLETED"];
    statuses.forEach((status) => {
        const statusDropdownElement = document.createElement("div");
        statusDropdownElement.className = 'dropdown-item dropdown-status-name';
        statusDropdownElement.id = status
        statusDropdownElement.innerHTML = status

        statusDropdownElement.addEventListener("click", () => {
            const filteredRequests = offers.filter(req => req.status === status);
            showRequests(filteredRequests);
            selectedStatusText.textContent = ` ${status}`;
        });

        allStatusDropDownChoice.addEventListener("click", () => {
            showRequests(offers);
            selectedStatusText.textContent = "All";
        });

        statusDropdown.appendChild(statusDropdownElement);
    });

}
