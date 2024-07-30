const express = require("express");
const rescuerManagementService = require("../../services/rescuerManagementService.js");
const router = express.Router();

router.get("/rescuers", async (req, res) => {
    try {
        const rescuers = await rescuerManagementService.getRescuers();

        res.status(200).json(rescuers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching rescuers"});
    }
});

router.get("/rescuers/:id/inventory", async (req, res) => {
    try {

        const id = req.params['id']
        const items = await rescuerManagementService.getRescuerInventory(id);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching inventory"});
    }
});


router.post("/rescuers", async (req, res) => {
    try {
        const username = req.body.username;
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const phone = req.body.phone;
        const vehicleType = req.body.vehicleType;

        const newRescuerId = await rescuerManagementService.createRescuer(username, name, email, password, phone, vehicleType);


        res.status(200).json({id: newRescuerId, message: "Created rescuer successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating rescuer"});
    }
});


module.exports = router;

