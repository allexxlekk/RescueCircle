const express = require('express');
const rescuerService = require('../services/rescuerService.js');
const router = express.Router();


//ADD NEW REQUEST
router.post('/load', async (req, res) => {

  try {
    const inventory = req.body;
    const inventoryLoaded = await rescuerService.loadInventory(inventory);
    if (inventoryLoaded) {
      res.status(201).json({ message: 'Inventory loaded successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error loading inventory' });
  }
});


//todo must work with list
router.post('/unload', async (req, res) => {

    try {
      const inventory = req.body;
      const inventoryUnloaded = await rescuerService.unloadInventory(inventory);
      if (inventoryUnloaded) {
        res.status(201).json({ message: 'Inventory unloaded successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error unloading inventory' });
    }
  });

  router.post('/deliver', async (req, res) => {

    try {
      const inventory = req.body;
      const inventoryDelivered = await rescuerService.deliver(inventory);
      if (inventoryDelivered) {
        res.status(201).json({ message: 'Inventory delivered successfully' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error delivered inventory' });
    }
  });

  





module.exports = router;