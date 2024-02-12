const bcrypt = require("bcrypt");
const dbConnection = require("../config/db");
const { sign } = require("jsonwebtoken");

/**
 * Represents a JSON request for user registration.
 *
 * @typedef {Object} newUser
 * @property {string} username - The username for the new user. (Required)
 * @property {string} password - The password for the new user. (Required)
 * @property {string} role - The role of the new user, which should be one of 'ADMIN', 'RESCUER', or 'CITIZEN'. (Required)
 * @property {string} fullname - The full name of the new user. (Optional)
 * @property {string} email - The email address of the new user. (Required)
 * @property {string} phone - The phone number of the new user. (Required)
 * @property {number} longitude
 * @property {number} latitude
 */
const registerUser = async (newUser) => {
  try {
    // Encrypt Password
    const hashedPassword = await bcrypt.hash(newUser.password, 10);

    const locationInsert =
      "INSERT INTO location (latitude, longitude) VALUES (?,?)";
    const locationResult = await dbConnection
      .promise()
      .query(locationInsert, [newUser.longitude, newUser.latitude]);

    const locationId = locationResult[0].insertId;
    const query =
      "INSERT INTO user (username, password, role, full_name, email, phone, location_id) VALUES (?,?,?,?,?,?,?)";
    await dbConnection
      .promise()
      .query(query, [
        newUser.username,
        hashedPassword,
        newUser.role,
        newUser.fullname,
        newUser.email,
        newUser.phone,
        locationId,
      ]);

    return "User registered successfully";
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
};

const authenticateUser = async (email, password) => {
  try {
    const query = "SELECT user.email, user.password FROM user WHERE email = ?";
    const [result] = await dbConnection.promise().query(query, [email]);

    if (result.length === 0) {
      // User not found
      return false;
    }

    const user = result[0];

    // Compare the entered password with the stored password hash
    return await bcrypt.compare(password, user.password);
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

function generateJwtToken(user) {
  // Use the secret key as a plain string
  const secretKey = "mysecretkey";

  // Sign the JWT token with the secret key and set an expiration time
  return sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    secretKey,
    { expiresIn: "24h" }
  );
}

module.exports = {
  registerUser,
  usernameAvailable,
  emailAvailable,
  getUsersByRole,
  authenticateUser,
  generateJwtToken,
  getUserByEmail,
  getMarkersByRole,
};
