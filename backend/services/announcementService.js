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
    const query = "SELECT ann.id, ann.name, ann.description FROM announcement AS ann";
    const [announcements] = await dbConnection.promise().query(query);

    // Compare the entered password with the stored password hash
    return announcements;
  } catch (error) {
    // Handle any errors that occur during the database query or password comparison
    console.error("Error authenticating user:", error.message);
    return false; // Authentication failed due to an error
  }
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements
};
