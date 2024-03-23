const dbConnection = require("../config/db");

const baseLocation = async () => {
    try {
        const query = `SELECT latitude, longitude
                       FROM location
                       WHERE id = 1`;

        const result = await dbConnection.promise().query(query);
        return result[0];
    } catch (err) {
        console.error("Error on fetch base location:", err);
        throw err;
    }
};

const getUserCoordinates = async (userId) => {
    try {
        const query = `SELECT l.latitude, l.longitude
                       FROM location AS l
                                JOIN user ON user.location_id = l.id
                       WHERE user.id = ?`;

        const [results] = await dbConnection.promise().query(query, [userId]);

        if (results.length > 0) {
            return results[0];
        } else {
            return null;
        }
    } catch (err) {
        console.error("Error on fetch user coordinates:", err);
        throw err;
    }
};

const getDistanceBetweenUsers = async (userId1, userId2) => {
    const rescuerCoordinates = await getUserCoordinates(userId1);
    const citizenCoordinates = await getUserCoordinates(userId2);

    // Convert latitude and longitude from degrees to radians
    const deg2rad = deg => deg * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(citizenCoordinates.latitude - rescuerCoordinates.latitude);
    const dLon = deg2rad(citizenCoordinates.longitude - rescuerCoordinates.longitude);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(rescuerCoordinates.latitude)) * Math.cos(deg2rad(citizenCoordinates.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km

    return distance * 1000; // Convert km to meters
};



module.exports = {
    baseLocation,
    getUserCoordinates,
    getDistanceBetweenUsers
};