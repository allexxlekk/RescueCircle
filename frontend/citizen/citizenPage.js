import apiUtils from "../utils/apiUtils.mjs";

//API CALLS
async function fetchRequests(citizenId) {
    try {
        const response = await fetch('http://localhost:3000/requests/citizen/' + citizenId);

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}


async function postRequest(newRequest) {
    const postRequest = await fetch('http://localhost:3000/requests', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
    });
}

async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function filterItemsByCategory(categoryId) {
    let items;

    if (categoryId === "all") items = await apiUtils.fetchItems();
    else items = await apiUtils.fetchItemsByCategoryId(categoryId);

    showItems(items);
}

async function filterItemsBySearch(searchString, categoryId) {
    let items;
    if (categoryId === "all") {
        items = await apiUtils.fetchItemsBySearch(searchString);
    } else {
        items = await apiUtils.fetchItemsByCategoryIdAndSearch(
            categoryId,
            searchString
        );
    }
    showItems(items);
}


async function showItemDetails(itemId) {
    try {
        // Fetch item details using the correct endpoint with the itemId parameter
        const item = await apiUtils.fetchItemById(itemId);

        // Store original item details
        originalItemDetails = { ...item };
        selectedItemId = itemId;

        // Populate item details in the form fields
        document.getElementById("detail-name").value = item.name;

        // Fetch categories from API and populate the dropdown
        const categories = await apiUtils.fetchCategories();
        const categoryDropdown = document.getElementById("detail-category");
        categoryDropdown.innerHTML = ""; // Clear previous options
        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id;
            option.text = category.name;
            categoryDropdown.appendChild(option);
        });

        // Preselect the category based on item's category name
        const preselectedCategory = categories.find(
            (category) => category.name === item.category_name
        );
        if (preselectedCategory) {
            categoryDropdown.value = preselectedCategory.id;
        }

        document.getElementById("detail-description").value = item.description;
        document.getElementById("detail-quantity").value = item.quantity;
        document.getElementById("detail-offer-quantity").value =
            item.offer_quantity;
    } catch (error) {
        // Handle errors during the fetch
        console.error("Error fetching the item:", error);
    }
}

async function fetchAnnouncements() {
    try {
        const response = await fetch('http://localhost:3000/announcements');

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function showAnnouncements(data) {
    // Access the announcements array directly from the data object
    const announcements = data.announcements;

    const announcementListContainer = document.getElementById('announcements');
    if (!announcementListContainer) {
        console.error('Announcement list container not found');
        return;
    }

    let announcementListElement = announcementListContainer.querySelector('ul');
    if (!announcementListElement) {
        announcementListElement = document.createElement('ul');
        announcementListContainer.appendChild(announcementListElement);
    }

    let titleDiv = announcementListContainer.querySelector('.announcement-list-title');
    if (!titleDiv) {
        titleDiv = document.createElement('div');
        titleDiv.className = 'announcement-list-title';
        announcementListContainer.insertBefore(titleDiv, announcementListElement);
    }

    // Update the title with the total number of announcements
    titleDiv.textContent = `Announcements (${announcements.length})`;

    // Clear existing items in the list
    announcementListElement.innerHTML = '';

    // Iterate over the announcements array and create elements for each
    announcements.forEach(announcement => {
        let announcementCardElement = createAnnouncementCardElement(announcement);
        console.log(announcementCardElement);
        announcementListElement.appendChild(announcementCardElement);
    });
}


function updateAnnouncementCount() {
    const announcementList = document.getElementById('announcement-list');
    const announcements = announcementList.getElementsByTagName('li');
    const announcementCount = announcements.length; // Get the current number of <li> elements

    // Update the title with the new count
    const titleDiv = document.getElementById('announcement-list-title');
    titleDiv.textContent = `Announcements (${announcementCount})`;
}

function addAnnouncementToList() {
    const announcementName = document.getElementById('newAnnouncementName').value;
    const announcementDescription = document.getElementById('newAnnouncementDescription').value;

    if (!announcementName || !announcementDescription) {
        alert('Both name and description are required.');
        return;
    }

    const announcement = { name: announcementName, description: announcementDescription };
    const announcementCardElement = createAnnouncementCardElement(announcement);
    const announcementList = document.getElementById('announcement-list');
    announcementList.appendChild(announcementCardElement);

    // Update the count after adding
    updateAnnouncementCount();

    // Optionally clear the input fields
    document.getElementById('newAnnouncementName').value = '';
    document.getElementById('newAnnouncementDescription').value = '';
}

function createAnnouncementCardElement(announcement) {
    const li = document.createElement('li');
    li.className = `announcement-card ${announcement.name}`; // Add status-based class for styling, though using the name here might be unique for each card

    const announcementNameDiv = document.createElement('div');
    announcementNameDiv.className = "announcementName";
    announcementNameDiv.textContent = announcement.name;

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = "description";
    descriptionDiv.textContent = announcement.description;

    // Assemble the card
    li.appendChild(announcementNameDiv);
    li.appendChild(descriptionDiv);

    return li;
}

//main

document.addEventListener('DOMContentLoaded', async () => {

    const requestForm = document.getElementById("requestForm");
    requestForm.style.display = "none";

    const citizenId = 8;

    let requests = await fetchRequests(citizenId);

    showRequests(requests);

    let items = await apiUtils.fetchItems();
    let categories = await apiUtils.fetchCategories();
    createCategoryFilterElement(categories);

    const categoryFilter = document.getElementById("category-filter");
    const searchFilter = document.getElementById("search-filter");

    // Assuming showItems is a function that populates the item dropdown
    showItems(items);

    const selectItem = document.getElementById('select-item');
    const numberOfPeople = document.getElementById('number-of-people');
    const requestButton = document.getElementById('request-button');
    const hideRequestButton = document.getElementById('hide-request-button');
    const createRequestButton = document.getElementById('create-request-button');

    let announcements = await fetchAnnouncements();
    console.log(announcements);
    showAnnouncements(announcements);

    requestButton.addEventListener('click', async () => {
        const selectedItemId = selectItem.value; // Use 'value' to get the selected option value
        const numberOfPeopleValue = numberOfPeople.value;
        const requestObject = {
            itemId: selectedItemId,
            numberOfPeople: numberOfPeopleValue,
            citizenId: citizenId
        }
        await postRequest(requestObject);
        showRequests(await fetchRequests(citizenId));

    });

    categoryFilter.addEventListener("change", async (e) => {
        await filterItemsByCategory(e.target.value);
        searchFilter.value = "";
    });

    searchFilter.addEventListener(
        "input",
        apiUtils.debounce(async (e) => {
            const searchString = e.target.value;
            const categoryId = categoryFilter.value;
            await filterItemsBySearch(searchString, categoryId);
        }, 300)
    );


    hideRequestButton.addEventListener('click', () => {
        requestForm.style.display = 'none';
        createRequestButton.style.display = 'block';
    })

    createRequestButton.addEventListener("click", () => {
        requestForm.style.display = 'block';
        createRequestButton.style.display = 'none';
    })

});

function createCategoryFilterElement(categories) {
    const categoryFilter = document.getElementById("category-filter");
    categoryFilter.innerHTML = "";

    const option = document.createElement("option");
    option.value = "all";
    option.textContent = "All Categories";

    categoryFilter.appendChild(option);
    categories.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

// Helper Functions
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

function createRequestCardElement(request) {
    const li = document.createElement('li');
    li.className = `request-card ${request.status.toLowerCase()}`; // Add status-based class for styling

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
    detailsDiv.appendChild(statusDiv);
    detailsDiv.appendChild(numberOfPeopleDiv);
    detailsDiv.appendChild(quantityDiv);
    detailsDiv.appendChild(createdAtDiv);
    detailsDiv.appendChild(completedAtDiv);

    // Assemble the card
    li.appendChild(itemDiv);
    li.appendChild(detailsDiv);

    return li;

}

function showItems(items) {
    const selectItem = document.getElementById('select-item');
    selectItem.innerHTML = '';
    const option = document.createElement('option');
    selectItem.appendChild(option);
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id
        option.textContent = item.name;
        selectItem.appendChild(option);
    });

}
