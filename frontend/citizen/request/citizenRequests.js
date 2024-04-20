import apiUtils from "../../utils/apiUtils.mjs";

let selectedItemId = null;
let citizenId = 3; //TODO: take this from jwt
const searchFilter = document.getElementById("search-filter");
const addRequestButton = document.getElementById("add-request-button");
const cancelRequestButton = document.getElementById("cancel-request-button");
const createRequestButton = document.getElementById("create-request-button");
let categoryFilter = "all-categories";
let statusFilter = "all-statuses";
let requests;
let numberOfPeople = 1;
const viewRequestsContainer = document.getElementById("view-request-container");
const selectedCategoryText = document.getElementById("selected-category-text");
const addRequestContainer = document.getElementById("add-request-container");


const statusPriority = {
    'ASSUMED': 1,
    'PENDING': 2,
    'COMPLETED': 3
};

document.addEventListener("DOMContentLoaded", async () => {
    // Show items at the start
    await createCategoryDropdown();
    createStatusDropdown();
    await initViewRequests();

    searchFilter.addEventListener(
        "input",
        apiUtils.debounce(async (e) => {
            const searchString = e.target.value;
            await filterItemsBySearch(searchString, categoryFilter);
        }, 300)
    );
    addRequestButton.addEventListener("click", async () => {
            await apiUtils.postRequest({
                itemId: selectedItemId,
                numberOfPeople: numberOfPeople,
                citizenId: citizenId
            })

            await initViewRequests();
        }
    )
    cancelRequestButton.addEventListener("click", async () => {
            await initViewRequests();
        }
    )
    createRequestButton.addEventListener("click", async () => {
        await initAddRequest()
    });
});

const initAddRequest = async () => {
    viewRequestsContainer.style.display = "none";
    addRequestContainer.style.display = "inline";
    selectedCategoryText.innerHTML = "All";
    selectedItemId = null;
    categoryFilter = "all-categories";
    numberOfPeople = 1;
    let items = await apiUtils.fetchItems();
    showItems(items);
    createPeopleDropdown();


}

const initViewRequests = async () => {
    viewRequestsContainer.style.display = "inline";
    addRequestContainer.style.display = "none";
    requests = await apiUtils.fetchCitizensRequests(citizenId);
    showRequests(requests);

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


function createItemElement(item) {
    const itemElement = document.createElement("div");
    itemElement.className = "item";
    itemElement.id = "item-" + item.id;

    // Add classes to the div
    itemElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';

    // Set the innerHTML of the div with the item's details
    itemElement.innerHTML = `
        <h5 class="mb-1 list-item-name">${item.name}</h5>
        <small class="list-item-category">${item.category_name}</small>
        <p class="mb-1">${item.description}</p>
    `;

    itemElement.addEventListener("click", async () => {
        if (selectedItemId !== null) {
            let selectedItem = document.getElementById("item-" + selectedItemId);
            if (selectedItemId) { // Check if the element exists
                selectedItem.classList.remove("active");
            }
        }
        itemElement.classList.add("active");
        selectedItemId = item.id;
        addRequestButton.disabled = false;
    });

    return itemElement;
}

function showRequests(requests) {
    requests.sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);
    const requestListElement = document.getElementById("request-list");
    requestListElement.innerHTML = "";

    requests.forEach((request) => {
        // Create the list request
        let requestElement = createRequestElement(request);
        // Add it to the list
        requestListElement.appendChild(requestElement);
        requestListElement.appendChild(document.createElement("br"));
    });
}

function createRequestElement(request) {
    const requestElement = document.createElement("div");
    requestElement.id = "req-" + request.requestId;

    // Add classes to the div
    requestElement.className = 'd-flex w-100 justify-content-between list-group-item list-group-item-action flex-column align-items-start';

    requestElement.classList.add(request.status.toLowerCase() + "-request")

    // Set the innerHTML of the div with the item's details
    requestElement.innerHTML = `
       <h5 class="mb-1 request-item-name">${request.item.name}</h5>
                <small class="request-item-quantity">Quantity: ${request.quantity}</small>
                <p class="mb-1 request-status">Status: ${request.status.substring(0, 1).toUpperCase() + request.status.substring(1).toUpperCase()}</p>
                <p class="mb-1 request-date">Request Date: <span class="request-date-value"> ${request.createdAt}</span></p>
                <p class="mb-1 assumed-date">Assumed Date: <span class="assume-date-value"> ${request.assumedAt}</span></p>
                <p class="mb-1 completed-date">Completed Date:  <span class="assume-date-value"> ${request.completedAt}</span></p>
    `;


    return requestElement;
}

const createCategoryDropdown = async () => {

    const categoryDropdown = document.getElementById("category-dropdown");
    const selectedCategoryText = document.getElementById("selected-category-text");
    const allCategoriesDropdownChoice = document.getElementById("all-categories");

    categoryFilter = "all-categories";

    const categories = await apiUtils.fetchCategories();
    categories.forEach((category) => {
        const categoryDropDownElement = document.createElement("div");
        categoryDropDownElement.className = 'dropdown-item dropdown-category-name';
        categoryDropDownElement.id = category.id;
        categoryDropDownElement.innerHTML = category.name;

        categoryDropDownElement.addEventListener("click", async () => {
            const items = await apiUtils.fetchItemsByCategoryId(category.id);
            showItems(items);
            selectedCategoryText.innerHTML = category.name
            selectedItemId = null;
            categoryFilter = category.id;
            searchFilter.value = "";
            addRequestButton.disabled = true;
        });

        allCategoriesDropdownChoice.addEventListener("click", async () => {
            const items = await apiUtils.fetchItems();
            showItems(items);
            selectedCategoryText.innerHTML = "All";
            selectedItemId = null;
            categoryFilter = "all-categories";
            searchFilter.value = "";
            addRequestButton.disabled = true;

        });

        categoryDropdown.appendChild(categoryDropDownElement);
    });

}

const createStatusDropdown = () => {

    const statusDropdown = document.getElementById("status-dropdown");
    const selectedStatusText = document.getElementById("selected-request-text");
    const allStatusDropDownChoice = document.getElementById("all-status");

    statusFilter = "all-statuses";

    const statuses = ["PENDING", "ASSUMED", "COMPLETED"];
    statuses.forEach((status) => {
        const statusDropdownElement = document.createElement("div");
        statusDropdownElement.className = 'dropdown-item dropdown-status-name';
        statusDropdownElement.id = status
        statusDropdownElement.innerHTML = status

        statusDropdownElement.addEventListener("click", () => {
            const filteredRequests = requests.filter(req => req.status === status);
            showRequests(filteredRequests);
            selectedStatusText.textContent = ` ${status}`;
        });

        allStatusDropDownChoice.addEventListener("click", () => {
            showRequests(requests);
            selectedStatusText.textContent = "All";
        });

        statusDropdown.appendChild(statusDropdownElement);
    });

}

function createPeopleDropdown() {
    const container = document.getElementById('number-of-people');
    container.innerHTML = "";
    // Create the label element
    const label = document.createElement('label');
    label.setAttribute('for', 'people-dropdown'); // Ensure the 'for' attribute matches the select's ID
    label.textContent = 'Select number of people:';

    // Create the select element
    const select = document.createElement('select');
    select.id = 'people-dropdown'; // This ID is referenced by the label's 'for' attribute
    select.className = 'form-select'; // Optional: Add Bootstrap class for styling

    // Populate the select element with options
    for (let i = 1; i <= 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        select.appendChild(option);
    }

    // Append the label and select element to the container
    container.appendChild(label);
    container.appendChild(select);

    numberOfPeople = select.value;
    select.addEventListener('change', function () {
        numberOfPeople = this.value;
    });
}

async function filterItemsBySearch(searchString, categoryId) {
    let items;
    if (categoryId === "all-categories") {
        items = await apiUtils.fetchItemsBySearch(searchString);
    } else {
        items = await apiUtils.fetchItemsByCategoryIdAndSearch(
            categoryId,
            searchString
        );
    }
    addRequestButton.disabled = true;

    showItems(items);
}
