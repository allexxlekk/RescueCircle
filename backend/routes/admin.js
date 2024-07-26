const express = require("express");
const adminService = require("../services/adminService.js");
const router = express.Router();


// Category Related Endpoints

// 1) Get Categories with optional search
router.get("/categories", async (req, res) => {
    try {
        const search = req.query.search;
        const categories = await adminService.getCategories(search);

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching categories"});
    }
});

// 2) Create Category
router.post("/categories", async (req, res) => {
    try {
        const name = req.body.name; // Changed from req.query to req.body

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const categoryId = await adminService.addCategory(name);

        if (categoryId) {
            res.status(201).json({ id: categoryId, message: "Category created successfully" });
        } else {
            res.status(400).json({ error: "This category already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error creating category" });
    }
});

// 3) Edit Category name
router.patch("/categories/:id", async (req, res) => {
    try {
        const name = req.body.name; // Changed from req.query to req.body
        const id = req.params['id']

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const categoryId = await adminService.editCategoryName(id, name);

        if (categoryId) {
            res.status(201).json({ id: categoryId, message: "Category edited successfully" });
        } else {
            res.status(400).json({ error: "This category already exists" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error updating category" });
    }
});

// 4) Delete Category
router.delete("/categories/:id", async (req, res) => {
    try {
        const id = req.params['id']

        const success = await adminService.deleteCategory(id);

        if (success) {
            res.status(200).json({ message: "Category deleted successfully" });
        } else {
            res.status(400).json({ error: "This category cannot be deleted" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error deleting category" });
    }
});

// 5) Check name availability
router.get("/categories/name-available", async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            return res.status(400).json({ error: "Category name is required" });
        }

        const availability = await adminService.isCategoryNameAvailable(name);

        res.status(200).send(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error checking category name availability"});
    }
});

module.exports = router;

