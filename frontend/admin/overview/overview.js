let currentPage = 1;
const itemsPerPage = 9;
let allItems = [];

async function refreshItemTable() {
    const searchInput = document.getElementById('search-input').value;
    const selectedCategories = Array.from(document.querySelectorAll('#category-filter input[type="checkbox"]:checked:not(#all-categories)'))
        .map(checkbox => checkbox.value);

    allItems = await fetchItems(searchInput, selectedCategories.length > 0 ? selectedCategories : null);
    displayItems(currentPage);
    updatePaginationControls();
}

function displayItems(page) {
    const tableBody = document.querySelector('table tbody');
    tableBody.innerHTML = '';

    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsToDisplay = allItems.slice(startIndex, endIndex);

    itemsToDisplay.forEach(item => {
        const row = document.createElement('tr');
        row.className = 'row100 body';
        row.innerHTML = `
            <td class="cell100 column1">${item.name}</td>
            <td class="cell100 column2">${item.description}</td>
            <td class="cell100 column3">${item.category}</td>
            <td class="cell100 column4">${item.quantity}</td>
            <td class="cell100 column5">${item.rescuerQuantity}</td>
            <td class="cell100 column6">${item.quantity + item.rescuerQuantity}</td>
        `;
        tableBody.appendChild(row);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');

    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
}


// Event listeners for pagination buttons
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayItems(currentPage);
        updatePaginationControls();
    }
});

document.getElementById('next-page').addEventListener('click', () => {
    const totalPages = Math.ceil(allItems.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayItems(currentPage);
        updatePaginationControls();
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    await initializeCategoryFilter();
    await refreshItemTable();

    document.getElementById('search-input').addEventListener('input', debounce(() => {
        currentPage = 1; // Reset to first page on new search
        refreshItemTable();
    }, 300));

    document.getElementById('category-filter').addEventListener('change', () => {
        currentPage = 1; // Reset to first page on category change
        refreshItemTable();
    });
});


async function fetchItems(searchInput, categories) {
    try {

        let url;
        if (searchInput && searchInput !== '') {
            url = 'http://localhost:3000/admin/inventory-status/items?search=' + encodeURIComponent(searchInput)
        } else {
            url = 'http://localhost:3000/admin/inventory-status/items'
        }

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                categories: categories
            }),
        });

        return await response.json();

    } catch (error) {
        console.error('Error fetching items:', error);
        throw error;
    }
}

async function fetchCategories() {
    try {
        const response = await fetch("http://localhost:3000/admin/inventory-status/categories");

        return await response.json();

    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

async function initializeCategoryFilter() {
    const categories = await fetchCategories();
    const categoryFilter = document.getElementById('category-filter');
    let totalItems = 0;

    categories.forEach(category => {
        totalItems += category.items;
        const div = document.createElement('div');
        div.className = 'category-option';
        div.innerHTML = `
            <input type="checkbox" id="category-${category.id}" value="${category.id}">
            <label for="category-${category.id}">${category.name} (${category.items})</label>
        `;
        categoryFilter.appendChild(div);
    });

    // Update "All Categories" with total count
    const allCategoriesLabel = document.querySelector('label[for="all-categories"]');
    allCategoriesLabel.textContent = `All Categories (${totalItems})`;


    document.getElementById('all-categories').addEventListener('change', function () {
        const checkboxes = document.querySelectorAll('#category-filter input[type="checkbox"]:not(#all-categories)');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        refreshItemTable();
    });

    categoryFilter.addEventListener('change', function (event) {
        if (event.target.type === 'checkbox' && event.target.id !== 'all-categories') {
            document.getElementById('all-categories').checked = false;
            refreshItemTable();
        }
    });
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
