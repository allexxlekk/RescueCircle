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

    document.getElementById('addAnotherAnnouncementButton').addEventListener('click', () => {
        addItemToList(items);
    });
    document.getElementById('createAnnouncementButton').addEventListener('click', createAnnouncement);

    let announcements = await fetchAnnouncements();
    showAnnouncements(announcements);
    updateAnnouncementCount();

    const modal = document.getElementById("announcementModal");
    const span = document.getElementsByClassName("close")[0];
    // Get the <span> element that closes the modal
    span.onclick = function () {
        modal.style.display = "none";
    }
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
});



async function createAnnouncement() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const itemList = document.getElementById('item-list');

    // Use querySelectorAll to get all select elements within itemList
    const selectElements = itemList.querySelectorAll('select');
    const selectedItemIds = Array.from(selectElements).map(select => select.value);

    const announcementBody = {
        name,
        description,
        items: selectedItemIds
    };

    try {
        await fetch('http://localhost:3000/announcements', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(announcementBody)
        });


        const announcements = await fetchAnnouncements();
        // Add the new announcement to the DOM without refreshing the page
        await updateAnnouncementList(announcements);
        showAnnouncements(announcements);
        // Clear the input fields
        document.getElementById('name').value = '';
        document.getElementById('description').value = '';
        itemList.innerHTML = '';

    } catch (error) {
        console.error('Create announcement error:', error);
    }
}

const addItemToList = (items) => {
    const itemList = document.getElementById('item-list');
    const newSelect = document.createElement("select");
    newSelect.id = `item-${itemList.children.length}`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        newSelect.appendChild(option);
    });
    const newLi = document.createElement("li");
    const removeButton = document.createElement("button");
    removeButton.className = 'remove-button';
    removeButton.textContent = "Remove item";
    removeButton.addEventListener("click", () => {
        newLi.remove();
    });
    newLi.appendChild(newSelect);
    newLi.appendChild(removeButton);
    itemList.appendChild(newLi);
}

function showAnnouncements(announcements) {
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
        announcementListElement.appendChild(announcementCardElement);
    });
}

async function updateAnnouncementList(announcement) {
    const announcementListContainer = document.getElementById('announcements');
    const announcementListElement = announcementListContainer.querySelector('ul');

    const announcementCardElement = createAnnouncementCardElement(announcement);
    announcementListElement.appendChild(announcementCardElement);

    // Update the announcement count
    updateAnnouncementCount();
}

function closeAnnouncementModal() {
    const modal = document.getElementById('announcementModal');
    modal.style.display = 'none';
}

function showAnnouncementDetails(announcementDetails) {
    const modal = document.getElementById('announcementModal');
    const announcementNameElement = document.getElementById('announcementName');
    const announcementDetailsContainer = document.getElementById('announcementDetails');

    announcementNameElement.textContent = announcementDetails.name;
    announcementDetailsContainer.innerHTML = '';

    const descriptionElement = document.createElement('p');
    descriptionElement.className = 'announcement-description';
    descriptionElement.textContent = `Description: ${announcementDetails.description}`;
    announcementDetailsContainer.appendChild(descriptionElement);

    const dateElement = document.createElement('p');
    dateElement.className = 'announcement-date';
    dateElement.textContent = `Date: ${announcementDetails.date}`;
    announcementDetailsContainer.appendChild(dateElement);

    const itemsListElement = document.createElement('ul');
    itemsListElement.className = 'announcement-items';
    announcementDetails.items.forEach(item => {
        const itemElement = document.createElement('li');
        itemElement.className = 'announcement-item';

        const itemNameElement = document.createElement('span');
        itemNameElement.className = 'announcement-item-name';
        itemNameElement.textContent = item.name;

        const itemCategoryElement = document.createElement('span');
        itemCategoryElement.className = 'announcement-item-category';
        itemCategoryElement.textContent = ` [${item.category}]`;

        const itemDescriptionElement = document.createElement('span');
        itemDescriptionElement.className = 'announcement-item-description';
        itemDescriptionElement.textContent = ` ${item.description || 'No description'}`;

        itemElement.appendChild(itemNameElement);
        itemElement.appendChild(itemCategoryElement);
        itemElement.appendChild(itemDescriptionElement);

        itemsListElement.appendChild(itemElement);
    });
    announcementDetailsContainer.appendChild(itemsListElement);
    modal.style.display = 'block';
}

function updateAnnouncementCount() {
    const announcementListContainer = document.getElementById('announcements');
    const announcementListElement = announcementListContainer.querySelector('ul');
    const announcementCount = announcementListElement.children.length;

    // Update the title with the new count
    let titleDiv = announcementListContainer.querySelector('.announcement-list-title');
    if (titleDiv) {
        titleDiv.textContent = `Announcements (${announcementCount})`;
    }
}

function createAnnouncementCardElement(announcement) {
    const li = document.createElement('li');
    li.className = 'announcement-card';
    li.dataset.announcementId = announcement.id;

    const announcementNameDiv = document.createElement('div');
    announcementNameDiv.className = 'announcementName';
    announcementNameDiv.textContent = `Announcement Name: ${announcement.name}`;

    const descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'description';
    descriptionDiv.textContent = `Description: ${announcement.description}`;

    const offerCountDiv = document.createElement('div');
    offerCountDiv.className = 'offerCount';
    offerCountDiv.textContent = `Offer count: ${announcement.offerCount || 0}`;

    // Assemble the card
    li.appendChild(announcementNameDiv);
    li.appendChild(descriptionDiv);
    li.appendChild(offerCountDiv);

    // Add click event listener to fetch and show announcement details
    li.addEventListener('click', () => {
        getAnnouncementById(announcement.id);
    });

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

async function fetchAnnouncements() {
    try {
        const response = await fetch('http://localhost:3000/announcements');
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

async function getAnnouncementById(announcementId) {
    try {
        const response = await fetch(`http://localhost:3000/announcements/${announcementId}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const announcementDetails = await response.json();
        showAnnouncementDetails(announcementDetails);
    } catch (error) {
        console.error('Error fetching announcement details:', error);
    }
}
