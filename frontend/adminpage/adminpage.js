import apiUtils from "../utils/apiUtils.mjs";

// GLOBALS
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const form = document.getElementById("item-form");
const cancelButton = document.getElementById("cancel-button");
let selectedItemId;
let originalItemDetails = {};

let mymap = L.map("mapid").setView([38.242, 21.727], 12);

// MAIN
document.addEventListener("DOMContentLoaded", async () => {
    const sectionSelect = document.getElementById('section-select');
    const sections = document.querySelectorAll('#map-request-div, #item-div,#create-announcement,#announcements');
    function toggleSections(selectedSectionId) {
        sections.forEach(section => {
            if (section.id === selectedSectionId) {
                section.style.display = ''; // Show the selected section
            } else {
                section.style.display = 'none'; // Hide all other sections
            }
        });
    }

    // Initial hide for all sections except the first one (optional)
    toggleSections(sectionSelect.value);

    // Add event listener for when the selection changes
    sectionSelect.addEventListener('change', function () {
        toggleSections(this.value);
    });

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

    //Categories//

    document.querySelector('#add-button').addEventListener('click', async () => {
        const newCategoryInput = document.querySelector('#new-category');
        const newCategoryValue = newCategoryInput.value;

        await createCategory(newCategoryValue);
        newCategoryInput.value = '';

        alert("Category added successfully");

    });

    //ITEMS//

    // Show items at the start
    let items = await apiUtils.fetchItems();
    showItems(items);

    // Initialize the category filter dropdown
    let categories = await apiUtils.fetchCategories();
    createCategoryFilterElement(categories);

    const categoryFilter = document.getElementById("category-filter");
    const searchFilter = document.getElementById("search-filter");
    const syncButton = document.getElementById("synchronize-button");

    // Initial state: editable
    toggleEditState(false);

    // Edit button click event handler
    editButton.addEventListener("click", function () {
        toggleEditState(true);
    });

    // Form submit event handler
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        await editItem();
        items = await apiUtils.fetchItems();
        showItems(items);
        // Here you can handle form submission, for example, by sending data to the server via AJAX
        toggleEditState(false); // Switch back to read-only mode after saving
    });

    // Cancel button click event handler
    cancelButton.addEventListener("click", function () {
        // Reset form fields to original values
        document.getElementById("detail-name").value = originalItemDetails.name;

        document.getElementById("detail-description").value =
            originalItemDetails.description;
        document.getElementById("detail-quantity").value =
            originalItemDetails.quantity;
        document.getElementById("detail-offer-quantity").value =
            originalItemDetails.offer_quantity;

        const categoryDropdown = document.getElementById("detail-category");
        const options = categoryDropdown.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].text === originalItemDetails.category_name) {
                options[i].selected = true;
                break;
            }
        }
        // Switch back to read-only mode
        toggleEditState(false);
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

    syncButton.addEventListener(
        "click",
        apiUtils.debounce(async () => {
            searchFilter.value = "";
            createCategoryFilterElement(await apiUtils.fetchCategories());
            await synchronizeItemList();
        }, 300)
    );


});

// API CALLS
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


async function createCategory(newCategory) {
    try {
        const response = await fetch(`http://localhost:3000/categories?categoryName=${encodeURIComponent(newCategory)}`, {
            method: 'POST',
        });
        const data = await response.json();

        console.log('Category added successfully:', data);

    } catch (error) {

        console.error('Error adding category:', error);
    }
}

// EVENT LISTENERS //
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

async function synchronizeItemList() {
    let items;
    await apiUtils.syncItems();
    items = await apiUtils.fetchItems();
    showItems(items);
}

const editItem = async () => {
    const name = document.getElementById("detail-name").value;
    const description = document.getElementById("detail-description").value;
    const quantity = document.getElementById("detail-quantity").value;
    const offer_quantity = document.getElementById("detail-offer-quantity").value;
    const categoryDropdown = document.getElementById("detail-category");
    const category =
        categoryDropdown.options[categoryDropdown.selectedIndex].text;

    const newItem = {
        id: selectedItemId,
        name: name,
        description: description,
        quantity: quantity,
        category: category,
        offer_quantity: offer_quantity,
    };

    await apiUtils.editItem(newItem);

    await showItemDetails(selectedItemId);
};

//HELPER FUNCTIONS
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

function showItems(items) {
    const itemListElement = document.getElementById("item-list");
    itemListElement.innerHTML = "";

    items.forEach((item) => {
        // Create the list item
        let itemElement = createItemElement(item);
        // Add it to the list
        itemListElement.appendChild(itemElement);
        itemListElement.appendChild(document.createElement("br"));
    });
}

function toggleEditState(editable) {
    const inputs = form.querySelectorAll("input, textarea, select");
    inputs.forEach((input) => {
        if (input.tagName.toLowerCase() === "select") {
            input.disabled = !editable;
        } else {
            input.readOnly = !editable;
        }
    });

    // Toggle visibility of buttons
    editButton.style.display = editable ? "none" : "inline";
    saveButton.style.display = editable ? "inline" : "none";
    cancelButton.style.display = editable ? "inline" : "none";
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

function createItemElement(item) {
    const itemElement = document.createElement("li");
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

    itemElement.addEventListener("click", async () => {
        await showItemDetails(itemElement.id);
    });

    return itemElement;
}

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

function renderCategories(categoriesCount) {
    const container = document.querySelector('#item-container');
    container.textContent = '';

    categoriesCount.forEach(categoryInfo => {
        const myList = document.createElement('ul');
        myList.classList.add('category-list');
        container.appendChild(myList);

        const categoryRow = document.createElement('div');
        categoryRow.classList.add('category-row');
        myList.appendChild(categoryRow);

        const category = document.createElement('div');
        category.classList.add('category');
        const itemCount = document.createElement('div');
        itemCount.classList.add('item-count');

        categoryRow.appendChild(category);
        categoryRow.appendChild(itemCount);

        category.textContent = `Category: ${categoryInfo.category}`;
        itemCount.textContent = `Number of items: ${categoryInfo.itemCount}`;
    });
}





