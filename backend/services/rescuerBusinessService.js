const dbConnection = require('../config/db');

const rescuerBusinessService = {

    getTaskRequests: async (rescuerId) => {
        let query = `
            SELECT r.id,
                   u.full_name                       AS name,
                   u.phone                           AS phone,
                   DATE(r.created_at)                AS date,
                   i.name                            AS item,
                   ic.name                           AS category,
                   r.quantity                        AS amount,
                   IF(ST_Distance_Sphere(
                              POINT(l.longitude, l.latitude),
                              POINT(rescuer_location.longitude, rescuer_location.latitude)
                          ) <= 50, 1, 0)             AS inRange,
                   IF(ri.amount >= r.quantity, 1, 0) AS hasInventory
            FROM request r
                     LEFT JOIN
                 user u ON u.id = r.citizen_id
                     LEFT JOIN
                 user rescuer ON rescuer.id = r.rescuer_id
                     LEFT JOIN
                 location l ON u.location_id = l.id
                     LEFT JOIN
                 location rescuer_location ON rescuer.location_id = rescuer_location.id
                     LEFT JOIN
                 item i ON r.item_id = i.id
                     LEFT JOIN
                 item_category ic ON i.category_id = ic.id
                     LEFT JOIN
                 rescuer_inventory ri ON ri.rescuer_id = r.rescuer_id AND ri.item_id = r.item_id
            WHERE r.rescuer_id = ?
              AND r.status = 'ASSUMED'
        `;

        try {
            const [results] = await dbConnection.promise().query(query, [rescuerId]);

            // Convert inRange and hasInventory from 0/1 to true/false and combine for canComplete
            return results.map(result => ({
                ...result,
                date: result.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                inRange: result.inRange === 1,
                hasInventory: result.hasInventory === 1,
                canComplete: result.inRange === 1 && result.hasInventory === 1
            }));
        } catch (error) {
            console.error('Error fetching task requests:', error);
            throw error;
        }
    },

    getTaskOffers: async (rescuerId) => {
        let query = `
            SELECT o.id,
                   u.full_name           AS name,
                   u.phone               AS phone,
                   o.created_at          AS date,
                   i.name                AS item,
                   ic.name               AS category,
                   o.quantity            AS amount,
                   IF(ST_Distance_Sphere(
                              POINT(l.longitude, l.latitude),
                              POINT(rescuer_location.longitude, rescuer_location.latitude)
                          ) <= 50, 1, 0) AS inRange
            FROM offer o
                     LEFT JOIN
                 user u ON u.id = o.citizen_id
                     LEFT JOIN
                 user rescuer ON rescuer.id = o.rescuer_id
                     LEFT JOIN
                 location l ON u.location_id = l.id
                     LEFT JOIN
                 location rescuer_location ON rescuer.location_id = rescuer_location.id
                     LEFT JOIN
                 item i ON o.item_id = i.id
                     LEFT JOIN
                 item_category ic ON i.category_id = ic.id
            WHERE o.rescuer_id = ?
              AND o.status = 'ASSUMED'
        `;

        try {
            const [results] = await dbConnection.promise().query(query, [rescuerId]);

            return results.map(result => ({
                ...result,
                date: result.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
                inRange: result.inRange === 1,
                canComplete: result.inRange === 1
            }));
        } catch (error) {
            console.error('Error fetching task requests:', error);
            throw error;
        }
    },

    getRequests: async (pending, assumed, rescuerId) => {
        let query = `
            SELECT r.id,
                   l.latitude,
                   l.longitude,
                   r.status,
                   r.rescuer_id AS rescuer
            FROM request r
                     LEFT JOIN user u ON u.id = r.citizen_id
                     LEFT JOIN location l ON u.location_id = l.id
            WHERE 1 = 1`; // This allows us to always add conditions with AND

        let params = [];
        let statusConditions = [];

        if (pending) {
            statusConditions.push('r.status = ?');
            params.push('PENDING');
        }

        if (assumed) {
            statusConditions.push('(r.status = ? AND r.rescuer_id = ?)');
            params.push('ASSUMED', rescuerId);
        }

        if (statusConditions.length > 0) {
            query += ` AND (${statusConditions.join(' OR ')})`;
        }

        // If not assumed, we need to check for null rescuer_id
        if (!assumed) {
            query += ` AND (r.rescuer_id IS NULL OR r.rescuer_id = ?)`;
            params.push(rescuerId);
        }

        try {
            const [results] = await dbConnection.promise().query(query, params);
            return results;
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    },

    getOffers: async (pending, assumed, rescuerId) => {
        let query = `
            SELECT o.id,
                   l.latitude,
                   l.longitude,
                   o.status,
                   o.rescuer_id AS rescuer
            FROM offer o
                     LEFT JOIN
                 user u ON u.id = o.citizen_id
                     LEFT JOIN
                 location l ON u.location_id = l.id
        `;

        let status = []
        if (pending) {
            status.push("PENDING");
        }

        if (assumed) {
            status.push("ASSUMED");
        }

        if (status.length > 0) {
            query += 'WHERE o.status IN (?)'
        }


        try {
            const [results] = await dbConnection.promise().query(query, [status]);
            return results;
        } catch (error) {
            console.error('Error fetching offers:', error);
            throw error;
        }
    },

    getRescuerLocation: async (id) => {
        let query = `
            SELECT u.id,
                   u.username,
                   l.latitude,
                   l.longitude,
                   rv.active_tasks              AS tasks,
                   rv.status,
                   (SELECT JSON_ARRAYAGG(
                                   JSON_OBJECT(
                                           'name', i.name,
                                           'amount', ri.amount,
                                           'category', ic.name
                                       )
                               )
                    FROM rescuer_inventory ri
                             JOIN item i ON ri.item_id = i.id
                             JOIN item_category ic on i.category_id = ic.id
                    WHERE ri.rescuer_id = u.id) AS inventory
            FROM user u
                     LEFT JOIN
                 rescue_vehicle rv ON u.id = rv.rescuer_id
                     LEFT JOIN location l on u.location_id = l.id
            WHERE u.role = ?
              AND u.id = ?
        `;

        try {
            const [results] = await dbConnection.promise().query(query, ["RESCUER", id]);

            if (results.length === 0) {
                throw new Error('Rescuer not found');
            }

            const rescuer = results[0];

            // Ensure inventory is an array
            rescuer.inventory = Array.isArray(rescuer.inventory) ? rescuer.inventory : [];

            return rescuer;
        } catch (error) {
            console.error('Error fetching rescuer:', error);
            throw error;
        }
    },

    updateRescuerLocation: async (rescuerId, latitude, longitude) => {
        try {
            // Check if a location exists for this rescuer
            const checkLocationQuery = "SELECT location_id FROM user WHERE id = ?";
            const [locationResult] = await dbConnection
                .promise()
                .query(checkLocationQuery, [rescuerId]);

            if (locationResult[0] && locationResult[0].location_id) {
                // Update existing location
                const updateLocationQuery = `
                UPDATE location 
                SET latitude = ?, longitude = ? 
                WHERE id = ?
            `;
                await dbConnection
                    .promise()
                    .query(updateLocationQuery, [latitude, longitude, locationResult[0].location_id]);
            } else {
                // Insert new location
                const insertLocationQuery = "INSERT INTO location (latitude, longitude) VALUES (?, ?)";
                const [insertResult] = await dbConnection
                    .promise()
                    .query(insertLocationQuery, [latitude, longitude]);

                // Update user with new location_id
                const updateUserQuery = "UPDATE user SET location_id = ? WHERE id = ?";
                await dbConnection
                    .promise()
                    .query(updateUserQuery, [insertResult.insertId, rescuerId]);
            }

            return true;
        } catch (err) {
            console.error("Error on updating rescuer location:", err);
            throw err;
        }
    },

    isNearBase: async (rescuerId) => {
        try {
            const query = `
                SELECT 
                    ST_Distance_Sphere(
                        POINT(base.longitude, base.latitude),
                        POINT(rescuer.longitude, rescuer.latitude)
                    ) AS distance,
                    IF(ST_Distance_Sphere(
                        POINT(base.longitude, base.latitude),
                        POINT(rescuer.longitude, rescuer.latitude)
                    ) <= 100, TRUE, FALSE) AS inRange
                FROM 
                    location AS base,
                    user AS u
                    JOIN location AS rescuer ON u.location_id = rescuer.id
                WHERE 
                    base.id = 1 AND u.id = ?
            `;

            const [result] = await dbConnection.promise().query(query, [rescuerId]);

            if (result.length === 0) {
                throw new Error('Rescuer or base location not found');
            }

            const { distance, inRange } = result[0];

            return {
                isNearBase: inRange === 1, // Convert 1/0 to true/false
                distance: Math.round(distance)
            };
        } catch (err) {
            console.error("Error checking if rescuer is near base:", err);
            throw err;
        }
    }

};

module.exports = rescuerBusinessService;
