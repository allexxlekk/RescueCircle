const dbConnection = require("../config/db");
const { getCategoryByName, addCategory } = require("./categoryService");

/**
 * Adds a new item and its details.
 * @param {{name: string, description: string, quantity: number, offer_quantity: number, category: string, details: Array<{detail_name: string, detail_value: string}>}} item - The item to add.
 */
const addItem = async (item) => {
  try {
    if (!(await itemExists(item))) {
      const category = await getCategoryByName(item.category);

      if (!category) {
        console.error("Category not found:", item.category);
        return false; // Handle category not found
      }

      const categoryId = category.id;

      const insertItemQuery =
        "INSERT INTO rescue_circle.item (name, description, quantity, offer_quantity, category_id) VALUES(?, ?, ?, ?, ?)";
      const itemResult = await dbConnection
        .promise()
        .query(insertItemQuery, [
          item.name,
          item.description,
          item.quantity,
          item.offer_quantity,
          categoryId,
        ]);

      // Get the inserted item ID
      const itemId = itemResult[0].insertId;

      if (item.details !== undefined && item.details.length > 0) {
        // Insert each item detail
        const insertDetailQuery =
          "INSERT INTO rescue_circle.item_details (name, value, item_id) VALUES(?, ?, ?)";
        for (const detail of item.details) {
          await dbConnection
            .promise()
            .query(insertDetailQuery, [
              detail.detail_name,
              detail.detail_value,
              itemId,
            ]);
        }
      }

      return true; // Item and its details added successfully
    } else {
      return false; // Item already exists
    }
  } catch (err) {
    console.error("Error on add item:", err);
    throw err;
  }
};

/**
 * Adds a new item and its details.
 * @param {{name: string, description: string, quantity: number, offer_quantity: number, category: string}} item - The item to add.
 */
const editItem = async (item) => {
  try {
    const category = await getCategoryByName(item.category);

    if (!category) {
      console.error("Category not found:", item.category);
      return false; // Handle category not found
    }

    const categoryId = category.id;

    const insertItemQuery =
      "UPDATE rescue_circle.item SET name = ?, description = ?, quantity = ?, category_id = ? WHERE id = ?";
    const itemResult = await dbConnection
      .promise()
      .query(insertItemQuery, [
        item.name,
        item.description,
        item.quantity,
        categoryId,
        item.id,
      ]);

    return true; // Item and its details added successfully
  } catch (err) {
    console.error("Error on add item:", err);
    throw err;
  }
};

const getAllItems = async () => {
  try {
    const query = `
            SELECT item.id, item.name, item.description, item.quantity,item.category_id, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id;
        `;
    const [result] = await dbConnection.promise().query(query);
    return result;
  } catch (err) {
    console.error("Error get items:", err);
    throw err;
  }
};

const getBaseItems = async () => {
  try {
    const query = `
            SELECT item.id, item.name, item.description, item.quantity,item.category_id, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item.quantity > 0;
        `;
    const [result] = await dbConnection.promise().query(query);
    return result;
  } catch (err) {
    console.error("Error get items:", err);
    throw err;
  }
};

const changeItemQuantity = async (itemId, quantity) => {
  try {
    const query = `UPDATE item SET quantity = ? WHERE id = ?;`;

    console.log("Before query");
    const reult = await dbConnection.promise().query(query, [quantity, itemId]);
    console.log("After query");
  } catch (err) {
    console.error("Error updating item quantity:", err);
    throw err;
  }
};

const getItemDetailsByName = async (name) => {
  try {
    // toDo: Also fetch item details
    // const query = `
    //     SELECT item.id, item.name, item.description, item.quantity, item_category.name AS categoryName, item_details.name AS detailName, item_details.value AS detailValue
    //     FROM item
    //              INNER JOIN item_category ON item.category_id = item_category.id
    //              RIGHT JOIN item_details ON item.id = item_details.item_id
    //     WHERE item.name = ?;
    // `;
    const query = `
            SELECT item.id, item.name, item.description, item.quantity, item_category.name AS categoryName
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item.name = ?;
        `;
    const [result] = await dbConnection.promise().query(query, [name]);
    return result;
  } catch (err) {
    console.error("Error on getting item by name :", err);
    throw err;
  }
};

const getItemById = async (id) => {
  try {
    const query = `
            SELECT item.id, item.name, item.description, item.category_id, item.quantity, item_category.name AS category_name, item.offer_quantity
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item.id = ?;
        `;
    const [result] = await dbConnection.promise().query(query, [id]);
    return result[0];
  } catch (err) {
    console.error("Error on getting item by name :", err);
    throw err;
  }
};

const getItemsByCategoryName = async (categoryName) => {
  try {
    const query = `

            SELECT item.id, item.name, item.description, item.quantity, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item_category.name = ?;
        `;
    const [result] = await dbConnection.promise().query(query, [categoryName]);
    return result;
  } catch (err) {
    console.error("Error fetching items by category name:", err);
    throw err;
  }
};

const getItemsByCategoryId = async (categoryId) => {
  try {
    const query = `

            SELECT item.id, item.name, item.description,item.category_id, item.quantity, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item_category.id = ?;
        `;
    const [result] = await dbConnection.promise().query(query, [categoryId]);
    return result;
  } catch (err) {
    console.error("Error fetching items by category id:", err);
    throw err;
  }
};

const itemExists = async (item) => {
  const checkQuery = "SELECT COUNT(*) AS count FROM item WHERE name = ?";
  const [checkResult] = await dbConnection
    .promise()
    .query(checkQuery, [item.name]);
  return checkResult[0].count !== 0;
};

const searchItems = async (str, categoryId) => {
  try {
    if (categoryId === undefined || categoryId === null || categoryId === "") {
      const query = `
            SELECT item.id, item.name, item.description,item.category_id, item.quantity, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item.name LIKE ?;
        `;

      const searchString = "%" + str + "%"; // Add the wildcard character
      const [result] = await dbConnection
        .promise()
        .query(query, [searchString]);
      return result;
    } else {
      const query = `
                SELECT item.id, item.name, item.description,item.category_id, item.quantity, item_category.name AS category_name
                FROM item
                         INNER JOIN item_category ON item.category_id = item_category.id
                WHERE item.name LIKE ? AND item.category_id = ?;
            `;

      const searchString = "%" + str + "%"; // Add the wildcard character
      const [result] = await dbConnection
        .promise()
        .query(query, [searchString, categoryId]);
      return result;
    }
  } catch (err) {
    console.error("Error on searching items:", err);
    throw err;
  }
};
const checkItemAvailability = async (itemName) => {
  try {
    const query = "SELECT * FROM item WHERE name = ?";
    const [result] = await dbConnection.promise().query(query, [itemName]);
    // If result is empty, the item is not available
    return result.length !== 0;
  } catch (err) {
    console.error("Error checking item availability:", err);
    throw err;
  }
};
/**
 * Represents the JSON data object containing categories and items.
 *
 * @typedef {Object} JsonData
 * @property {number} code - The status code.
 * @property {string} message - A message indicating the status.
 * @property {Array<Category>} categories - An array of category objects.
 * @property {Array<Item>} items - An array of item objects.
 
 * Represents a category object within the JSON data.
 *
 * @typedef {Object} Category
 * @property {string} id - The unique identifier for the category.
 * @property {string} category_name - The name of the category.
 
 * Represents an item object within the JSON data.
 *
 * @typedef {Object} Item
 * @property {string} id - The unique identifier for the item.
 * @property {string} name - The name of the item.
 * @property {string} category - The ID of the category to which the item belongs.
 * @property {Array<ItemDetail>} details - An array of detail objects associated with the item.
 
 * Represents a detail object associated with an item within the JSON data.
 *
 * @typedef {Object} ItemDetail
 * @property {string} detail_name - The name of the detail.
 * @property {string} detail_value - The value of the detail.
 */
const uploadFromOnlineDatabase = async (jsonData) => {
  for (const category of jsonData.categories) {
    if (validateName(category.category_name)) {
      const newCategoryName = category.category_name.trim();
      await addCategory(newCategoryName);
    }
  }
  for (const item of jsonData.items) {
    if (validateName(item.name)) {
      const category = jsonData.categories.find(
        (category) => category.id === item.category
      );
      if (category) {
        item.category = category.category_name;
        console.log(item);
        await addItem(item);
      } else {
        console.error("Category not found for item:", item);
      }
    }
  }
};

function validateName(name) {
  // Check if the name is undefined or empty
  if (name === undefined || name.trim() === "") {
    return false;
  }
  // Check if the name contains only letters, numbers, or spaces (no special symbols)
  return /^[a-zA-Z0-9\s]*$/.test(name);
}

module.exports = {
  addItem,
  itemExists,
  getItemDetailsByName,
  getAllItems,
  getItemsByCategoryName,
  getItemsByCategoryId,
  searchItems,
  uploadFromOnlineDatabase,
  checkItemAvailability,
  getItemById,
  changeItemQuantity,
  editItem,
  getBaseItems
};
