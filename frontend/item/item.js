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

async function getItemBySearch(name) {

    // Filter items based on category_id
    const selectedItems = await fetchItemsBySearch(name);
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
        console.error(`No items found with Search  = ${name}.`);
    }
}

async function fetchItemsBySearch(name) {
    try {
        const response = await fetch(`http://localhost:3000/items/search?str=${name}`);

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

function showItems(items) {

    try {

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

                getItemDisplay.textContent = `Item id: ${selectedItem.id} Name: ${selectedItem.name} Description: ${selectedItem.description} Quantity: ${selectedItem.quantity}  Category: ${selectedItem.categoryName}`;
            });
        } else {
            console.error('No items found.');
        }
    } catch (error) {
        console.error('Error fetching items:', error);
    }
}

async function showAllItems() {
    const items = await fetchItems();
    try {

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

document.addEventListener('DOMContentLoaded', () => {

    const searchbar = document.getElementById('search');
    const searchAvailabilityResult = document.getElementById('searchAvailabilityResult');
    //todo at the start show all items -->done
    // todo clear text after each search --> done

    // Function to search item
    const searchAvailability = async () => {
        const search = searchbar.value;
        if (search === '') {
            clearSearchResult();
            showAllItems();
        }
        else
            // Send a GET request to the server to check username availability
            try {
                clearSearchResult();
                console.log('before search');
                const response = await fetch('http://localhost:3000/items/search?str=' + encodeURIComponent(search));
                const searchItems = await response.json();
                showItems(searchItems);

            } catch (error) {
                console.error('Error while searching:', error);
                searchAvailabilityResult.textContent = 'Error checking username availability.';
            }
    };

    // Define a debounce function with a 300ms delay
    const debounceChecksearchAvailability = debounce(searchAvailability, 300);

    // Add a click event listener to the "Check Username Availability" button
    searchbar.addEventListener('input', debounceChecksearchAvailability);
});

function clearSearchResult() {
    const container = document.querySelector('#container');
    container.textContent = '';
}

//click on searchbar and have all the items 
const searchbar = document.getElementById('search');
searchbar.addEventListener('click', () => {
    const search = searchbar.value;
    if (search === '') {
        clearSearchResult();
        showAllItems();
    }
});

function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}