const express = require('express');
const dbConnection = require('../config/db.js');
const userService = require('./../services/userService');
const categoryService = require('../services/categoryService.js');
const router = express.Router();


// ADD CATEGORY
router.post('/', async (req, res) => {
  const { categoryName } = req.query;

  if (!categoryName) {
      return res.status(400).json({ error: 'Category name is required' });
  }
  
  try {
      const categoryAdded = await categoryService.addCategory(categoryName);
      if (categoryAdded) {
          res.status(201).json({ message: 'Category added successfully' });
      } else {
          res.status(409).json({ error: 'Category already exists' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error during category creation' });
  }
});

// GET ALL CATEGORIES
router.get('/', async (req, res) => {
  try{
    //1) Get all categories
    const categories = await categoryService.getAllCategories();
    //2) Return all categories
    res.status(200).json({categories});
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories'});
  }
});



module.exports = router;