const dbConnection = require('../config/db');
const bcrypt = require("bcrypt");
const locationService = require("./locationService");

const rescuerManagementService = {
    createRescuer: async (username, name, email, password, phone, vehicleType) => {
        try {
            // Encrypt Password
            const hashedPassword = await bcrypt.hash(password, 10);

            const baseCoordinates = await locationService.baseLocation();
            let lat = baseCoordinates[0].latitude;
            let lng = baseCoordinates[0].longitude;

            const locationInsert =
                "INSERT INTO location (latitude, longitude) VALUES (?,?)";
            const locationResult = await dbConnection
                .promise()
                .query(locationInsert, [lat, lng]);

            const locationId = locationResult[0].insertId;
            const query =
                "INSERT INTO user (username, password, role, full_name, email, phone, location_id) VALUES (?,?,?,?,?,?,?)";
            const userResult = await dbConnection
                .promise()
                .query(query, [
                    username,
                    hashedPassword,
                    "RESCUER",
                    name,
                    email,
                    phone,
                    locationId,
                ]);


            const rescuerId = userResult[0].insertId;

            const vehicleInsert =
                "INSERT INTO rescue_vehicle (type, rescuer_id) VALUES (?, ?)";
            await dbConnection.promise().query(vehicleInsert, [vehicleType, rescuerId]);

            return rescuerId;
        } catch (err) {
            if (err.code === "ER_DUP_ENTRY") {
                // Handle duplicate entry error (email or username already exists)
                console.error("Duplicate entry:", err.message);
                throw new Error("User with the same email or username already exists.");
            } else {
                // Handle other database errors
                console.error("Error registering user:", err);
                throw err;
            }
        }
    },

    getRescuers: async () => {
        let query = `
            SELECT u.id,
                   u.full_name     AS name,
                   u.username      AS username,
                   u.email         AS email,
                   u.phone,
                   rv.status,
                   rv.type         AS vehicleType,
                   rv.active_tasks AS tasks
            FROM user u
                     LEFT JOIN
                 rescue_vehicle rv ON u.id = rv.rescuer_id
            WHERE u.role = ?
            ORDER BY u.full_name
        `;
        try {
            const [results] = await dbConnection.promise().query(query, ["RESCUER"]);
            return results;
        } catch (error) {
            console.error('Error fetching rescuers:', error);
            throw error;
        }
    },

    getRescuerInventory: async (id) => {
        let query = `
            SELECT ri.amount,
                   i.name AS item
            FROM rescuer_inventory ri
                     LEFT JOIN
                 item i ON i.id = ri.item_id
            WHERE ri.rescuer_id = ?
            ORDER BY i.name
        `;
        try {
            const [results] = await dbConnection.promise().query(query, [id]);
            return results;
        } catch (error) {
            console.error('Error fetching inventory:', error);
            throw error;
        }
    }

};

module.exports = rescuerManagementService;
