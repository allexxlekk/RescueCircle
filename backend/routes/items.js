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

//GET ITEM BY NAME
router.get('/byName', async (req, res) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }
    try {
        //1) Get item details by name
        const itemDetails = await itemService.getItemDetailsByName(name);
        //2) Return all categories
        res.status(200).json(itemDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});

//GET ITEMS BY CATEGORY
router.get('/byCategory', async (req, res) => {
    const {name} = req.query;
    if (!name) {
        return res.status(400).json({error: 'Name is required'});
    }
    try {
        //1) Get item details by name
        const itemDetails = await itemService.getItemsByCategoryName(name);
        //2) Return all categories
        res.status(200).json(itemDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});

//GET ITEMS BY CATEGORY ID
// NOTE: MIGHT BE UNNECESSARY TO HAVE BOTH GET BY CATEGORY NAME ADN ID ENDPOINTS
// SHOULD REVISIT LATER
router.get('/byCategoryId', async (req, res) => {
    const {id} = req.query;
    if (!id) {
        return res.status(400).json({error: 'id is required'});
    }
    try {
        //1) Get item details by id
        const itemDetails = await itemService.getItemsByCategoryId(id);
        //2) Return all categories
        res.status(200).json(itemDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching items'});
    }
});

//TODO: add endpoint to see if the item already exists while
// typing the item name in the frontend

module.exports = router;