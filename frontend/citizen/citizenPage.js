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

document.addEventListener('DOMContentLoaded', async () => {

    const requestForm = document.getElementById("requestForm");
    requestForm.style.display = "none";

    const citizenId = 8;

    let requests = await fetchRequests(citizenId);
    console.log(requests);
    showRequests(requests);

    let items = await fetchItems();

    // Assuming createItemDropdownElement is a function that populates the item dropdown
    createItemDropdownElement(items);

    const selectItem = document.getElementById('select-item');
    const numberOfPeople = document.getElementById('number-of-people');
    const requestButton = document.getElementById('request-button');
    const hideRequestButton = document.getElementById('hide-request-button');
    const createRequestButton = document.getElementById('create-request-button');

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

    hideRequestButton.addEventListener('click', () => {
        requestForm.style.display = 'none';
        createRequestButton.style.display = 'block';
    })

    createRequestButton.addEventListener("click", () => {
        requestForm.style.display = 'block';
        createRequestButton.style.display = 'none';
    })

});

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

function createItemDropdownElement(items) {
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
