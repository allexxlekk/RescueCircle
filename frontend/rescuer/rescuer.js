async function fetchItems() {
    try {
        const response = await fetch('http://localhost:3000/items');

        return await response.json(); // Return the data
    } catch (error) {
        console.error('Fetch error:', error);
        throw error; // Re-throw the error to be caught in the higher level
    }
}
const loadInventory = async (itemId, amount, rescuerId) => {


    const inventory = {
        itemId: itemId,
        amount: amount,
        rescuerId: rescuerId,

    };

    const postResponse = await fetch('http://localhost:3000/rescuers/load', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inventory),
    });

    const response = await postResponse.json();
    console.log(response);
    alert('Item Loaded Successfully');
};

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
const rescuerId = 9; // Get from logged in rescuer
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


    if (item.quantity > 0) {
        let quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = 1;
        quantityInput.max = item.quantity;
        quantityInput.value = 1; // Set default value to 1
        quantityInput.className = "quantity-input";
        itemElement.appendChild(quantityInput);

        let loadButton = document.createElement("button");
        loadButton.className = "load";
        loadButton.textContent = `Load`;
        loadButton.onclick = async function () {
            await loadInventory(item.id, quantityInput.value, rescuerId);
            let items = await fetchItems();
            showItems(items);
        };
        itemElement.appendChild(loadButton);
    }



    return itemElement;
}



document.addEventListener('DOMContentLoaded', async () => {
    // Show items at the start
    let items = await fetchItems();

    showItems(items);

    let totalLoad


});