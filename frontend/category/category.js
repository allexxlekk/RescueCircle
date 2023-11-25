  function renderCategories(categoriesCount) {
      const container = document.querySelector('#container');
      container.innerHTML = ''; 

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

    renderCategories([]); // Initial render with an empty array

    const addButton = document.querySelector('#add-button');
    addButton.addEventListener('click', () => {
      // Assuming you have an input field for the new category
      const newCategory = document.querySelector('#new-category').value;

      // Validate input (you may want to add more thorough validation)
      if (newCategory) {
        // Perform your POST request to add a new category with query parameter
        fetch(`http://localhost:3000/categories?categoryName=${encodeURIComponent(newCategory)}`, {
          method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
          console.log('Category added successfully:', data);
          fetchCategories(); // Re-fetch and render categories after adding a new one
        })
        .catch(error => {
          console.error('Error adding category:', error);
        });
      } else {
        alert('Please enter a valid input for the new category.');
      }
    });