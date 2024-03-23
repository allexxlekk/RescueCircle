const dbConnection = require("../config/db");

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

const unloadInventory = async (rescuerId) => {
  try {
    // Check if there is enough quantity available in rescuer's inventory
    const rescuerInventoryQuery =
      "SELECT amount, item_id as itemId FROM rescuer_inventory WHERE rescuer_id = ?";
    const [rescuerInventory] = await dbConnection
      .promise()
      .query(rescuerInventoryQuery, [rescuerId]);

    // Proceed with unloading inventory
    const unloadQuery = `
        UPDATE rescuer_inventory SET amount = 0 WHERE rescuer_id = ?;
      `;
    await dbConnection.promise().query(unloadQuery, [rescuerId]);

    const updateItemQuery =
      "UPDATE item SET quantity = quantity + ? WHERE id = ?";
    rescuerInventory.forEach(async (element) => {
      await dbConnection
        .promise()
        .query(updateItemQuery, [element.amount, element.itemId]);
    });
    // Update the quantity of the item

    return true; // Inventory unloaded successfully
  } catch (err) {
    console.error("Error on unload inventory:", err);
    throw err;
  }
};

const fetchInventory = async () => {
  try {
    const query = `
            SELECT ri.amount, item.name, item_category.name AS category_name
            FROM rescuer_inventory AS ri
                    INNER JOIN item ON ri.item_id = item.id
                    INNER JOIN item_category ON item.category_id = item_category.id
                    WHERE ri.amount > 0;
        `;
    const [result] = await dbConnection.promise().query(query);
    return result;
  } catch (err) {
    console.error("Error get inventory:", err);
    throw err;
  }
};

const acceptRequest = async (rescuerId, requestId) => {
  try {
    // Check if the rescuer has less than 4 tasks
    const activeTasks = await fetchTasks(rescuerId);
    if(activeTasks >= 4){
      return false;
    }

    // Check if there is enough quantity available in rescuer's inventory
    const acceptOfferQuery =
      "UPDATE request SET rescuer_id = ?, status = 'ASSUMED', assumed_at = NOW() WHERE id = ?";
    await dbConnection
      .promise()
      .query(acceptOfferQuery, [rescuerId, requestId]);

    const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = ? WHERE rescuer_id = ?";
    await dbConnection
    .promise()
    .query(updateActiveTaskQuery, [activeTasks +1, rescuerId]);

    return true; // Inventory delivered successfully
  } catch (err) {
    console.error("Error on accepting request:", err);
    throw err;
  }
};

const fetchTasks = async (rescuerId) => {
  const rescuerTaskQuery =
    "SELECT active_tasks FROM rescue_vehicle WHERE rescuer_id = ?";
  const [results] = await dbConnection
    .promise()
    .query(rescuerTaskQuery, [rescuerId]);
  if (results.length > 0) {
    return results[0].active_tasks;
  } else {
    return 0;
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
      unloading,
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
  loadInventory,
  unloadInventory,
  deliver,
  fetchInventory,
  acceptRequest,
  fetchTasks,
};
