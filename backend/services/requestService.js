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

const fetchRequestsForCitizen = async (citizenId) => {
  try {
    const query = `
        SELECT 
          i.name AS itemName,
          r.status,
          r.number_of_people AS numberOfPeople,
          r.quantity,
          u.full_name AS fullName,
          DATE_FORMAT(r.created_at, '%d/%m/%y') AS createdAt,
          DATE_FORMAT(r.completed_at, '%d/%m/%y') AS completedAt
        FROM request r
        JOIN item i ON r.item_id = i.id
        JOIN user u ON r.citizen_id = u.id
        WHERE r.citizen_id = ?
      `;

    // Ensure proper query execution with parameters
    // Note: dbConnection.promise().query returns an array where the first element is the rows
    const [results] = await dbConnection.promise().query(query, [citizenId]);

    // Transform the results into the desired JSON structure
    const formattedResults = results.map((row) => ({
      userId: citizenId,
      fullName: row.fullName,
      item: { name: row.itemName },
      status: row.status,
      numberOfPeople: row.numberOfPeople,
      quantity: row.quantity,
      createdAt: row.createdAt,
      completedAt: row.completedAt || "", // Handle null completedAt dates
    }));

    return formattedResults;
  } catch (err) {
    console.error("Error fetching requests:", err);
    throw err;
  }
};

const fetchCitizenRequests = async () => {
  try {
    const query = `
        SELECT 
          i.name AS itemName,
          r.status,
          r.number_of_people AS numberOfPeople,
          r.quantity,
          u.full_name AS fullName,
          u.id AS userId,
          DATE_FORMAT(r.created_at, '%d/%m/%y') AS createdAt,
          DATE_FORMAT(r.completed_at, '%d/%m/%y') AS completedAt
        FROM request r
        JOIN item i ON r.item_id = i.id
        JOIN user u ON r.citizen_id = u.id
      `;

    // Ensure proper query execution with parameters
    // Note: dbConnection.promise().query returns an array where the first element is the rows
    const [results] = await dbConnection.promise().query(query);

    // Transform the results into the desired JSON structure
    const formattedResults = results.map((row) => ({
      userId: row.userId,
      fullName: row.fullName,
      item: { name: row.itemName },
      status: row.status,
      numberOfPeople: row.numberOfPeople,
      quantity: row.quantity,
      createdAt: row.createdAt,
      completedAt: row.completedAt || "", // Handle null completedAt dates
    }));

    return formattedResults;
  } catch (err) {
    console.error("Error fetching requests:", err);
    throw err;
  }
};


module.exports = {
  addRequest,
  fetchRequestsForCitizen,
  fetchCitizenRequests
};
