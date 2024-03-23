const express = require("express");
const offersService = require("../services/offersService.js");
const router = express.Router();
router.post('/', async (req, res) => {

    try {
        const offer = req.body;
        const offerAdded = await offersService.addOffer(offer);
        if (offerAdded) {
            res.status(201).json({message: 'Offer added successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error adding offer'});
    }
});

router.delete('/:offerId', async (req, res) => {

    try {
        const offerId = req.params.offerId;
        const offerDeleted = await offersService.cancelOffer(offerId);
        if (offerDeleted) {
            res.status(200).json({message: 'Offer deleted successfully'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error deleting offer'});
    }
});

router.get('/citizen/:citizenId', async (req, res) => {
    try {
        const citizenId = req.params.citizenId;

        const offers = await offersService.fetchOffersForCitizen(citizenId);

        res.status(200).json(offers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error fetching requests'});
    }
});

module.exports = router;
