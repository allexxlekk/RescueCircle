const dbConnection = require('../config/db');

const categoryExists = async (categoryName) => {
    const checkQuery = 'SELECT COUNT(*) AS count FROM item_category WHERE name = ?';
    const [checkResult] = await dbConnection.promise().query(checkQuery, [categoryName]);
    return checkResult[0].count !== 0
}

const addCategory = async (categoryName) => {
    try {
        if (!await categoryExists(categoryName)) {
            const query = 'INSERT INTO item_category (name) VALUES (?)';
            await dbConnection.promise().query(query, [categoryName]);
            return true; // Category added successfully
        } else {
            return false; // Category already exists
        }
    } catch (err) {
        console.error('Error on add category:', err);
        throw err;
    }
};

const getAllCategories = async () => {
    try {
        const query = 'SELECT * FROM item_category';
        const [result] = await dbConnection.promise().query(query);
        return result;
    } catch (err) {
        console.error('Error get categories:', err);
        throw err;
    }
};

const getCategoryByName = async (categoryName) => {
    try {
        const query = 'SELECT * FROM item_category WHERE name = ?';
        const [category] = await dbConnection.promise().query(query, [categoryName]);
        return category[0];
    } catch (err) {
        console.error('Error get categories:', err);
        throw err;
    }
}

const getItemsCountInCategory = async () => {
    try {
        const query = `
            SELECT item_category.name AS category, COUNT(item.id) AS itemCount
            FROM item_category
                     LEFT JOIN item ON item_category.id = item.category_id
            GROUP BY item_category.name;
        `;
        const [result] = await dbConnection.promise().query(query);
        return result;
    } catch (err) {
        console.error('Error get item counts :', err);
        throw err;
    }
};
module.exports = {
    addCategory, getAllCategories, getItemsCountInCategory, getCategoryByName, categoryExists
};
