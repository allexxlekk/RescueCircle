// API CALLS //
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Show items at the start
    let items = await fetchItems();
    console.log(items);
    showItems(items);
    try {
        // Fetch item details using the correct endpoint with the itemId parameter
        items = await fetchItemById(itemId);

        // Populate item details on the page
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('item-category').textContent = item.category_name;
        document.getElementById('item-description').textContent = item.description;
        document.getElementById('item-quantity').textContent = item.quantity;
    } catch (error) {
        // Handle errors during the fetch
        console.error('Error fetching the item:', error);
    }

});

function showItems(items) {
    const itemListElement = document.getElementById('item-list');
    itemListElement.innerHTML = '';

    items.forEach(item => {
        // Create the list item
        let itemElement = createItemElement(item);
        // Add it to the list
        itemListElement.appendChild(itemElement);
        itemListElement.appendChild(document.createElement("br"));

    });

}
function createItemElement(item) {
    const itemElement = document.createElement('li');
    itemElement.className = "item";
    itemElement.id = item.id;

    let itemNameElement = document.createElement("span");
    itemNameElement.className = "name";
    itemNameElement.textContent = `${item.name}`;
    const itemNameDiv = document.createElement("div");
    itemNameDiv.textContent = "Name: ";
    itemNameDiv.appendChild(itemNameElement);

    let itemCategoryElement = document.createElement("span");
    itemCategoryElement.className = "category";
    itemCategoryElement.textContent = `${item.category_name}`;
    const itemCategoryDiv = document.createElement("div");
    itemCategoryDiv.textContent = "Category: ";
    itemCategoryDiv.appendChild(itemCategoryElement);

    let itemQuantity = document.createElement("span");
    itemQuantity.className = "quantity";
    itemQuantity.textContent = `${item.quantity}`;
    const itemQuantityDiv = document.createElement("div");
    itemQuantityDiv.textContent = "Quantity: ";
    itemQuantityDiv.appendChild(itemQuantity);

    itemElement.appendChild(itemNameDiv);
    itemElement.appendChild(itemCategoryDiv);
    itemElement.appendChild(itemQuantityDiv);


    itemElement.addEventListener('click', () => {
        window.location.href = `manageItem.html?id=${itemElement.id}`;
    })

    return itemElement;

}

async function fetchItemById(itemId) {
    try {
        const response = await fetch(`http://localhost:3000/items/${itemId}`);
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}
// API CALLS //




