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
  const rowsContainer = document.querySelector('#category-rows');
  rowsContainer.textContent = ''; // Clear previous content

  // Dynamically create and add the header row
  const headerRow = document.createElement('div');
  headerRow.classList.add('category-row'); // For semantic grouping, no styling
  headerRow.innerHTML = `
      <div class="header-item category-name"><strong>Category</strong></div>
      <div class="header-item item-count"><strong>Items</strong></div>
  `;
  rowsContainer.appendChild(headerRow);

  // Populate categories
  categoriesCount.forEach(categoryInfo => {
    const categoryRow = document.createElement('div');
    categoryRow.classList.add('category-row'); // Again, for semantic grouping

    const categoryName = document.createElement('div');
    categoryName.classList.add('category-name');
    categoryName.textContent = categoryInfo.category;

    const itemCount = document.createElement('div');
    itemCount.classList.add('item-count');
    itemCount.textContent = `${categoryInfo.itemCount}`;

    categoryRow.appendChild(categoryName);
    categoryRow.appendChild(itemCount);

    rowsContainer.appendChild(categoryRow);
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
