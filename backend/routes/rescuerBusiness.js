const express = require("express");
const rescuerBusinessService = require("../services/rescuerBusinessService");
const rescuerService = require("../services/rescuerService");
const itemService = require("../services/itemService");
const router = express.Router();

const cookieParser = require('cookie-parser');
const authenticateToken = require('../middleware/auth');
const overviewService = require("../services/overviewService");

router.use(cookieParser());
router.get("/tasks/requests", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;

        const taskRequests = await rescuerBusinessService.getTaskRequests(rescuerId);

        res.status(200).json(taskRequests);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching task requests"});
    }
});

router.post("/tasks/complete-request/:requestId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const requestId = req.params['requestId'];

        await rescuerService.completeRequest(rescuerId, requestId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error completing request"});
    }
});

router.post("/tasks/accept-request/:requestId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const requestId = req.params['requestId'];

        await rescuerService.acceptRequest(rescuerId, requestId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error accepting request"});
    }
});

router.post("/tasks/cancel-request/:requestId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const requestId = req.params['requestId'];

        await rescuerService.cancelRequest(rescuerId, requestId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error cancelling request"});
    }
});

router.get("/tasks/offers", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;

        const offers = await rescuerBusinessService.getTaskOffers(rescuerId);

        res.status(200).json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching task offers"});
    }
});

router.post("/tasks/complete-offer/:offerId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const offerId = req.params['offerId'];

        await rescuerService.completeOffer(rescuerId, offerId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error completing offer"});
    }
});

router.post("/tasks/cancel-offer/:offerId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const offerId = req.params['offerId'];

        await rescuerService.cancelOffer(rescuerId, offerId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error cancelling offer"});
    }
});

router.post("/tasks/accept-offer/:offerId", authenticateToken, async (req, res) => {
    try {

        const rescuerId = req.user.id;
        const offerId = req.params['offerId'];

        await rescuerService.acceptOffer(rescuerId, offerId);

        res.status(200).json({message: "Success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error accepting offer"});
    }
});


router.get("/requests", authenticateToken, async (req, res) => {
    try {
        const pending = queryParamToBool(req.query.pending);
        const rescuerId = req.user.id;
        const assumed = queryParamToBool(req.query.assumed);

        if (!pending && !assumed) {
            res.status(200).json([]);
            return;
        }

        const requests = await rescuerBusinessService.getRequests(pending, assumed, rescuerId);
        const requestsWithOffsets = addRandomOffsets(requests);

        res.status(200).json(requestsWithOffsets);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.get("/offers", authenticateToken, async (req, res) => {
    try {
        const pending = queryParamToBool(req.query.pending);
        const rescuerId = req.user.id;
        const assumed = queryParamToBool(req.query.assumed);

        if (!pending && !assumed) {
            res.status(200).json([]);
            return;
        }

        const requests = await rescuerBusinessService.getOffers(pending, assumed, rescuerId);
        const requestsWithOffsets = addRandomOffsets(requests);

        res.status(200).json(requestsWithOffsets);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.get("/location", authenticateToken, async (req, res) => {
    try {
        const rescuerId = req.user.id;

        const rescuerLocation = await rescuerBusinessService.getRescuerLocation(rescuerId);

        res.status(200).json(rescuerLocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.post("/location", authenticateToken, async (req, res) => {
    try {
        const rescuerId = req.user.id;
        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        await rescuerBusinessService.updateRescuerLocation(rescuerId, latitude, longitude);

        res.status(200).json({message: "success"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.get("/near-base", authenticateToken, async (req, res) => {
    try {
        const rescuerId = req.user.id;

        const nearBase = await rescuerBusinessService.isNearBase(rescuerId);

        res.status(200).json(nearBase.isNearBase);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.get("/inventory", authenticateToken, async (req, res) => {
    try {
        const rescuerId = req.user.id;

        const inventory = await rescuerService.fetchInventory(rescuerId);

        res.status(200).json(inventory);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.post("/inventory/load", authenticateToken, async (req, res) => {
    try {
        const inventory = req.body;
        inventory.rescuerId = req.user.id;
        const inventoryLoaded = await rescuerService.loadInventory(inventory);
        if (inventoryLoaded) {
            res.status(201).json({message: "Inventory loaded successfully"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error loading inventory"});
    }
});

router.get("/inventory/unload", authenticateToken, async (req, res) => {
    try {
        const rescuerId = req.user.id;
        const inventoryUnloaded = await rescuerService.unloadInventory(rescuerId);
        if (inventoryUnloaded) {
            res.status(201).json({message: "Inventory unloaded successfully"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error unloading inventory"});
    }
});

router.get('/base-items', async (req, res) => {
    try {
        //1) Get all items
        const items = await itemService.getBaseItems();
        //2) Return all items
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});

function queryParamToBool(value) {
    return ((value + '').toLowerCase() === 'true');
}

// Function to generate a random offset in meters
const randomOffset = () => Math.random() * (15 - 5) + 10;

// Function to convert meters to degrees (approximate)
const metersToDegreesLat = (meters) => meters / 111320;
const metersToDegreesLon = (meters, lat) => meters / (111320 * Math.cos(lat * Math.PI / 180));

// Function to add random offsets to an array of items with lat and long
function addRandomOffsets(items) {
    return items.map((item, index) => {
        const latOffset = metersToDegreesLat(randomOffset());
        const lonOffset = metersToDegreesLon(randomOffset(), item.latitude);

        // Alternate between adding and subtracting the offset
        const latSign = index % 2 === 0 ? 1 : -1;
        const lonSign = (index + 1) % 2 === 0 ? 1 : -1;

        return {
            ...item,
            latitude: item.latitude + (latOffset * latSign),
            longitude: item.longitude + (lonOffset * lonSign)
        };
    });
}

module.exports = router;

