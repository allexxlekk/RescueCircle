const express = require('express');
const requestService = require('../services/requestService.js');
const router = express.Router();
const cookieParser = require('cookie-parser');
const authenticateToken = require('../middleware/auth');

router.use(cookieParser());
//ADD NEW REQUEST
router.post('/', authenticateToken, async (req, res) => {

    try {
        let request = req.body;
        request.citizenId = req.user.id;
        const requestAdded = await requestService.addRequest(request);
        if (requestAdded) {
            res.status(201).json({message: 'Request added successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error adding request'});
    }
});

router.get('/citizens', async (req, res) => {
    try {
        // Extract the citizenId from the route parameters
        // Call service function with the extracted citizenId
        const requests = await requestService.fetchCitizenRequests();

        // Send the fetched requests as a JSON response
        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching requests'});
    }
});

// // GET 
router.get('/citizen', authenticateToken, async (req, res) => {
    try {
        const citizenId = req.user.id; // Get the ID from the decoded token

        const requests = await requestService.fetchRequestsForCitizen(citizenId);

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching requests'});
    }
});

router.get('/citizen:citizenId', authenticateToken, async (req, res) => {
    try {
        const citizenId = req.params.citizenId; // Get the ID from the decoded token

        const requests = await requestService.fetchRequestsForCitizen(citizenId);

        res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching requests'});
    }
});


module.exports = router;
