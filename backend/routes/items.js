const express = require('express');
const itemService = require('../services/itemService.js');
const router = express.Router();


router.post('/', async (req, res) => {

    try{
        const item = req.body;
        //1) 
        const itemAdded = await itemService.addItem(item);
        if (itemAdded) {
            res.status(201).json({ message: 'Item added successfully' });
        } else {
            res.status(409).json({ error: 'Item already exists' });
        }
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding item'});
    }
});
//get all items
 router.get('/', async (req, res) => {
    try{
      //1) Get all items
      const items = await itemService.getAllItems();
      //2) Return all items
      res.status(200).json(items);
    }catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error fetching items'});
    }
  });
//get item details by name
  router.get('/byName', async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
      }
        try{
          //1) Get item details by name
          const itemDetails = await itemService.getItemDetailsByName(name);
          //2) Return all categories
          res.status(200).json(itemDetails);
        }catch (error) {
          console.error(error);
          res.status(500).json({ error: 'Error fetching items'});
        }
      });
      router.get('/byCategory', async (req, res) => {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
          }
            try{
              //1) Get item details by name
              const itemDetails = await itemService.getItemsByCategoryName(name);
              //2) Return all categories
              res.status(200).json(itemDetails);
            }catch (error) {
              console.error(error);
              res.status(500).json({ error: 'Error fetching items'});
            }
          });

module.exports = router;