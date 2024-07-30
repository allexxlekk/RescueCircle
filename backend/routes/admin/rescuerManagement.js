const express = require("express");
const inventoryStatus = require("../../services/intentoryStatusService.js");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const items = await inventoryStatus.getCategories();

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching categories"});
    }
});


router.post("/", async (req, res) => {
    try {
        const search = req.query.search;
        const categories = req.body.categories
        const items = await inventoryStatus.getItems(categories, search);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching items"});
    }
});


module.exports = router;

