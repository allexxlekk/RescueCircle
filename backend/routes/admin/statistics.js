const express = require("express");
const statisticsService = require("../../services/overviewService.js");
const router = express.Router();

router.get("/graph", async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        const graph = await statisticsService.getStatistics(startDate, endDate);

        res.status(200).json(graph);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching graph"});
    }
});



module.exports = router;

