async function getItemByCategoryId(category_id) {

    // Filter items based on category_id
    const selectedItems = await fetchItemsByCategoryId(category_id);

    if (selectedItems && selectedItems.length > 0) {

        const myList = document.createElement('ul');
        myList.classList.add('list-item');
        container.appendChild(myList);

        selectedItems.forEach(selectedItem => {

            const listItem = document.createElement('li');
            myList.appendChild(listItem);

            const getItemDisplay = document.createElement('div');
            getItemDisplay.classList.add('item-display');
            listItem.appendChild(getItemDisplay);

            getItemDisplay.textContent = `Item id: ${selectedItem.id} Name: ${selectedItem.name} Description: ${selectedItem.description} Quantity: ${selectedItem.quantity} Offer: ${selectedItem.quantity} Category id: ${selectedItem.category_name}`;
        });
    } else {
        console.error(`No items found with category_id = ${category_id}.`);
    }
}

function getItemDetailsByName(name) {
    const selectedItems = itemArray.filter(item => item.name === name);

    if (selectedItems.length > 0) {

        const myList = document.createElement('ul');
        myList.classList.add('list-item');
        container.appendChild(myList);

        selectedItems.forEach(selectedItem => {

            const listItem = document.createElement('li');
            myList.appendChild(listItem);

            const getItemDisplay = document.createElement('div');
            getItemDisplay.classList.add('item-display');
            listItem.appendChild(getItemDisplay);

            getItemDisplay.textContent = `Item id: ${selectedItem.id} Name: ${selectedItem.name} Description: ${selectedItem.description} Quantity: ${selectedItem.quantity} Offer: ${selectedItem.offer_quantity} Category id: ${selectedItem.category_id}`;
        });
    } else {
        console.error(`No items found with category_id = ${name}.`);
    }
}

async function getItems() {
    try {
        const items = await fetchItems();

        if (items && items.length > 0) {
            const container = document.querySelector('#container');
            const myList = document.createElement('ul');
            myList.classList.add('list-item');
            container.appendChild(myList);

            items.forEach(selectedItem => {
                const listItem = document.createElement('li');
                myList.appendChild(listItem);

                const getItemDisplay = document.createElement('div');
                getItemDisplay.classList.add('item-display');
                listItem.appendChild(getItemDisplay);

                getItemDisplay.textContent = `Item id: ${selectedItem.id} Name: ${selectedItem.name} Description: ${selectedItem.description} Quantity: ${selectedItem.quantity} Offer: ${selectedItem.offer_quantity} Category id: ${selectedItem.category_id}`;
            });
        } else {
            console.error('No items found.');
        }
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function fetchItemsByCategoryId(category_id) {
    try {
        const response = await fetch(`http://localhost:3000/items/byCategory?id=${category_id}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        return data; // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Data received:', data);
        return data; // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

getItemByCategoryId(3);

