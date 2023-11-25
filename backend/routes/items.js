const express = require('express');
const itemService = require('../services/itemService.js');
const router = express.Router();


router.post('/', async (req, res) => {
    try{
        const item = req.body();
        //1) Get all categories
        const itemAdded = await itemService.addItem(item);
        if (itemAdded) {
            res.status(201).json({ message: 'Item added successfully' });
        } else {
            res.status(409).json({ error: 'Item already exists' });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching categories'});
    }
});



module.exports = router;