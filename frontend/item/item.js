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
// Function to search item
const searchAvailability = async (search) => {

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

//Used for search items from searchbar
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
        // console.log('Data received:', data);
        return data; // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function fetchCategories() {
    const response = await fetch('http://localhost:3000/categories');
    const data = await response.json();
    return data.categories;
}

const itemAvailability = async (itemName) => {

    if (itemName === '') {

        // itemAvailabilityResult.textContent = 'Empty item input. Please insert item you want to add.';
    }
    else
        try {

            const response = await fetch('http://localhost:3000/items/isAvailable?itemName=' + encodeURIComponent(itemName));
            const addedItem = await response.json();
            console.log(itemName);
            console.log(addedItem);

            // itemAvailabilityResult.textContent = `${showItems(addedItem)}`;
        }
        catch (error) {
            console.error('Error while adding Item:', error);
            // itemAvailabilityResult.textContent = 'Error while adding Item.';
        }
};

const addItem = async () => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const offer_quantity = document.getElementById('offerQuantity').value;
    const category = document.getElementById('category').value;

    const newItem = {
        name: name,
        description: description,
        quantity: quantity,
        offer_quantity: offer_quantity,
        category: category
    };

    const postResponse = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    });

    const postedItem = await postResponse.json();
    console.log('Item posted:', postedItem);
};


document.addEventListener('DOMContentLoaded', async () => {
    //////////////////// POPULATE CATEGORY DROPDOWN START //////////////////// 
    try {
        const dbcategories = await fetchCategories();
        console.log(dbcategories);

        const categoryDropdown = document.getElementById('category');
        dbcategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.name;
            option.textContent = category.name;
            categoryDropdown.appendChild(option);
        });
    } catch (error) {
        console.error('Error:', error);
    }
    //////////////////// POPULATE CATEGORY DROPDOWN END //////////////////// 

    //////////////////// SEARCHBAR START //////////////////// 
    const searchbar = document.getElementById('search');
    // Define a debounce function with a 300ms delay
    const search = searchbar.value;
    const debounceChecksearchAvailability = debounce(() => {
        const search = searchbar.value;
        searchAvailability(search);
    }, 300);
    // Add input event listener to the searchbar
    searchbar.addEventListener('input', debounceChecksearchAvailability);
    //////////////////// SEARCHBAR END //////////////////// 


    //////////////////// AVAILABILITY START //////////////////// 
    const searchAvailabilityResult = document.getElementById('searchAvailabilityResult');

    const itemNameInput = document.getElementById('name');
    // const itemAvailabilityResult = document.getElementById('itemAvailabilityResult');

    const debounceCheckItemAvailability = debounce(() => {
        const itemName = itemNameInput.value;
        itemAvailability(itemName);
    }, 300);
    itemNameInput.addEventListener('input', debounceCheckItemAvailability);
    //////////////////// AVAILABILITY END //////////////////// 

    //////////////////// ADD ITEM START //////////////////// 
    const addButton = document.getElementById('add-button');
    addButton.addEventListener('click', addItem);
});

function clearSearchResult() {
    const container = document.querySelector('#container');
    container.textContent = '';
}


function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
