// API CALLS //
async function fetchItems() {
  try {
    const response = await fetch("http://localhost:3000/items");

    return await response.json(); // Return the data
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}

async function fetchItemById(itemId) {
  try {
    const response = await fetch(`http://localhost:3000/items/${itemId}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
}

async function syncItems() {
  try {
    await fetch("http://localhost:3000/items/sync", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(undefined),
    });
  } catch (error) {
    console.error("Sync error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}

async function fetchCategories() {
  const response = await fetch("http://localhost:3000/categories");
  const data = await response.json();
  return data.categories;
}

async function fetchItemsBySearch(name) {
  try {
    let response;
    if (name === "" || name === undefined || name === null) {
      response = await fetchItems();
      return response;
    } else {
      response = await fetch(`http://localhost:3000/items/search?str=${name}`);
      return await response.json(); // Return the data
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}

async function fetchItemsByCategoryId(categoryId) {
  try {
    const response = await fetch(
      `http://localhost:3000/items/byCategory?id=${categoryId}`
    );

    const data = await response.json();
    console.log("Data received:", data);
    return data; // Return the data
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}

async function fetchItemsByCategoryIdAndSearch(categoryId, searchString) {
  try {
    let response;
    console.log("SearchString:", searchString);
    if (searchString === "" || searchString === undefined) {
      response = await fetchItemsByCategoryId(categoryId);
      return response;
    } else {
      response = await fetch(
        `http://localhost:3000/items/search?str=${searchString}&categoryId=${categoryId}`
      );
      return await response.json(); // Return the data
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw error; // Re-throw the error to be caught in the higher level
  }
}

const fetchItemAvailability = async (itemName) => {
  if (itemName === "") {
    return false;
  } else
    try {
      const response = await fetch(
        "http://localhost:3000/items/isAvailable?itemName=" +
        encodeURIComponent(itemName)
      );
      const addedItem = await response.json();
      return addedItem.isAvailable;
    } catch (error) {
      console.error("Error while adding Item:", error);
      return false;
    }
};
// API CALLS //

// EVENT LISTENERS //
async function filterItemsByCategory(categoryId) {
  let items;

  if (categoryId === "all") items = await fetchItems();
  else items = await fetchItemsByCategoryId(categoryId);

  showItems(items);
}

async function filterItemsBySearch(searchString, categoryId) {
  let items;
  if (categoryId === "all") {
    items = await fetchItemsBySearch(searchString);
  } else {
    items = await fetchItemsByCategoryIdAndSearch(categoryId, searchString);
  }
  showItems(items);
}

async function synchronizeItemList() {
  let items;
  await syncItems();
  items = await fetchItems();
  showItems(items);
}

// EVENT LISTENERS //

const editButton = document.getElementById("edit-button");
const addButton = document.getElementById("add-button");
const saveButton = document.getElementById("save-button");
const form = document.getElementById("item-form");
const cancelButton = document.getElementById("cancel-button");
let selectedItemId;
let originalItemDetails = {};

document.addEventListener("DOMContentLoaded", async () => {
  // Show items at the start
  let items = await fetchItems();
  showItems(items);

  // Initialize the category filter dropdown
  let categories = await fetchCategories();
  createCategoryFilterElement(categories);

  const categoryFilter = document.getElementById("category-filter");
  const searchFilter = document.getElementById("search-filter");
  const syncButton = document.getElementById("synchronize-button");

  // Initial state: editable
  toggleEditState(false);


  // Edit button click event handler
  editButton.addEventListener("click", function () {
    toggleEditState(true);
  });

  addButton.addEventListener("click", function () {

    console.log('state true')
  });

  // Form submit event handler
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    await editItem();
    items = await fetchItems();
    showItems(items);
    // Here you can handle form submission, for example, by sending data to the server via AJAX
    toggleEditState(false); // Switch back to read-only mode after saving

  });

  // Cancel button click event handler
  cancelButton.addEventListener("click", function () {
    // Reset form fields to original values
    document.getElementById("detail-name").value = originalItemDetails.name;

    document.getElementById("detail-description").value =
      originalItemDetails.description;
    document.getElementById("detail-quantity").value =
      originalItemDetails.quantity;
    document.getElementById("detail-offer-quantity").value =
      originalItemDetails.offer_quantity;

    const categoryDropdown = document.getElementById("detail-category");
    const options = categoryDropdown.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].text === originalItemDetails.category_name) {
        options[i].selected = true;
        break;
      }
    }
    // Switch back to read-only mode
    toggleEditState(false);
  });

  categoryFilter.addEventListener("change", async (e) => {
    await filterItemsByCategory(e.target.value);
    searchFilter.value = "";
  });

  searchFilter.addEventListener(
    "input",
    debounce(async (e) => {
      const searchString = e.target.value;
      const categoryId = categoryFilter.value;
      await filterItemsBySearch(searchString, categoryId);
    }, 300)
  );

  syncButton.addEventListener(
    "click",
    debounce(async () => {
      searchFilter.value = "";
      createCategoryFilterElement(await fetchCategories());
      await synchronizeItemList();
    }, 300)
  );
});

// HELPER FUNCTIONS //

const editItem = async () => {
  const name = document.getElementById("detail-name").value;
  const description = document.getElementById("detail-description").value;
  const quantity = document.getElementById("detail-quantity").value;
  const offer_quantity = document.getElementById("detail-offer-quantity").value;
  const categoryDropdown = document.getElementById("detail-category");
  const category =
    categoryDropdown.options[categoryDropdown.selectedIndex].text;

  const newItem = {
    id: selectedItemId,
    name: name,
    description: description,
    quantity: quantity,
    category: category,
    offer_quantity: offer_quantity,
  };

  const postResponse = await fetch("http://localhost:3000/items", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });

  await showItemDetails(selectedItemId);
};

const AddItem = async () => {
  const name = document.getElementById("detail-name").value;
  name.value = 0;
  const description = document.getElementById("detail-description").value;
  description.value = 0;
  const quantity = document.getElementById("detail-quantity").value;
  const offer_quantity = document.getElementById("detail-offer-quantity").value;
  const categoryDropdown = document.getElementById("detail-category");
  const category =
    categoryDropdown.options[categoryDropdown.selectedIndex].text;


  const newItem = {
    id: selectedItemId,
    name: name,
    description: description,
    quantity: quantity,
    category: category,
    offer_quantity: offer_quantity,
  };

  const postResponse = await fetch("http://localhost:3000/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });

  await showItemDetails(selectedItemId);
};

function showItems(items) {
  const itemListElement = document.getElementById("item-list");
  itemListElement.innerHTML = "";

  items.forEach((item) => {
    // Create the list item
    let itemElement = createItemElement(item);
    // Add it to the list
    itemListElement.appendChild(itemElement);
    itemListElement.appendChild(document.createElement("br"));
  });
}

function toggleEditState(editable) {
  const inputs = form.querySelectorAll("input, textarea, select");
  inputs.forEach((input) => {
    if (input.tagName.toLowerCase() === "select") {
      input.disabled = !editable;
    } else {
      input.readOnly = !editable;
    }
  });

  // Toggle visibility of buttons
  editButton.style.display = editable ? "none" : "inline";
  saveButton.style.display = editable ? "inline" : "none";
  cancelButton.style.display = editable ? "inline" : "none";
}

function toggleAddState() {
  const inputs = form.querySelectorAll("input, textarea, select");

  inputs.forEach(input => {
    input.value = '';

  });
}

async function showItemDetails(itemId) {
  try {
    // Fetch item details using the correct endpoint with the itemId parameter
    const item = await fetchItemById(itemId);

    // Store original item details
    originalItemDetails = { ...item };
    selectedItemId = itemId;

    // Populate item details in the form fields
    document.getElementById("detail-name").value = item.name;

    // Fetch categories from API and populate the dropdown
    const categories = await fetchCategories();
    const categoryDropdown = document.getElementById("detail-category");
    categoryDropdown.innerHTML = ""; // Clear previous options
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.text = category.name;
      categoryDropdown.appendChild(option);
    });

    // Preselect the category based on item's category name
    const preselectedCategory = categories.find(
      (category) => category.name === item.category_name
    );
    if (preselectedCategory) {
      categoryDropdown.value = preselectedCategory.id;
    }

    document.getElementById("detail-description").value = item.description;
    document.getElementById("detail-quantity").value = item.quantity;
    document.getElementById("detail-offer-quantity").value =
      item.offer_quantity;
  } catch (error) {
    // Handle errors during the fetch
    console.error("Error fetching the item:", error);
  }
}

function createItemElement(item) {
  const itemElement = document.createElement("li");
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

  itemElement.addEventListener("click", async () => {
    await showItemDetails(itemElement.id);
  });

  return itemElement;
}

function createCategoryFilterElement(categories) {
  const categoryFilter = document.getElementById("category-filter");
  categoryFilter.innerHTML = "";

  const option = document.createElement("option");
  option.value = "all";
  option.textContent = "All Categories";

  categoryFilter.appendChild(option);
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categoryFilter.appendChild(option);
  });
}

function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}
