const dbConnection = require('../config/db');
const {getCategoryByName} = require("./categoryService");

/**
 * Adds a new item.
 * @param {{name: string, category: string}} item - The item to add.
 */
const addItem = async (item) => {
    try {
        if (! await itemExists(item)) {
            const categoryId = getCategoryByName(item.category).id
            console.log(categoryId);

            //TODO add item details also
            return true; // Item added successfully
        } else {
            return false; // Item already exists
        }
    } catch (err) {
        console.error('Error on add item:', err);
        throw err;
    }
};

const itemExists = async (item) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM item WHERE name = ?';
    const [checkResult] = await dbConnection.promise().query(checkQuery, [item.name]);
    return checkResult[0].count !== 0
}

module.exports = {
    addItem, itemExists
};