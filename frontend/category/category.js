let categoriesCount = [];

async function fetchCategories() {
  try {
    const response = await fetch('http://localhost:3000/categories/count');
    const data = await response.json();
    renderCategories(data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

function renderCategories(categoriesCount) {
  const container = document.querySelector('#container');
  container.textContent = '';

  categoriesCount.forEach(categoryInfo => {
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

    category.textContent = `Category: ${categoryInfo.category}`;
    itemCount.textContent = `Number of items: ${categoryInfo.itemCount}`;
  });
}

async function createCategory(newCategory) {
  try {
    const response = await fetch(`http://localhost:3000/categories?categoryName=${encodeURIComponent(newCategory)}`, {
      method: 'POST',
    });
    const data = await response.json();
    console.log('Category added successfully:', data);
    await fetchCategories(); // Re-fetch and render categories after adding a new one
  } catch (error) {
    console.error('Error adding category:', error);
  }
}

// Add event listener to button for adding categories
document.querySelector('#add-button').addEventListener('click', async () => {
  const newCategory = document.querySelector('#new-category').value;
  const categoryExists = categoriesCount.some(categoryInfo => categoryInfo.category === newCategory);

  if (categoryExists) {
    console.log('The category already exists.');
  } else if (newCategory) {
    await createCategory(newCategory);
  } else {
    alert('Please enter a valid input for the new category.');
  }
});

// Initial fetch to populate the categories
fetchCategories();
