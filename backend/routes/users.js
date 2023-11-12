const express = require('express');
const dbConnection = require('../config/db.js');
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

module.exports = router;