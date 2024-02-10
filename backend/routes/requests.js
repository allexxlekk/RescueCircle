const express = require('express');
const requestService = require('../services/requestService.js');
const router = express.Router();


//ADD NEW REQUEST
router.post('/', async (req, res) => {

    try {
        const request = req.body;
        const requestAdded = await requestService.addRequest(request);
        if (requestAdded) {
            res.status(201).json({ message: 'Request added successfully' });
        } 
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding request' });
    }
});

// // GET ALL CATEGORIES
// router.get('/', async (req, res) => {
//   try{
//     const categories = await categoryService.getAllCategories();
//     res.status(200).json({categories});
//   }catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Error fetching categories'});
//   }
// });


module.exports = router;