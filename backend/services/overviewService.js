const dbConnection = require('../config/db');

const overviewService = {
    getRequests: async (pending, assumed) => {
        let query = `
            SELECT r.id,
                   l.latitude,
                   l.longitude,
                   r.status,
                   r.rescuer_id AS rescuer
            FROM request r
                     LEFT JOIN
                 user u ON u.id = r.citizen_id
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
            query += 'WHERE r.status IN (?)'
        }


        try {
            const [results] = await dbConnection.promise().query(query, [status]);
            return results;
        } catch (error) {
            console.error('Error fetching requests:', error);
            throw error;
        }
    },

    getOffers: async (pending, assumed) => {
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

    getRescuers: async (active, inactive) => {
        let query = `
            SELECT u.id,
                   l.latitude,
                   l.longitude,
                   rv.status
            FROM user u
                     LEFT JOIN
                 location l ON u.location_id = l.id
                     LEFT JOIN rescue_vehicle rv on u.id = rv.rescuer_id
            WHERE u.role = ?
        `;

        let status = []
        if (active) {
            status.push("ACTIVE");
        }

        if (inactive) {
            status.push("WAITING");
        }

        if (status.length > 0) {
            query += 'AND rv.status IN (?)'
        }


        try {
            const [results] = await dbConnection.promise().query(query, ["RESCUER", status]);
            return results;
        } catch (error) {
            console.error('Error fetching rescuers:', error);
            throw error;
        }
    },

    getRescuer: async (id) => {
        let query = `
            SELECT u.id,
                   u.username,
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

    getRequest: async (id) => {
        let query = `
            SELECT r.id,
                   r.created_at,
                   r.assumed_at,
                   r.status,
                   i.name            AS itemName,
                   ic.name           AS itemCategory,
                   r.quantity        AS quantity,
                   rescuer.id        AS rescuerId,
                   rescuer.username  AS rescuerUsername,
                   citizen.id        AS citizenId,
                   citizen.full_name AS citizenName,
                   citizen.phone     AS citizenPhone
            FROM request r
                     LEFT JOIN user citizen on r.citizen_id = citizen.id
                     LEFT JOIN user rescuer on r.rescuer_id = rescuer.id
                     LEFT JOIN item i on i.id = r.item_id
                     LEFT JOIN item_category ic on i.category_id = ic.id
            WHERE r.id = ?
        `;

        try {
            const [results] = await dbConnection.promise().query(query, [id]);

            if (results.length === 0) {
                throw new Error('Request not found');
            }

            return results[0];
        } catch (error) {
            console.error('Error fetching request:', error);
            throw error;
        }
    },

    getOffer: async (id) => {
        let query = `
            SELECT o.id,
                   o.created_at,
                   o.assumed_at,
                   o.status,
                   i.name            AS itemName,
                   ic.name           AS itemCategory,
                   o.quantity        AS quantity,
                   rescuer.id        AS rescuerId,
                   rescuer.username  AS rescuerUsername,
                   citizen.id        AS citizenId,
                   citizen.full_name AS citizenName,
                   citizen.phone     AS citizenPhone
            FROM offer o
                     LEFT JOIN user citizen on o.citizen_id = citizen.id
                     LEFT JOIN user rescuer on o.rescuer_id = rescuer.id
                     LEFT JOIN item i on i.id = o.item_id
                     LEFT JOIN item_category ic on i.category_id = ic.id
            WHERE o.id = ?
        `;

        try {
            const [results] = await dbConnection.promise().query(query, [id]);

            if (results.length === 0) {
                throw new Error('Offer not found');
            }

            return results[0];
        } catch (error) {
            console.error('Error fetching offer:', error);
            throw error;
        }
    }

};

module.exports = overviewService;
