const categoryList = document.getElementById('category-list');
const searchCategoryInput = document.getElementById('search-category-input');
const addCategoryInput = document.getElementById('add-category-input');
const addCategoryButton = document.getElementById('add-category-button');

async function refreshCategoryList() {
    const categories = await fetchCategories(searchCategoryInput.value);

    // Clear the list
    categoryList.innerHTML = '';

    categories.forEach(category => {
        categoryList.appendChild(createCategoryCard(category));
    });

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
    addCategoryInput.addEventListener('input', debounce(addCategoryButtonRefresh, 300));
    addCategoryButton.addEventListener('click', addCategory)
});

// API CALLS
async function fetchCategories(searchInput) {
    let response;
    if (!searchInput) {
        response = await fetch("http://localhost:3000/admin/categories");
    } else {
        response = await fetch('http://localhost:3000/admin/categories?search=' + encodeURIComponent(searchInput));
    }
    return await response.json(); // Return the data
}

async function deleteCategoryById(id) {
    await fetch("http://localhost:3000/admin/categories/" + id, {method: 'DELETE'});
}

async function nameAvailability(name) {
    try {
        const response = await fetch(`http://localhost:3000/admin/categories/name-available?name=${encodeURIComponent(name)}`);
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
    await fetch("http://localhost:3000/admin/categories", {
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

async function deleteCategory(id) {
    await deleteCategoryById(id);
    await refreshCategoryList();
}

function createCategoryCard(category) {
    const li = document.createElement('li');
    li.className = 'category-card';

    // Create and set content for the category name
    const h2 = document.createElement('h2');
    h2.className = 'category-card-name';
    h2.textContent = category.name;

    // Create and set content for the item count
    const p = document.createElement('p');
    p.className = 'category-card-item-count';
    p.textContent = `Assigned Items: ${category.items}`;

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
    li.appendChild(h2);
    li.appendChild(p);
    li.appendChild(buttonContainer);

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
