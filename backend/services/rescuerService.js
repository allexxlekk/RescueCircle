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

const loadInventory = async (inventory) => {
  try {
    // Check if there is enough quantity available for the item
    const itemQuery = "SELECT quantity FROM item WHERE id = ?";
    const [itemRows] = await dbConnection
      .promise()
      .query(itemQuery, [inventory.itemId]);
    if (itemRows.length === 0) {
      throw new Error("Item not found");
    }
    const itemQuantity = itemRows[0].quantity;
    if (itemQuantity < inventory.amount) {
      throw new Error("Insufficient quantity");
    }

    // Proceed with updating rescuer_inventory table
    const query = `
        INSERT INTO rescuer_inventory (item_id, rescuer_id, amount)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE amount = amount + ?;
      `;
    const values = [
      inventory.itemId,
      inventory.rescuerId,
      inventory.amount,
      inventory.amount, // Add the same amount for the ON DUPLICATE KEY UPDATE
    ];
    await dbConnection.promise().query(query, values);

    // Update the quantity of the item
    const updateItemQuery =
      "UPDATE item SET quantity = quantity - ? WHERE id = ?";
    await dbConnection
      .promise()
      .query(updateItemQuery, [inventory.amount, inventory.itemId]);

    return true; // Request added or updated successfully
  } catch (err) {
    console.error("Error on load inventory:", err);
    throw err;
  }
};

const unloadInventory = async (inventory) => {
  try {
    // Check if there is enough quantity available in rescuer's inventory
    const rescuerInventoryQuery =
      "SELECT amount FROM rescuer_inventory WHERE item_id = ? AND rescuer_id = ?";
    const [rescuerInventoryRows] = await dbConnection
      .promise()
      .query(rescuerInventoryQuery, [inventory.itemId, inventory.rescuerId]);
    if (rescuerInventoryRows.length === 0) {
      throw new Error("Rescuer does not have this item in inventory");
    }
    const rescuerAmount = rescuerInventoryRows[0].amount;
    if (rescuerAmount < inventory.amount) {
      throw new Error("Insufficient quantity in rescuer's inventory");
    }

    // Proceed with unloading inventory
    const unloadQuery = `
        UPDATE rescuer_inventory SET amount = amount - ? WHERE item_id = ? AND rescuer_id = ?;
      `;
    await dbConnection
      .promise()
      .query(unloadQuery, [
        inventory.amount,
        inventory.itemId,
        inventory.rescuerId,
      ]);

    // Update the quantity of the item
    const updateItemQuery =
      "UPDATE item SET quantity = quantity + ? WHERE id = ?";
    await dbConnection
      .promise()
      .query(updateItemQuery, [inventory.amount, inventory.itemId]);

    return true; // Inventory unloaded successfully
  } catch (err) {
    console.error("Error on unload inventory:", err);
    throw err;
  }
};

const deliver = async (inventory) => {
  try {
    // Check if there is enough quantity available in rescuer's inventory
    const rescuerInventoryQuery =
      "SELECT amount FROM rescuer_inventory WHERE item_id = ? AND rescuer_id = ?";
    const [rescuerInventoryRows] = await dbConnection
      .promise()
      .query(rescuerInventoryQuery, [inventory.itemId, inventory.rescuerId]);
    if (rescuerInventoryRows.length === 0) {
      throw new Error("Rescuer does not have this item in inventory");
    }
    const rescuerAmount = rescuerInventoryRows[0].amount;
    if (rescuerAmount < inventory.amount) {
      throw new Error("Insufficient quantity in rescuer's inventory");
    }

    // Proceed with delivering inventory
    const deliverQuery = `
        UPDATE rescuer_inventory SET amount = amount - ? WHERE item_id = ? AND rescuer_id = ?;
      `;
    await dbConnection
      .promise()
      .query(deliverQuery, [
        inventory.amount,
        inventory.itemId,
        inventory.rescuerId,
      ]);

    return true; // Inventory delivered successfully
  } catch (err) {
    console.error("Error on deliver inventory:", err);
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
  fetchCitizenRequests,
  loadInventory,
  unloadInventory,
  deliver,
};
