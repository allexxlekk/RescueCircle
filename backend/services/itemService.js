const dbConnection = require('../config/db');
const {getCategoryByName} = require("./categoryService");

/**
 * Adds a new item.
 * @param {{name: string, description: string, quantity: number, offer_quantity: number, category: string}} item - The item to add.
 */
const addItem = async (item) => {
    try {
        if (! await itemExists(item)) {
            // Await the result of getCategoryByName
            const category = await getCategoryByName(item.category);

            if (!category) {
                console.error('Category not found:', item.category);
                return false; // Handle category not found
            }

            const categoryId = category.id;
            console.log("category id =", categoryId);

            const query = 'INSERT INTO rescue_circle.item (name, description, quantity, offer_quantity, category_id) VALUES(?, ?, ?, ?, ?)';
            const result = await dbConnection.promise().query(query, [item.name, item.description, item.quantity, item.offer_quantity, categoryId]);
            //TODO add details of item
            return true; // Item added successfully
        } else {
            return false; // Item already exists
        }
    } catch (err) {
        console.error('Error on add item:', err);
        throw err;
    }
};
const getItemDetailsByName = async (name) => {
    try {
        const query = `
        SELECT item.id, item.name, item.description, item.quantity, item_category.name AS categoryName
        FROM item
        INNER JOIN item_category ON item.category_id = item_category.id
        WHERE item.name = ?;
        `;
        const [result] = await dbConnection.promise().query(query,[name]);
        return result;
    } catch (err) {
        console.error('Error get item name :', err);
        throw err;
    }
};

const itemExists = async (item) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM item WHERE name = ?';
    const [checkResult] = await dbConnection.promise().query(checkQuery, [item.name]);
    return checkResult[0].count !== 0
}

module.exports = {
    addItem, itemExists, getItemDetailsByName
};