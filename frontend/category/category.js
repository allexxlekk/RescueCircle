let categoriesCount = [];

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

function fetchCategories() {
  fetch('http://localhost:3000/categories/count')
    .then(response => response.json())
    .then(data => {
      renderCategories(data);
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
    });
    
}

const addButton = document.querySelector('#add-button');
addButton.addEventListener('click', () => {
  const newCategory = document.querySelector('#new-category').value;
  const categoryExists = categoriesCount.some(categoryInfo => categoryInfo.category === newCategory);

  if (categoryExists) {
    console.log('The category already exists.');
    return;
  }

  if (newCategory) {
    fetch(`http://localhost:3000/categories?categoryName=${encodeURIComponent(newCategory)}`, {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Category added successfully:', data);
      fetchCategories(); // Refresh the categories list
    })
    .catch(error => {
      console.error('Error adding category:', error);
    });
  } else {
    alert('Please enter a valid input for the new category.');
  }
});

fetchCategories();