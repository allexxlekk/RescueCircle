const dbConnection = require("../config/db");

const baseLocation = async () => {
  try {
    const query = `SELECT latitude, longitude FROM location WHERE id = 1`;

    const result = await dbConnection.promise().query(query);
    return result[0]; // Request added successfully
  } catch (err) {
    console.error("Error on fetch base location:", err);
    throw err;
  }
};

module.exports = {
  baseLocation
};