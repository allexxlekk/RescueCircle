let categoriesCount = [
   {
    category: 'Food',
    itemCount: 3,
 },
 {
    category: 'Fruit',
    itemCount: 4,
 },
 {
    category: 'Water',
    itemCount: 24,
 },
];

for (let i = 0; i < categoriesCount.length; i++) {
    const container = document.querySelector('#container');
    const myList = document.createElement('ul');
    myList.classList.add('category-list');
    container.appendChild(myList);

    const categoryRow = document.createElement('div');
    categoryRow.classList.add('category-row');
    myList.appendChild(categoryRow);

    const category = document.createElement('div');
    category.classList.add('category');
    const itemCount = document.createElement('div');
    itemCount.classList.add('item-count');

    categoryRow.appendChild(category);
    categoryRow.appendChild(itemCount);

    category.textContent = `Category: ${categoriesCount[i].category}`;
    itemCount.textContent = `Number of items: ${categoriesCount[i].itemCount}`;
  }
    
const addButton = document.querySelector('#add-button');

addButton.addEventListener('click', () => {
    let container = document.querySelector('#container');
    let categoryAdded = document.createElement('ul');
    categoryAdded.classList.add('category-list');
    let categoryRow = document.createElement('div');
    categoryRow.classList.add('category-row');
    let category = document.createElement('div');
    category.classList.add('category');
    

    container.appendChild(categoryAdded);
    categoryAdded.appendChild(categoryRow);
    categoryRow.appendChild(category);
 

    const newCategory = document.querySelector('#new-category').value;
    
    container.appendChild(categoryAdded);
    if (newCategory ) {
    categoriesCount.push({ category: newCategory});
        for(let i = 0; i < categoriesCount.length; i++) {
        category.textContent = `Category: ${categoriesCount[i].category} `
    
    }
    } else {
    alert('Please enter valid input for category and item count.');
    }
});


