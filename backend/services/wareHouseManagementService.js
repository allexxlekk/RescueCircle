const dbConnection = require('../config/db');
const wareHouseManagementService = {

    getItemsByCategory: async (categoryId, search) => {
        let query = `
            SELECT id,
                   name,
                   description,
                   quantity,
                   offer_quantity as offerQuantity
            FROM item
            WHERE category_id = ?
        `;

        const params = [];
        params.push(categoryId);

        if (search) {
            query += ` AND name LIKE ?`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY name ASC`;

        try {
            const [results] = await dbConnection.promise().query(query, params);
            return results;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    updateItemQuantity: async (itemId, quantity) => {
        let query = `
            UPDATE item
            SET quantity = ?
            WHERE id = ?
        `;

        const params = [];
        params.push(quantity, itemId);


        try {
            await dbConnection.promise().query(query, params);
        } catch (error) {
            console.error('Error updating item quantity:', error);
            throw error;
        }
    },

    getCategories: async (search) => {
        let query = `
            SELECT ic.id,
                   ic.name,
                   COUNT(i.id) AS items
            FROM item_category ic
                     LEFT JOIN
                 item i ON ic.id = i.category_id
        `;

        let params = [];

        if (search) {
            query += `WHERE ic.name LIKE ? `;
            params.push(`%${search}%`);
        }

        query += `
            GROUP BY 
                ic.id, ic.name
            ORDER BY 
                ic.name ASC
        `;

        try {
            const [results] = await dbConnection.promise().query(query, params);
            return results;
        } catch (error) {
            throw error;
        }
    },

    addItem: async (name,
                    categoryId,
                    description,
                    quantity,
                    offerQuantity
    ) => {
        try {


            // Insert the new category
            const [result] = await dbConnection.promise().query(
                'INSERT INTO item (name, description, quantity, offer_quantity, category_id) VALUES (?, ?, ?, ?, ?)',
                [name, description, quantity, offerQuantity, categoryId]
            );

            return result.insertId; // Return the ID of the newly inserted item
        } catch (error) {
            throw error;
        }
    },

    addCategory: async (name) => {
        try {
            // Check if a category with this name exists (case-insensitive)
            const [existingCategories] = await dbConnection.promise().query(
                'SELECT id FROM item_category WHERE LOWER(name) = LOWER(?)',
                [name]
            );

            if (existingCategories.length > 0) {
                return null; // Category already exists
            }

            // Insert the new category
            const [result] = await dbConnection.promise().query(
                'INSERT INTO item_category (name) VALUES (?)',
                [name]
            );

            return result.insertId; // Return the ID of the newly inserted category
        } catch (error) {
            throw error;
        }
    },

    editCategoryName: async (id, name) => {
        try {
            // Check if a category with this name exists (case-insensitive)
            const [existingCategories] = await dbConnection.promise().query(
                'SELECT id FROM item_category WHERE LOWER(name) = LOWER(?)',
                [name]
            );

            if (existingCategories.length > 0) {
                return null; // Category already exists
            }

            // Update category name
            await dbConnection.promise().query(
                'UPDATE item_category SET name = ? WHERE id = ?',
                [name, id]
            );

            return id;
        } catch (error) {
            throw error;
        }
    },
    deleteCategory: async (id) => {
        try {
            // Check if a category is assigned to items
            const [assignedItems] = await dbConnection.promise().query(
                'SELECT id FROM item WHERE category_id = ?',
                [id]
            );

            if (assignedItems.length > 0) {
                return false; // Cannot delete category
            }

            // Delete Category
            await dbConnection.promise().query(
                'DELETE FROM item_category WHERE id = ?',
                [id]
            );

            return true;
        } catch (error) {
            throw error;
        }
    },
    isCategoryNameAvailable: async (name) => {
        try {
            const [existingCategories] = await dbConnection.promise().query(
                'SELECT id FROM item_category WHERE LOWER(name) = LOWER(?)',
                [name]
            );

            return existingCategories.length <= 0;

        } catch (error) {
            throw error;
        }
    },
};

module.exports = wareHouseManagementService;
