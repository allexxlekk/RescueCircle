const apiUtils = {
  // ITEMS
  async fetchItems() {
    try {
      const response = await fetch("http://localhost:3000/items");

      return await response.json(); // Return the data
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error to be caught in the higher level
    }
  },
  async editItem(item){
    try {
      await fetch("http://localhost:3000/items", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });
    } catch (error) {
      console.error("Sync error:", error);
      throw error; // Re-throw the error to be caught in the higher level
    }
  },
  async fetchItemById(itemId) {
    try {
      const response = await fetch(`http://localhost:3000/items/${itemId}`);
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
  async fetchItemsBySearch(name) {
    try {
      let response;
      if (name === "" || name === undefined || name === null) {
        response = await fetchItems();
        return response;
      } else {
        response = await fetch(
          `http://localhost:3000/items/search?str=${name}`
        );
        return await response.json(); // Return the data
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error; // Re-throw the error to be caught in the higher level
    }
  },
  async fetchItemsByCategoryId(categoryId) {
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
  },
  async fetchItemsByCategoryIdAndSearch(categoryId, searchString) {
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
  },
  async fetchItemAvailability(itemName) {
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
  },
  async syncItems() {
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
  },
  // CATEGORIES
  async fetchCategories() {
    const response = await fetch("http://localhost:3000/categories");
    const data = await response.json();
    return data.categories;
  },
  debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    }
  },
};

export default apiUtils;
