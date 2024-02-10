const testRequests = [
    {
        id: 'req1',
        item: { name: 'Water'},
        status: 'Completed',
        numberOfPeople: 2,
        quantity: 6,
        createdAt: '10/02/24',
        completedAt: '13/02/24'
    },
    {
        id: 'req2',
        item: { name: 'Food'},
        status: 'Pending',
        numberOfPeople: 3,
        quantity: 10,
        createdAt: '15/02/24',
        completedAt: ''
    },
    {
        id: 'req3',
        item: { name: 'Blankets'},
        status: 'Assumed',
        numberOfPeople: 5,
        quantity: 15,
        createdAt: '17/02/24',
        completedAt: ''
    }
];

document.addEventListener('DOMContentLoaded', function() {
    showRequests(testRequests);
});



// Helper Functions
function showRequests(requests) {
    const requestListElement = document.getElementById('request-list').querySelector('ul');
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
