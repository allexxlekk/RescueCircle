const bcrypt = require('bcrypt');
const dbConnection = require('../config/db');


const addCategory = async (categoryName) => {
  try {
      const checkQuery = 'SELECT COUNT(*) AS count FROM item_category WHERE name = ?';
      const [checkResult] = await dbConnection.promise().query(checkQuery, [categoryName]);
      if (checkResult[0].count === 0) {
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
  }catch (err) {
    console.error('Error get categories:', err);
      throw err;
  }
};


module.exports = {
    addCategory, getAllCategories
};
