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

router.get('/byRole', async (req, res) => {
  //BLOCK 1 START
  // Check restrictions for bad requests
  //TODO: ADD ADMIN ONLY REQUIRED
  //if(!userService.isAdmin){
    // return res.status(404).json({error : 'Not found'})
  // }

  const { role } = req.query;

  if (!role) {
    return res.status(400).json({ error: 'Role is required' });
  }

 if(role != "CITIZEN" || role != "RESCUER"){
    return res.status(400).json({error: 'Invalid Role'})
 }
  //BLOCK 1 END

  //BLOCK 2 START
  // Implements business logic  
  try {
    const users = await userService.getUsersByRole(role);
    res.status(200).json(users);
  // BLOCK 2 END
  }
  // ERROR MESSAGE 
  catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error during get users by role' });
  }

});

module.exports = router;