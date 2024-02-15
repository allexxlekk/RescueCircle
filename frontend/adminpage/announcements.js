document.addEventListener('DOMContentLoaded', async () => {
    const items = await fetchItems();
    const itemDropdown = document.getElementById('item');

    // Populate the item dropdown
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        itemDropdown.appendChild(option);
    });


    document.getElementById('annButton').addEventListener('click', createAnnouncement);
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
    const selectedItem = document.getElementById('item');
    const selectedItemId = selectedItem.options[selectedItem.selectedIndex].value;

    const announcementBody = {
        name,
        description,
        items: [selectedItemId]
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



// const Createannouncement = async () => {

//     const announcementObject = {
//         name: document.getElementById("name").value,
//         description: document.getElementById("description").value,
//         items: []
//     }
//     console.log(announcementObject);
// }
// document.addEventListener("DOMContentLoaded", async () => {

//     const annButton = document.getElementById("annButton");
//     annButton.addEventListener('click', Createannouncement);

// });


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