const express = require('express');
const dbConnection = require('../config/db.js');
const userService = require('./../services/userService');
const router = express.Router();

router.get('/', function(req, res) {
  dbConnection.query('SELECT * FROM user', (err, results) => {
    if (err) {
      console.error('Error executing MySQL query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Send the results as a JSON response
      res.status(200).json(results);
    }
  });
});

router.get('/checkusername', async (req, res) => {
  const { str } = req.query;

  if (!str) {
    return res.status(400).json({ error: 'Username is required in the query parameters.' });
  }

  try {
    const isAvailable = await userService.usernameAvailable(str);

    // Return a boolean value directly
    res.status(200).json(isAvailable);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error checking username availability.' });
  }
});

router.get('/checkemail', async (req, res) => {
  const { str } = req.query;

  if (!str) {
    return res.status(400).json({ error: 'Email is required in the query parameters.' });
  }

  try {
    const isAvailable = await userService.emailAvailable(str);

    // Return a boolean value directly
    res.status(200).json(isAvailable);
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error checking email availability.' });
  }
});

module.exports = router;