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

router.get('/citizens', async (req, res) => {
  try {
    // Extract the citizenId from the route parameters
    // Call your service function with the extracted citizenId
    const requests = await requestService.fetchCitizenRequests();

    // Send the fetched requests as a JSON response
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching requests' });
  }
});

// // GET 
router.get('/citizen/:citizenId', async (req, res) => {
  try {
    // Extract the citizenId from the route parameters
    const citizenId = req.params.citizenId;

    // Call your service function with the extracted citizenId
    const requests = await requestService.fetchRequestsForCitizen(citizenId);

    // Send the fetched requests as a JSON response
    res.status(200).json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching requests' });
  }
});




module.exports = router;