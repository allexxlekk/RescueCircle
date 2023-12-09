const express = require('express');
const itemService = require('../services/itemService.js');
const router = express.Router();


//ADD NEW ITEM
router.post('/', async (req, res) => {

    try {
        const item = req.body;
        //1) 
        const itemAdded = await itemService.addItem(item);
        if (itemAdded) {
            res.status(201).json({message: 'Item added successfully'});
        } else {
            res.status(409).json({error: 'Item already exists'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error adding item'});
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
        res.status(500).json({error: 'Error fetching items'});
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
        const isAvailable = await itemService.checkItemAvailability(itemName);

 // Return the availability status
        res.status(200).json({ isAvailable });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});
//

// router.get('/itemIsAvailable', async (req, res) => {
//     try {
//         // Get the item name from query parameters
//         const itemName = req.query.name;

//         // Check if the item name was provided
//         if (!itemName) {
//             return res.status(400).json({ error: 'Item name is required' });
//         }

//         // Check the availability of the item
//         const isAvailable = await itemService.checkItemAvailability(itemName);

//         // Return the availability status
//         res.status(200).json({ isAvailable });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error fetching item availability' });
//     }
// });
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
            res.status(500).json({error: 'Error fetching items by category id'});
        }
    } 
    // Handle requests by name
    else if (name) {
        try {
            const itemDetails = await itemService.getItemsByCategoryName(name);
            res.status(200).json(itemDetails);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error fetching items by category name'});
        }
    } 
    // No valid query parameter provided
    else {
        res.status(400).json({error: 'Either id or name is required'});
    }
});

//SEARCH ITEM
router.get('/search', async (req, res) => {
    const {str} = req.query;
    if (!str) {
        return res.status(400).json({error: 'Searchstring is required'});
    }
    try {
        //1) Get item details by name
        const items = await itemService.searchItems(str);
        //2) Return all categories
        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});

//TODO: add endpoint to see if the item already exists while
// typing the item name in the frontend

module.exports = router;