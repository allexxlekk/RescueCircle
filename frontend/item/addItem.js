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
        category: category,

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