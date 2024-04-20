document.addEventListener('DOMContentLoaded', async () => {
    let items = await fetchItems();
    const itemDropdown = document.getElementById('item');
    // Populate the item dropdown
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        itemDropdown.appendChild(option);
    });


    document.getElementById('addAnotherAnnouncementButton').addEventListener('click', async () => {
        let itemList = await fetchItems();
        addItemToList(itemList);
    });
    document.getElementById('createAnnouncementButton').addEventListener('click', createAnnouncement);

    let announcements = await fetchAnnouncements();
    console.log(announcements);
    updateAnnouncementCount();
    showAnnouncements(announcements);

});


async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function createAnnouncement() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const itemList = document.getElementById('item-list');

    // Use querySelectorAll to get all select elements within itemList
    const selectElements = itemList.querySelectorAll('select');
    const selectArray = Array.from(selectElements);
    const selectedItemIds = []
    selectArray.forEach(selectedItem =>
        selectedItemIds.push(selectedItem.options[selectedItem.selectedIndex].value))

    const uniqueItemIds = [...new Set(selectedItemIds)];
    const announcementBody = {
        name,
        description,
        items: uniqueItemIds
    };

    try {
        const response = await fetch('http://localhost:3000/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(announcementBody)
        });

        const result = await response.json();
        console.log(result);

    } catch (error) {
        console.error('Create announcement error:', error);
    }
}

const addItemToList = (items) => {
    const itemList = document.getElementById('item-list');
    const newSelect = document.createElement("select")
    newSelect.id = `item-${itemList.length}`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        newSelect.appendChild(option);
    });
    const newLi = document.createElement("li");
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove item";
    removeButton.addEventListener("click", () => {
        newLi.remove();
    });
    newLi.appendChild(newSelect);
    newLi.appendChild(removeButton);
    itemList.appendChild(newLi);
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

async function updateAnnouncementCount() {
    const announcementList = document.getElementById('announcement-list');
    const announcements = announcementList.getElementsByTagName('li');
    const announcementCount = announcements.length; // Get the current number of <li> elements

    // Update the title with the new count
    const titleDiv = document.getElementById('announcement-list-title');
    titleDiv.value = `Announcements (${announcementCount})`;
}

async function addAnnouncementToList() {
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
    announcementNameDiv.textContent = `Announcement Name: ${announcement.name}`;


    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = "description";

    descriptionDiv.textContent = `Description: ${announcement.description}`;

    // Assemble the card
    li.appendChild(announcementNameDiv);
    li.appendChild(descriptionDiv);

    return li;
}

// API CALLS
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function fetchItemsBySearch(name) {
    try {
        let response;
        if (name === "" || name === undefined || name === null) {
            response = await fetchItems();
            return response
        } else {
            response = await fetch(`http://localhost:3000/items/search?str=${name}`);
            return await response.json(); // Return the data
        }
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

const fetchItemAvailability = async (itemName) => {
    if (itemName === '') {
        return false;
    } else
        try {
            const response = await fetch('http://localhost:3000/items/isAvailable?itemName=' + encodeURIComponent(itemName));
            const addedItem = await response.json();
            return addedItem.isAvailable
        } catch (error) {
            console.error('Error while adding Item:', error);
            return false;
        }
};

async function fetchAnnouncements() {
    try {
        const response = await fetch('http://localhost:3000/announcements');

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}