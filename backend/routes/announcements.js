const express = require("express");
const announcementService = require("../services/announcementService.js");
const router = express.Router();

// ADD ANNOUNCEMENT
router.post("/", async (req, res) => {
  try {
    const announcement = req.body;
    const announcementAdded = await announcementService.createAnnouncement(announcement);
    if (announcementAdded) {
      res.status(201).json({ message: "Announcement added successfully" });
    } else {
      res.status(409).json({ error: "Announcement not added." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error adding item" });
  }
});

// GET ALL ANNOUNCEMENTS
router.get("/", async (req, res) => {
  try {
    const announcements = await announcementService.getAllAnnouncements();
    res.status(200).json({ announcements });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching categories" });
  }
});

module.exports = router;
