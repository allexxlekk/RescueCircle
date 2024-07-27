const rescuerId = 4;

document.addEventListener('DOMContentLoaded', async () => {

    const inventoryItems = await fetchInventory(rescuerId);
    showInventoryItems(inventoryItems);
});


//// Load Inventory code////
async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}

async function fetchInventory(rescuerId) {
    try {
        const response = await fetch('http://localhost:3000/rescuers/inventory?id=' + rescuerId);

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}


function showInventoryItems(inventoryItems) {
    const inventoryListElement = document.getElementById('inventory-list');
    inventoryListElement.innerHTML = '';

    inventoryItems.forEach(inventoryItem => {
        // Create the list item
        let inventoryItemElement = createInventoryItemElement(inventoryItem);
        // Add it to the list
        inventoryListElement.appendChild(inventoryItemElement);
        inventoryListElement.appendChild(document.createElement("br"));

    });

}

function createInventoryItemElement(inventory) {
    const inventoryItemElement = document.createElement('li');
    inventoryItemElement.className = "inventoryItem";
    inventoryItemElement.id = inventory.id;

    let inventoryItemNameElement = document.createElement("span");
    inventoryItemNameElement.className = "name";
    inventoryItemNameElement.textContent = `${inventory.name}`;

    const itemNameDiv = document.createElement("div");
    itemNameDiv.textContent = "Name: ";
    itemNameDiv.appendChild(inventoryItemNameElement);

    let inventoryItemCategoryNameElement = document.createElement("span");
    inventoryItemCategoryNameElement.className = "name";
    inventoryItemCategoryNameElement.textContent = `${inventory.category_name}`;

    const itemCategoryNameDiv = document.createElement("div");
    itemCategoryNameDiv.textContent = "Category Name: ";
    itemCategoryNameDiv.appendChild(inventoryItemCategoryNameElement);

    let inventoryItemAmountElement = document.createElement("span");
    inventoryItemAmountElement.className = "amount";
    inventoryItemAmountElement.textContent = `${inventory.amount}`;

    const itemAmountDiv = document.createElement("div");
    itemAmountDiv.textContent = "Amount: ";
    itemAmountDiv.appendChild(inventoryItemAmountElement);


    inventoryItemElement.appendChild(itemNameDiv);
    inventoryItemElement.appendChild(itemCategoryNameDiv);
    inventoryItemElement.appendChild(itemAmountDiv);



    return inventoryItemElement;
}
