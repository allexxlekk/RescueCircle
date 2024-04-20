const dbConnection = require("../config/db");
const addOffer = async (offerData) => {
    try {
        const query = `
            INSERT INTO offer (item_id, quantity, citizen_id, announcement_id)
            VALUES (?, ?, ?, ?)
        `;
        const values = [
            offerData.itemId,
            offerData.quantity,
            offerData.citizenId,
            offerData.announcementId,
        ];
        await dbConnection.promise().query(query, values);
        return true; // Request added successfully
    } catch (err) {
        console.error("Error on add offer:", err);
        throw err;
    }
};

const cancelOffer = async (offerId) => {
    try {
        const query = `
            DELETE
            FROM offer
            WHERE id = ?
              AND status != 'COMPLETED'
        `;
        await dbConnection.promise().query(query, offerId);
        return true;
    } catch (err) {
        console.error("Error on cancel offer:", err);
        throw err;
    }
};

const fetchOffersForCitizen = async (citizenId) => {
    try {
        const query = `
            SELECT i.name                                  AS itemName,
                   i.id                                    AS itemId,
                   u.id                                    AS citizenId,
                   o.rescuer_id                            AS rescuerId,
                   o.status,
                   o.quantity,
                   o.id                                    AS requestId,
                   u.full_name                             AS fullName,
                   DATE_FORMAT(o.created_at, '%d/%m/%y')   AS createdAt,
                   DATE_FORMAT(o.assumed_at, '%d/%m/%y')   AS assummedAt,
                   DATE_FORMAT(o.completed_at, '%d/%m/%y') AS completedAt
            FROM offer o
                     JOIN item i ON o.item_id = i.id
                     JOIN user u ON o.citizen_id = u.id
            WHERE o.citizen_id = ?
        `;

        // Ensure proper query execution with parameters
        // Note: dbConnection.promise().query returns an array where the first element is the rows
        const [results] = await dbConnection.promise().query(query, [citizenId]);

        // Transform the results into the desired JSON structure
        return results.map((row) => ({
            userId: row.citizenId,
            rescuerId: row.rescuerId,
            requestId: row.offerId,
            fullName: row.fullName,
            item: {id: row.itemId, name: row.itemName},
            announcement: {id: row.announcementId, name: row.announcementName},
            status: row.status,
            numberOfPeople: row.numberOfPeople,
            quantity: row.quantity,
            createdAt: row.createdAt,
            assumedAt: row.assummedAt || "",
            completedAt: row.completedAt || "", // Handle null completedAt dates
        }));
    } catch (err) {
        console.error("Error fetching offers:", err);
        throw err;
    }
};

module.exports = {
    addOffer,
    cancelOffer,
    fetchOffersForCitizen
};
