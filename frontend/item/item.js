import apiUtils from "../utils/apiUtils.mjs";


// GLOBALS
const editButton = document.getElementById("edit-button");
const saveButton = document.getElementById("save-button");
const form = document.getElementById("item-form");
const cancelButton = document.getElementById("cancel-button");
let selectedItemId;
let originalItemDetails = {};

// EVENT LISTENERS //
async function filterItemsByCategory(categoryId) {
  let items;

  if (categoryId === "all") items = await apiUtils.fetchItems();
  else items = await apiUtils.fetchItemsByCategoryId(categoryId);

  showItems(items);
}

async function filterItemsBySearch(searchString, categoryId) {
  let items;
  if (categoryId === "all") {
    items = await apiUtils.fetchItemsBySearch(searchString);
  } else {
    items = await apiUtils.fetchItemsByCategoryIdAndSearch(
      categoryId,
      searchString
    );
  }
  showItems(items);
}

async function synchronizeItemList() {
  let items;
  await apiUtils.syncItems();
  items = await apiUtils.fetchItems();
  showItems(items);
}

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

  await apiUtils.editItem(newItem);

  await showItemDetails(selectedItemId);
};

// HELPER FUNCTIONS //
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

async function showItemDetails(itemId) {
  try {
    // Fetch item details using the correct endpoint with the itemId parameter
    const item = await apiUtils.fetchItemById(itemId);

    // Store original item details
    originalItemDetails = { ...item };
    selectedItemId = itemId;

    // Populate item details in the form fields
    document.getElementById("detail-name").value = item.name;

    // Fetch categories from API and populate the dropdown
    const categories = await apiUtils.fetchCategories();
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

// MAIN
document.addEventListener("DOMContentLoaded", async () => {
  // Show items at the start
  let items = await apiUtils.fetchItems();
  showItems(items);

  // Initialize the category filter dropdown
  let categories = await apiUtils.fetchCategories();
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

  // Form submit event handler
  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    await editItem();
    items = await apiUtils.fetchItems();
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
    apiUtils.debounce(async (e) => {
      const searchString = e.target.value;
      const categoryId = categoryFilter.value;
      await filterItemsBySearch(searchString, categoryId);
    }, 300)
  );

  syncButton.addEventListener(
    "click",
    apiUtils.debounce(async () => {
      searchFilter.value = "";
      createCategoryFilterElement(await apiUtils.fetchCategories());
      await synchronizeItemList();
    }, 300)
  );
});
