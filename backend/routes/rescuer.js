const express = require("express");
const rescuerService = require("../services/rescuerService.js");
const router = express.Router();

router.post("/load", async (req, res) => {
  try {
    const inventory = req.body;
    const inventoryLoaded = await rescuerService.loadInventory(inventory);
    if (inventoryLoaded) {
      res.status(201).json({ message: "Inventory loaded successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error loading inventory" });
  }
});

router.get("/inventory", async (req, res) => {
  try {

    const rescuerId = req.query.id;
    const inventory = await rescuerService.fetchInventory(rescuerId);
    res.status(200).json(inventory);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching inventory" });
  }
});

router.get("/unload", async (req, res) => {
  try {
    const rescuerId = req.query.id;
    const inventoryUnloaded = await rescuerService.unloadInventory(rescuerId);
    if (inventoryUnloaded) {
      res.status(201).json({ message: "Inventory unloaded successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error unloading inventory" });
  }
});

router.post("/deliver", async (req, res) => {
  try {
    const inventory = req.body;
    const inventoryDelivered = await rescuerService.deliver(inventory);
    if (inventoryDelivered) {
      res.status(201).json({ message: "Inventory delivered successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error delivered inventory" });
  }
});

module.exports = router;
