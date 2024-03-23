const express = require("express");
const rescuerService = require("../services/rescuerService.js");
const router = express.Router();

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

router.get("/active-tasks", async (req, res) => {
  try {
    const rescuerId = req.query.id;
    const activeTasks = await rescuerService.fetchTasks(rescuerId);
    res.status(200).json(activeTasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching ative tasks" });
  }
});

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

router.put("/accept-request", async (req, res) => {
  try {
    const rescuerId = req.query.rescuer;
    const requestId = req.query.request;
    const requestAccepted = await rescuerService.acceptRequest(
      rescuerId,
      requestId
    );
    if (requestAccepted) {
      res.status(201).json({ message: "Request accepted" });
    } else {
      res.status(409).json({ message: "You can't accept this request" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error accepting request" });
  }
});

router.put("/cancel-request", async (req, res) => {
  try {
    const rescuerId = req.query.rescuer;
    const requestId = req.query.request;
    const requestCanceled = await rescuerService.cancelRequest(
        rescuerId,
        requestId
    );
    if (requestCanceled) {
      res.status(201).json({ message: "Request cancelled" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling request" });
  }
});

router.put("/accept-offer", async (req, res) => {
  try {
    const rescuerId = req.query.rescuer;
    const offerId = req.query.offer;
    const offerAccepted = await rescuerService.acceptOffer(
        rescuerId,
        offerId
    );
    if (offerAccepted) {
      res.status(201).json({ message: "Offer accepted" });
    } else {
      res.status(409).json({ message: "You can't accept this offer" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error accepting offer" });
  }
});

router.put("/cancel-offer", async (req, res) => {
  try {
    const rescuerId = req.query.rescuer;
    const offerId = req.query.offer;
    const offerCanceled = await rescuerService.cancelOffer(
        rescuerId,
        offerId
    );
    if (offerCanceled) {
      res.status(201).json({ message: "Offer cancelled" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error cancelling offer" });
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
