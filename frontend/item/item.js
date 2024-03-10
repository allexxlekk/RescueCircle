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

async function showItemDetails(itemId) {
  try {
    // Fetch item details using the correct endpoint with the itemId parameter
    const item = await fetchItemById(itemId);

    // Populate item details on the page
    document.getElementById("detail-name").textContent = item.name;
    document.getElementById("detail-category").textContent = item.category_name;
    document.getElementById("detail-description").textContent =
      item.description;
    document.getElementById("detail-quantity").textContent = item.quantity;
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
