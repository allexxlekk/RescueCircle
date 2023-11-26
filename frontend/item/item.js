itemArray = [
    {
        id: 2,
        name: 'Croissant',
        description: 'Molto',
        quantity: 120,
        offer_quantity: 15,
        category_id: 8,
    },
    {
        id: 5,
        name: 'Bananas',
        description: 'Chiquita',
        quantity: 100,
        offer_quantity: 25,
        category_id: 8,
    },
];

const container = document.querySelector('#container');
//Get item by categoryID
function getItemById(category_id) {
    // Filter items based on category_id
    const selectedItems = itemArray.filter(item => item.category_id === category_id);

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
        console.error(`No items found with category_id = ${category_id}.`);
    }
}


function getItemDetailsByName(name){
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

getItemDetailsByName('Bananas');

