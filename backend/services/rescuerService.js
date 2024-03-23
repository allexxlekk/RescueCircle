const dbConnection = require("../config/db");
const locationService = require('./locationService');

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
            UPDATE rescuer_inventory
            SET amount = 0
            WHERE rescuer_id = ?;
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
        const activeTasks = await fetchActiveTasks(rescuerId);
        if (activeTasks >= 4) {
            return false;
        }

        const acceptRequestQuery =
            "UPDATE request SET rescuer_id = ?, status = 'ASSUMED', assumed_at = NOW() WHERE id = ?";
        await dbConnection
            .promise()
            .query(acceptRequestQuery, [rescuerId, requestId]);

        const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = ? WHERE rescuer_id = ?";
        await dbConnection
            .promise()
            .query(updateActiveTaskQuery, [activeTasks + 1, rescuerId]);

        return true;
    } catch (err) {
        console.error("Error on accepting request:", err);
        throw err;
    }
};

const completeRequest = async (rescuerId, requestId) => {
    try {
        const citizenIdQuery = "SELECT citizen_id FROM request WHERE id = ? ;";
        const citizenResult = await dbConnection
            .promise()
            .query(citizenIdQuery, [requestId]);

        const citizenId = citizenResult[0][0].citizen_id;

        if (await isNearCitizen(rescuerId, citizenId)) {
            // Unload the item
            // Get amount
            const itemAmountQuery = "SELECT quantity, item_id FROM request WHERE id = ?";
            const amountResult = await dbConnection
                .promise()
                .query(itemAmountQuery, [requestId]);

            const itemQuantity = amountResult[0][0].quantity;
            const itemId = amountResult[0][0].item_id;

            const unloadItemQuery = "UPDATE rescuer_inventory SET amount = amount - ? WHERE item_id = ? AND rescuer_id = ?";
            await dbConnection
                .promise()
                .query(unloadItemQuery, [itemQuantity, itemId, rescuerId]);

            const acceptRequestQuery =
                "UPDATE request SET rescuer_id = ?, status = 'COMPLETED', completed_at = NOW() WHERE id = ?";
            await dbConnection
                .promise()
                .query(acceptRequestQuery, [rescuerId, requestId]);

            const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = active_tasks-1 WHERE rescuer_id = ?";
            await dbConnection
                .promise()
                .query(updateActiveTaskQuery, [rescuerId]);
            return true;
        }
    } catch (err) {
        console.error("Error on completing request:", err);
        throw err;
    }
};

const completeOffer = async (rescuerId, offerId) => {
    try {
        const citizenIdQuery = "SELECT citizen_id FROM offer WHERE id = ? ;";
        const citizenResult = await dbConnection
            .promise()
            .query(citizenIdQuery, [offerId]);

        const citizenId = citizenResult[0][0].citizen_id;

        if (await isNearCitizen(rescuerId, citizenId)) {
            // Unload the item
            // Get amount
            const itemAmountQuery = "SELECT quantity, item_id FROM offer WHERE id = ?";
            const amountResult = await dbConnection
                .promise()
                .query(itemAmountQuery, [offerId]);

            const itemQuantity = amountResult[0][0].quantity;
            const itemId = amountResult[0][0].item_id;

            const loadItemQuery = "UPDATE rescuer_inventory SET amount = amount + ? WHERE item_id = ? AND rescuer_id = ?";
            await dbConnection
                .promise()
                .query(loadItemQuery, [itemQuantity, itemId, rescuerId]);

            const acceptOfferQuery =
                "UPDATE offer SET rescuer_id = ?, status = 'COMPLETED', completed_at = NOW() WHERE id = ?";
            await dbConnection
                .promise()
                .query(acceptOfferQuery, [rescuerId, offerId]);

            const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = active_tasks-1 WHERE rescuer_id = ?";
            await dbConnection
                .promise()
                .query(updateActiveTaskQuery, [rescuerId]);
            return true;
        }
    } catch (err) {
        console.error("Error on completing offer:", err);
        throw err;
    }
};

const cancelRequest = async (rescuerId, requestId) => {
    try {
        // Check if there is enough quantity available in rescuer's inventory
        const cancelRequestQuery =
            "UPDATE request SET rescuer_id = NULL, status = 'PENDING', assumed_at = NULL WHERE id = ? AND rescuer_id = ?";
        await dbConnection
            .promise()
            .query(cancelRequestQuery, [requestId, rescuerId]);

        const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = active_tasks -1 WHERE rescuer_id = ?";
        await dbConnection
            .promise()
            .query(updateActiveTaskQuery, [rescuerId]);

        return true;
    } catch (err) {
        console.error("Error on canceling request:", err);
        throw err;
    }
};

const acceptOffer = async (rescuerId, offerId) => {
    try {
        // Check if the rescuer has less than 4 tasks
        const activeTasks = await fetchActiveTasks(rescuerId);
        if (activeTasks >= 4) {
            return false;
        }

        const acceptOfferQuery =
            "UPDATE offer SET rescuer_id = ?, status = 'ASSUMED', assumed_at = NOW() WHERE id = ?";
        await dbConnection
            .promise()
            .query(acceptOfferQuery, [rescuerId, offerId]);

        const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = ? WHERE rescuer_id = ?";
        await dbConnection
            .promise()
            .query(updateActiveTaskQuery, [activeTasks + 1, rescuerId]);

        return true;
    } catch (err) {
        console.error("Error on accepting offer:", err);
        throw err;
    }
};

const cancelOffer = async (rescuerId, requestId) => {
    try {
        // Check if there is enough quantity available in rescuer's inventory
        const cancelOfferQuery =
            "UPDATE offer SET rescuer_id = NULL, status = 'PENDING', assumed_at = NULL WHERE id = ? AND rescuer_id = ?";
        await dbConnection
            .promise()
            .query(cancelOfferQuery, [requestId, rescuerId]);

        const updateActiveTaskQuery = "UPDATE rescue_vehicle SET active_tasks = active_tasks - 1 WHERE rescuer_id = ?";
        await dbConnection
            .promise()
            .query(updateActiveTaskQuery, [rescuerId]);

        return true;
    } catch (err) {
        console.error("Error on canceling offer:", err);
        throw err;
    }
};

const fetchActiveTasks = async (rescuerId) => {
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

const isNearCitizen = async (rescuerId, citizenId) => {
    const distInMeters = await locationService.getDistanceBetweenUsers(rescuerId, citizenId);
    // return distInMeters <= 50;
    //TODO remove this, it is only for testing;
    return true;
};

const canCompleteRequest = async (rescuerId, requestId) => {
    const citizenIdQuery = "SELECT citizen_id FROM request WHERE id = ? ;";
    const citizenResult = await dbConnection
        .promise()
        .query(citizenIdQuery, [requestId]);

    const citizenId = citizenResult[0][0].citizen_id;

    const nearCitizen = await isNearCitizen(rescuerId, citizenId);
    const itemAmountQuery = "SELECT quantity, item_id FROM request WHERE id = ?";
    const quantityResult = await dbConnection
        .promise()
        .query(itemAmountQuery, [requestId]);

    const itemQuantity = quantityResult[0][0].quantity;
    const itemId = quantityResult[0][0].item_id;

    const enoughItemsQuery = "SELECT amount FROM rescuer_inventory WHERE rescuer_id = ? AND item_id = ?";
    const amountResult = await dbConnection
        .promise()
        .query(enoughItemsQuery, [rescuerId, itemId]);

    try {
        const itemAmount = amountResult[0][0].amount;

        return nearCitizen && (itemAmount >= itemQuantity);
    } catch (e) {
        return false;
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
            UPDATE rescuer_inventory
            SET amount = amount - ?
            WHERE item_id = ?
              AND rescuer_id = ?;
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

module.exports = {
    loadInventory,
    unloadInventory,
    deliver,
    fetchInventory,
    acceptRequest,
    completeRequest,
    cancelRequest,
    acceptOffer,
    cancelOffer,
    fetchActiveTasks,
    isNearCitizen,
    completeOffer,
    canCompleteRequest
};