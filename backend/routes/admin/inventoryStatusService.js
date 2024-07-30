const express = require("express");
const inventoryStatusService = require("../../services/intentoryStatusService.js");
const router = express.Router();

router.get("/categories", async (req, res) => {
    try {
        const items = await inventoryStatusService.getCategories();

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching categories"});
    }
});


router.post("/items", async (req, res) => {
    try {
        const search = req.query.search;
        const categories = req.body.categories
        const items = await inventoryStatusService.getItems(categories, search);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching items"});
    }
});


module.exports = router;

