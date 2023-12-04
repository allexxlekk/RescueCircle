const dbConnection = require('../config/db');
const {getCategoryByName} = require("./categoryService");

/**
 * Adds a new item and its details.
 * @param {{name: string, description: string, quantity: number, offer_quantity: number, category: string, details: Array<{name: string, value: string}>}} item - The item to add.
 */
const addItem = async (item) => {
    try {
        if (!await itemExists(item)) {
            const category = await getCategoryByName(item.category);

            if (!category) {
                console.error('Category not found:', item.category);
                return false; // Handle category not found
            }

            const categoryId = category.id;

            const insertItemQuery = 'INSERT INTO rescue_circle.item (name, description, quantity, offer_quantity, category_id) VALUES(?, ?, ?, ?, ?)';
            const itemResult = await dbConnection.promise().query(insertItemQuery, [item.name, item.description, item.quantity, item.offer_quantity, categoryId]);

            // Get the inserted item ID
            const itemId = itemResult[0].insertId;

            // Insert each item detail
            const insertDetailQuery = 'INSERT INTO rescue_circle.item_details (name, value, item_id) VALUES(?, ?, ?)';
            for (const detail of item.details) {
                await dbConnection.promise().query(insertDetailQuery, [detail.name, detail.value, itemId]);
            }

            return true; // Item and its details added successfully
        } else {
            return false; // Item already exists
        }
    } catch (err) {
        console.error('Error on add item:', err);
        throw err;
    }
};

const getAllItems = async () => {
    try {
        const query = 'SELECT * FROM item';
        const [result] = await dbConnection.promise().query(query);
        return result;
    } catch (err) {
        console.error('Error get items:', err);
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
        console.error('Error on getting item by name :', err);
        throw err;
    }
};
const searchItems = async (str) => {
    try {
        const query = `
        SELECT item.id, item.name, item.description, item.quantity, item_category.name AS categoryName
        FROM item
        INNER JOIN item_category ON item.category_id = item_category.id
        WHERE item.name LIKE ?;
        `;
        const searchString = '%' + str + '%'; // Add the wildcard character
        const [result] = await dbConnection.promise().query(query, [searchString]);
        return result;
    } catch (err) {
        console.error('Error on searching items:', err);
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
        console.error('Error fetching items by category name:', err);
        throw err;
    }
};

const getItemsByCategoryId = async (categoryId) => {
    try {
        const query = `

            SELECT item.id, item.name, item.description, item.quantity, item_category.name AS category_name
            FROM item
                     INNER JOIN item_category ON item.category_id = item_category.id
            WHERE item_category.id = ?;
        `;
        const [result] = await dbConnection.promise().query(query, [categoryId]);
        return result;
    } catch (err) {
        console.error('Error fetching items by category id:', err);
        throw err;
    }
};


const itemExists = async (item) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM item WHERE name = ?';
    const [checkResult] = await dbConnection.promise().query(checkQuery, [item.name]);
    return checkResult[0].count !== 0
}

module.exports = {
    addItem, itemExists, getItemDetailsByName, getAllItems, getItemsByCategoryName, getItemsByCategoryId, searchItems
};