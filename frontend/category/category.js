
let categoriesCount=[];
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
// Initial render with array categoriesCount
    renderCategories(categoriesCount); 

    const addButton = document.querySelector('#add-button');
    addButton.addEventListener('click', () => {
      
      const newCategory = document.querySelector('#new-category').value;

      const categoryExists = categoriesCount.some(categoryInfo => categoryInfo.category === newCategory);

      if (categoryExists) {
          console.log('The category already exists.');
      }
      
      else if (newCategory) {
        //POST request to add a new category with query parameter
        fetch(`http://localhost:3000/categories?categoryName=${encodeURIComponent(newCategory)}`, {
          method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
          console.log('Category added successfully:', data);
          fetchCategories(categoriesCount); // Re-fetch and render categories after adding a new one
        })
        .catch(error => {
          console.error('Error adding category:', error);
        })}
      
      else {
        alert('Please enter a valid input for the new category.');
      }
    });
fetchCategories();
