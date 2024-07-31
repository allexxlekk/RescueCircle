const express = require("express");
const overviewService = require("../../services/overviewService");
const router = express.Router();


router.get("/rescuers", async (req, res) => {
    try {
        const active = queryParamToBool(req.query.active);
        const inactive = queryParamToBool(req.query.inactive);

        if (!active && !inactive) {
            res.status(200).json([]);
            return;
        }

        const rescuers = await overviewService.getRescuers(active, inactive);
        const rescuersWithOffsets = addRandomOffsets(rescuers);

        res.status(200).json(rescuersWithOffsets);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching rescuers"});
    }
});

router.get("/rescuers/:id", async (req, res) => {
    try {
        const id = req.params['id'];
        const rescuer = await overviewService.getRescuer(id);

        if (!rescuer) {
            return res.status(404).json({error: "Rescuer not found"});
        }

        res.status(200).json(rescuer);
    } catch (error) {
        console.error('Error in /rescuers/:id route:', error);
        if (error.message === 'Rescuer not found') {
            res.status(404).json({error: "Rescuer not found"});
        } else {
            res.status(500).json({error: "Error fetching rescuer"});
        }
    }
});

router.get("/requests", async (req, res) => {
    try {
        const pending = queryParamToBool(req.query.pending);
        const assumed = queryParamToBool(req.query.assumed);

        if (!pending && !assumed) {
            res.status(200).json([]);
            return;
        }

        const requests = await overviewService.getRequests(pending, assumed);
        const requestsWithOffsets = addRandomOffsets(requests);

        res.status(200).json(requestsWithOffsets);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching requests"});
    }
});

router.get("/requests/:id", async (req, res) => {
    try {
        const id = req.params['id'];
        const request = await overviewService.getRequest(id);

        if (!request) {
            return res.status(404).json({error: "Request not found"});
        }

        res.status(200).json(request);
    } catch (error) {
        console.error('Error in /request/:id route:', error);
        if (error.message === 'Request not found') {
            res.status(404).json({error: "Request not found"});
        } else {
            res.status(500).json({error: "Error fetching request"});
        }
    }
});

router.get("/offers", async (req, res) => {
    try {
        const pending = queryParamToBool(req.query.pending);
        const assumed = queryParamToBool(req.query.assumed);

        if (!pending && !assumed) {
            res.status(200).json([]);
            return;
        }

        const offers = await overviewService.getOffers(pending, assumed);
        const offersWithOffsets = addRandomOffsets(offers);

        res.status(200).json(offersWithOffsets);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching offers"});
    }
});

router.get("/offers/:id", async (req, res) => {
    try {
        const id = req.params['id'];
        const offer = await overviewService.getOffer(id);

        if (!offer) {
            return res.status(404).json({error: "Offer not found"});
        }

        res.status(200).json(offer);
    } catch (error) {
        console.error('Error in /offer/:id route:', error);
        if (error.message === 'Offer not found') {
            res.status(404).json({error: "Offer not found"});
        } else {
            res.status(500).json({error: "Error fetching offer"});
        }
    }
});

function queryParamToBool(value) {
    return ((value + '').toLowerCase() === 'true');
}

// Function to generate a random offset in meters
const randomOffset = () => Math.random() * (40 - 10) + 10; // Random number between 40 and 30

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
