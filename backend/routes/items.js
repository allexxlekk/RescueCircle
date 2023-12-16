const express = require('express');
const itemService = require('../services/itemService.js');
const router = express.Router();
const axios = require('axios');


//ADD NEW ITEM
router.post('/', async (req, res) => {

    try {
        const item = req.body;
        //1) 
        const itemAdded = await itemService.addItem(item);
        if (itemAdded) {
            res.status(201).json({ message: 'Item added successfully' });
        } else {
            res.status(409).json({ error: 'Item already exists' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding item' });
    }
});

//GET ALL ITEMS
router.get('/', async (req, res) => {
    try {
        //1) Get all items
        const items = await itemService.getAllItems();
        //2) Return all items
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching items' });
    }
});
//check if the item name is avalaible.
router.get('/isAvailable', async (req, res) => {
    try {
        const itemName = req.query.itemName;
        // Check if the item name was provided
        if (!itemName) {
            return res.status(400).json({ error: 'Item name is required' });
        }

        // Check the availability of the item
        let isAvailable = await itemService.checkItemAvailability(itemName);
        isAvailable = !isAvailable;
        // Return the availability status
        res.status(200).json({ isAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching items' });
    }
});

//GET ITEMS BY CATEGORY NAME OR ID
router.get('/byCategory', async (req, res) => {
    const { id = null, name = null } = req.query;

    // Handle requests by id
    if (id) {
        try {
            const itemDetails = await itemService.getItemsByCategoryId(id);
            res.status(200).json(itemDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching items by category id' });
        }
    }
    // Handle requests by name
    else if (name) {
        try {
            const itemDetails = await itemService.getItemsByCategoryName(name);
            res.status(200).json(itemDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching items by category name' });
        }
    }
    // No valid query parameter provided
    else {
        res.status(400).json({ error: 'Either id or name is required' });
    }
});

//SEARCH ITEM
router.get('/search', async (req, res) => {
    const { str, categoryId = null } = req.query;
    if (!str) {
        return res.status(400).json({ error: 'Searchstring is required' });
    }
    try {
        //1) Get item details by name
        const items = await itemService.searchItems(str, categoryId);
        //2) Return all categories
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching items' });
    }
});

//UPLOAD ITEMS
router.post('/upload', async (req, res) => {

    try {
        let jsonData = req.body;
        await itemService.uploadFromOnlineDatabase(jsonData);
        res.status(201).json({ message: 'Items uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading items' });
    }
}
);

//SYNC ITEMS WITH ONLINE DATABASE
router.post('/sync', async (req, res) => {

    try {
        const response = await axios.get('http://usidas.ceid.upatras.gr/web/2023/export.php');
        let jsonData = response.data;
        console.log(jsonData)
        await itemService.uploadFromOnlineDatabase(jsonData);
        res.status(201).json({ message: 'Items uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error uploading items' });
    }
}
);

//TODO: add endpoint to see if the item already exists while
// typing the item name in the frontend

module.exports = router;