const addItem = async () => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const quantity = document.getElementById('quantity').value;
    const offer_quantity = document.getElementById('offerQuantity').value;
    const category = document.getElementById('category').value;
    // const detailName = document.getElementById('itemDetailName').value;
    // const detailValue = document.getElementById('itemDetailValue').value;
    const newItem = {
        name: name,
        description: description,
        quantity: quantity,
        offer_quantity: offer_quantity,
        category: category,
        // detailName: detailName,
        // detailValue: detailValue,
    };

    const postResponse = await fetch('http://localhost:3000/items', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
    });

    const postedItem = await postResponse.json();
    console.log(postedItem);
    console.log(newItem);
};
// API CALLS //
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

document.addEventListener('DOMContentLoaded', async () => {
    // Get item details from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    try {
        // Fetch item details using the correct endpoint with the itemId parameter
        const item = await fetchItemById(itemId);

        // Populate item details on the page
        document.getElementById('item-name').textContent = item.name;
        document.getElementById('item-category').textContent = item.category_name;
    } catch (error) {
        // Handle errors during the fetch
        console.error('Error fetching the item:', error);
    }
});
