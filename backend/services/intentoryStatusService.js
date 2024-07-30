const dbConnection = require('../config/db');

const inventoryStatusService = {
    getItems: async (categories, search) => {
        let query = `
        SELECT 
            i.id, 
            i.name, 
            IFNULL(i.description, '') AS description, 
            ic.name AS category, 
            i.quantity, 
            CAST(COALESCE(SUM(ri.amount), 0) AS SIGNED) AS rescuerQuantity 
        FROM 
            item i 
        LEFT JOIN 
            item_category ic ON i.category_id = ic.id 
        LEFT JOIN 
            rescuer_inventory ri ON i.id = ri.item_id 
        WHERE 1=1
    `;

        const params = [];

        if (search) {
            query += ` AND i.name LIKE ?`;
            params.push(`%${search}%`);
        }

        if (categories && categories.length > 0) {
            query += ` AND i.category_id IN (?)`;
            params.push(categories);
        }

        query += `
        GROUP BY 
            i.id, i.name, i.description, ic.name, i.quantity 
        ORDER BY 
            i.name
    `;

        try {
            const [results] = await dbConnection.promise().query(query, params);
            return results;
        } catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    },

    getCategories: async () => {
        let query = `
            SELECT
                ic.id,
                ic.name,
                COUNT(i.id) AS items
            FROM
                item_category ic
                    LEFT JOIN
                item i ON ic.id = i.category_id
            GROUP BY
                ic.id, ic.name
            ORDER BY
                ic.name
        `;
        try {
            const [results] = await dbConnection.promise().query(query);
            return results;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

};

module.exports = inventoryStatusService;
