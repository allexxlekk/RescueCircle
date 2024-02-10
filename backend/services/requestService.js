const dbConnection = require("../config/db");

const addRequest = async (requestData) => {

  try {
    const query = `
  INSERT INTO request (item_id, number_of_people, citizen_id, quantity)
  VALUES (?, ?, ?, (SELECT offer_quantity FROM item WHERE id = ?) * ?)
`;
    const values = [
      requestData.itemId,
      requestData.numberOfPeople,
      requestData.citizenId,
      requestData.itemId,
      requestData.numberOfPeople,
    ];
    await dbConnection.promise().query(query, values);
    return true; // Request added successfully
  } catch (err) {
    console.error("Error on add category:", err);
    throw err;
  }
};

function fetchRequestsForCitizen(citizenId) {
  const query = `
      SELECT 
        i.name AS itemName,
        r.status,
        r.number_of_people AS numberOfPeople,
        r.quantity,
        DATE_FORMAT(r.created_at, '%d/%m/%y') AS createdAt,
        DATE_FORMAT(r.completed_at, '%d/%m/%y') AS completedAt
      FROM request r
      JOIN item i ON r.item_id = i.id
      WHERE r.citizen_id = ?
    `;

  connection.query(query, [citizenId], (error, results) => {
    if (error) {
      console.error("An error occurred: ", error);
      return;
    }

    // Transform the results into the desired JSON structure
    const formattedResults = results.map((row) => ({
      item: { name: row.itemName },
      status: row.status,
      numberOfPeople: row.numberOfPeople,
      quantity: row.quantity,
      createdAt: row.createdAt,
      completedAt: row.completedAt || "", // Handle null completedAt dates
    }));

    return formattedResults;
  });

  // Close the connection
}

module.exports = {
  addRequest,
};
