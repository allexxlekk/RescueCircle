const express = require('express');
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
    const categories = await categoryService.getAllCategories();
    res.status(200).json({categories});
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories'});
  }
});

// GET CATEGORIES AND COUNT ITEMS
router.get('/count', async (req, res) => {
  try{
    const categoryWithCounts = await categoryService.getItemsCountInCategory();
    res.status(200).json(categoryWithCounts);
  }catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error fetching categories'});
  }
});

//TODO: add endpoint to see if the category already exists while
// typing the category name in the frontend
module.exports = router;