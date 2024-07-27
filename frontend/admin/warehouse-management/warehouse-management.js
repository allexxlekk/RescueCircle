const categoryList = document.getElementById('category-list');
const itemList = document.getElementById('item-list');
const searchCategoryInput = document.getElementById('search-category-input');
const searchItemInput = document.getElementById('search-item-input');
const addCategoryInput = document.getElementById('add-category-input');
const addCategoryButton = document.getElementById('add-category-button');
const itemListContainer = document.getElementById('item-list-container');
const addItemForm = document.getElementById('add-item-form');
const itemPlaceholder = document.getElementById('item-placeholder');

let selectedCategoryId = null;

async function refreshCategoryList() {
    itemListContainer.style.display = 'none';
    addItemForm.style.display = 'none';
    itemPlaceholder.style.display = 'block';
    const categories = await fetchCategories(searchCategoryInput.value);

    // Clear the list
    categoryList.innerHTML = '';

    categories.forEach(category => {
        categoryList.appendChild(createCategoryCard(category));
    });

}

async function refreshItemList(categoryId) {
    selectedCategoryId = categoryId;
    itemListContainer.style.display = 'block';
    addItemForm.style.display = 'block';
    itemPlaceholder.style.display = 'none';
    const items = await fetchItems(searchItemInput.value);

    // Clear the list
    itemList.innerHTML = '';

    if (items.length === 0) {
        const h3 = document.createElement('h3');
        h3.textContent = 'No items';
        itemList.appendChild(h3);
        itemList.classList.add("empty-list")
    } else {
        items.forEach(item => {
            itemList.classList.remove("empty-list")
            itemList.appendChild(createItemCard(item));
        });
    }

}

async function addCategoryButtonRefresh() {
    const input = addCategoryInput.value;
    try {
        if (input === '') {
            addCategoryButton.disabled = true;
        } else {
            const isAvailable = await nameAvailability(input);
            addCategoryButton.disabled = !isAvailable;
        }
    } catch (error) {
        console.error('Error checking name availability:', error);
        addCategoryButton.disabled = true; // Disable button on error
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initial load of categories
    await refreshCategoryList();

    // Add event listeners
    searchCategoryInput.addEventListener('input', debounce(refreshCategoryList, 300));
    searchItemInput.addEventListener('input', debounce(() => refreshItemList(selectedCategoryId), 300));
    addCategoryInput.addEventListener('input', debounce(addCategoryButtonRefresh, 300));
    addCategoryButton.addEventListener('click', addCategory);

    document.getElementById('add-item-form').addEventListener('submit', async (event) => {
        event.preventDefault();

        const name = document.getElementById('item-name').value;
        const categoryId = selectedCategoryId;
        const description = document.getElementById('item-description').value;
        const quantity = parseInt(document.getElementById('item-quantity').value, 10);
        const offerQuantity = parseInt(document.getElementById('item-offer-quantity').value, 10);

        try {
            await addItem(name, categoryId, description, quantity, offerQuantity);
            // Clear the form
            event.target.reset();
            // Refresh the item list
            await refreshCategoryList();
            await refreshItemList(selectedCategoryId);
        } catch (error) {
            console.error('Failed to add item:', error);
            // Display error message to user
        }
    });
});

// API CALLS
async function fetchCategories(searchInput) {
    let response;
    if (!searchInput) {
        response = await fetch("http://localhost:3000/admin/warehouse-management/categories");
    } else {
        response = await fetch('http://localhost:3000/admin/warehouse-management/categories?search=' + encodeURIComponent(searchInput));
    }
    return await response.json(); // Return the data
}

async function fetchItems(searchInput) {
    let response;
    if (!searchInput) {
        response = await fetch("http://localhost:3000/admin/warehouse-management/items/" + selectedCategoryId);
    } else {
        response = await fetch("http://localhost:3000/admin/warehouse-management/items/" + selectedCategoryId + "?search=" + encodeURIComponent(searchInput));
    }
    return await response.json(); // Return the data
}

async function deleteCategoryById(id) {
    await fetch("http://localhost:3000/admin/warehouse-management/categories/" + id, {method: 'DELETE'});
}

async function nameAvailability(name) {
    try {
        const response = await fetch(`http://localhost:3000/admin/warehouse-management/categories/name-available?name=${encodeURIComponent(name)}`);
        const availability = await response.text(); // The API returns a boolean as text
        console.log(availability)
        return availability === 'true'; // Convert the string 'true' or 'false' to a boolean
    } catch (error) {
        console.error('Error fetching name availability:', error);
        throw error; // Re-throw the error to be handled by the caller
    }
}

async function addCategory() {
    const name = addCategoryInput.value;
    await fetch("http://localhost:3000/admin/warehouse-management/categories", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: name}),
    });
    addCategoryInput.value = '';
    await addCategoryButtonRefresh();
    await refreshCategoryList();
}

async function addItem(name, categoryId, description, quantity, offerQuantity) {
    try {
        await fetch('http://localhost:3000/admin/warehouse-management/items', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                category: categoryId,
                description,
                quantity,
                offerQuantity
            }),
        });

    } catch (error) {
        console.error('Error adding item:', error);
        throw error;
    }
}

async function deleteCategory(id) {
    await deleteCategoryById(id);
    await refreshCategoryList();
}

async function updateItemQuantity(itemId, newQuantity) {
    await fetch("http://localhost:3000/admin/warehouse-management/items/" + itemId + "/update-quantity", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({quantity: newQuantity}),
    });
}

function createCategoryCard(category) {
    const li = document.createElement('li');
    li.className = 'category-card';

    const categoryInfoContainer = document.createElement('div');
    categoryInfoContainer.className = 'category-card-info-container';

    // Create and set content for the category name
    const h3 = document.createElement('h3');
    h3.className = 'category-card-name';
    h3.textContent = category.name;

    // Create and set content for the item count
    const p = document.createElement('p');
    p.className = 'category-card-item-count';
    p.textContent = `Assigned Items: ${category.items}`;

    categoryInfoContainer.appendChild(h3);
    categoryInfoContainer.appendChild(p);

    categoryInfoContainer.addEventListener('click', async () => {
        searchItemInput.value = '';
        addItemForm.reset();
        await refreshItemList(category.id);
    });

    // Create container for buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'category-card-buttons-container';


    // Create delete button
    if (category.items === 0) {
        const deleteButton = document.createElement('button');
        deleteButton.className = 'category-card-button-delete';
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteCategory(category.id));
        buttonContainer.appendChild(deleteButton);
    }


    // Append all elements to the list item
    li.appendChild(categoryInfoContainer);
    li.appendChild(buttonContainer);

    return li;
}

function createItemCard(item) {
    const li = document.createElement('li');
    li.className = 'item-card';

    const itemInfoContainer = document.createElement('div');
    itemInfoContainer.className = 'item-card-info-container';

    // Create and set content for the item name
    const h3 = document.createElement('h3');
    h3.className = 'item-card-name';
    h3.textContent = item.name;

    // Create and set content for the item description
    const p = document.createElement('p');
    p.className = 'item-card-description';
    p.textContent = item.description;

    // Create quantity container
    const quantityContainer = document.createElement('div');
    quantityContainer.className = 'item-card-quantity-container';

    const quantityLabel = document.createElement('label');
    quantityLabel.textContent = 'Quantity: ';
    quantityLabel.htmlFor = `quantity-input-${item.id}`;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = `quantity-input-${item.id}`;
    quantityInput.className = 'item-card-quantity-input';
    quantityInput.value = item.quantity;
    quantityInput.min = '0';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.className = 'item-card-save-button';
    saveButton.disabled = true;

    quantityInput.addEventListener('input', () => {
        const newQuantity = parseInt(quantityInput.value, 10);
        saveButton.disabled = newQuantity === item.quantity || isNaN(newQuantity) || newQuantity < 0;
    });

    saveButton.addEventListener('click', async () => {
        const newQuantity = parseInt(quantityInput.value, 10);
        if (newQuantity !== item.quantity && !isNaN(newQuantity) && newQuantity >= 0) {
            try {
                await updateItemQuantity(item.id, newQuantity);
                await refreshItemList(selectedCategoryId);
            } catch (error) {
                console.error('Failed to update quantity:', error);
            }
        }
    });

    quantityContainer.appendChild(quantityLabel);
    quantityContainer.appendChild(quantityInput);
    quantityContainer.appendChild(saveButton);

    // Create and set content for the offer quantity
    const offerQuantityP = document.createElement('p');
    offerQuantityP.className = 'item-card-offer-quantity';
    offerQuantityP.textContent = `Offer Quantity: ${item.offerQuantity}`;

    itemInfoContainer.appendChild(h3);
    itemInfoContainer.appendChild(p);
    itemInfoContainer.appendChild(quantityContainer);
    itemInfoContainer.appendChild(offerQuantityP);

    li.appendChild(itemInfoContainer);

    return li;
}


function debounce(func, delay) {
    let debounceTimer;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}
