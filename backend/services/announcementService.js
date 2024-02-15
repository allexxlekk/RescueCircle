const bcrypt = require("bcrypt");
const dbConnection = require("../config/db");
const locationService = require("./locationService");
const { sign } = require("jsonwebtoken");

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

// given a username, checks to see if it already exists in the database
const usernameAvailable = async (username) => {
  try {
    const query = "SELECT COUNT(*) AS count FROM user WHERE username = ?";
    const [result] = await dbConnection.promise().query(query, [username]);

    // If the count is 0, the username is available; otherwise, it's already taken
    return result[0].count === 0;
  } catch (err) {
    console.error("Error checking username availability:", err);
    throw err;
  }
};

const getUserByEmail = async (email) => {
  try {
    const query = "SELECT * FROM user WHERE email = ?";
    const [result] = await dbConnection.promise().query(query, [email]);

    // If the count is 0, the email is available; otherwise, it's already taken
    return result[0];
  } catch (err) {
    console.error("Error checking email availability:", err);
    throw err;
  }
};

// given an email, checks to see if it already exists in the database
const emailAvailable = async (username) => {
  try {
    const query = "SELECT COUNT(*) AS count FROM user WHERE email = ?";
    const [result] = await dbConnection.promise().query(query, [username]);

    // If the count is 0, the email is available; otherwise, it's already taken
    return result[0].count === 0;
  } catch (err) {
    console.error("Error checking email availability:", err);
    throw err;
  }
};

const getUsersByRole = async (role) => {
  try {
    const query = "SELECT * FROM user WHERE role = ?";
    const [result] = await dbConnection.promise().query(query, [role]);
    return result;
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

const getMarkersByRole = async (role) => {
  try {
    if (role === "CITIZEN") {
      const query =
        "SELECT user.id, user.full_name, location.latitude, location.longitude FROM user JOIN location ON user.location_id = location.id WHERE user.role = ?";
      const [result] = await dbConnection.promise().query(query, [role]);
      return result.map((row) => ({
        id: row.id,
        fullname: row.full_name,
        latitude: row.latitude,
        longitude: row.longitude,
      }));
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    throw err;
  }
};

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}

module.exports = {
  createAnnouncement,
  getAllAnnouncements
};
