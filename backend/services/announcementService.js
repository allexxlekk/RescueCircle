const dbConnection = require("../config/db");
/**
 * JSON Request
 *
 * @typedef {Object} newAnnouncement
 * @property {string} name
 * @property {number} description
 * @property {list} items
 */
const createAnnouncement = async (newAnnouncement) => {
    try {
        let items = newAnnouncement.items.filter(onlyUnique);
        const announcementInsert =
            "INSERT INTO announcement (name, description) VALUES (?,?)";
        const announcementResult = await dbConnection
            .promise()
            .query(announcementInsert, [
                newAnnouncement.name,
                newAnnouncement.description,
            ]);

        const announcementId = announcementResult[0].insertId;
        const itemInsertQuery =
            "INSERT INTO announcements_needs (announcement_id, item_id) VALUES (?,?)";

        for (const item of items) {
            await dbConnection.promise().query(itemInsertQuery, [announcementId, item]);
        }
        return "Announcement Created Successfully";

    } catch (err) {
        console.error("Error creating announcement:", err);
        throw err;
    }
};

const getAllAnnouncements = async () => {
    try {
        const query = `
            SELECT 
                ann.id, 
                ann.name, 
                ann.description,
                COUNT(o.id) AS offerCount
            FROM 
                announcement AS ann
            LEFT JOIN 
                offer AS o ON ann.id = o.announcement_id
            GROUP BY 
                ann.id, ann.name, ann.description
            ORDER BY 
                ann.id DESC
        `;
        const [announcements] = await dbConnection.promise().query(query);

        // Compare the entered password with the stored password hash
        return announcements;
    } catch (error) {
        // Handle any errors that occur during the database query or password comparison
        console.error("Error authenticating user:", error.message);
        return false; // Authentication failed due to an error
    }
};

const getAnnouncement = async (announcementId) => {
    try {
        const query = `
            SELECT i.name                                       AS itemName,
                   i.id                                         AS itemId,
                   c.name                                       AS itemCategory,
                   i.description                                AS itemDescription,
                   a.id                                         AS announcementId,
                   a.description                                AS announcementDescription,
                   a.name                                       AS announcementName,
                   DATE_FORMAT(a.announcement_date, '%d/%m/%Y') AS announcementDate
            FROM announcement a
                     JOIN announcements_needs an ON a.id = an.announcement_id
                     JOIN item i ON i.id = an.item_id
                     INNER JOIN item_category c ON i.category_id = c.id
            WHERE a.id = ?
        `;

        // Execute the query with the announcementId parameter
        const [results] = await dbConnection.promise().query(query, [announcementId]);

        if (results.length === 0) {
            return null; // No announcement found for the given ID
        }

        // aggregate the item details into a single list within the announcement object.
        return {
            id: results[0].announcementId,
            name: results[0].announcementName,
            description: results[0].announcementDescription,
            date: results[0].announcementDate,
            items: results.map(row => ({
                id: row.itemId,
                name: row.itemName,
                description: row.itemDescription,
                category: row.itemCategory
            }))
        };
    } catch (err) {
        console.error("Error fetching announcement needs:", err);
        throw err;
    }
};


function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

module.exports = {
    createAnnouncement,
    getAllAnnouncements,
    getAnnouncement
};
