const express = require("express");
const warehouseManagementService = require("../../services/wareHouseManagementService.js");
const router = express.Router();


// Item Related Endpoints

// 1) Get Items by Category with optional search
router.get("/items/:categoryId", async (req, res) => {
    try {
        const search = req.query.search;
        const categoryId = req.params['categoryId']
        const items = await warehouseManagementService.getItemsByCategory(categoryId, search);

        res.status(200).json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching items"});
    }
});

// 2) Update Item Quantity
router.patch("/items/:itemId/update-quantity", async (req, res) => {
    try {
        const itemId = req.params['itemId'];
        const newQuantity = req.body.quantity;
        await warehouseManagementService.updateItemQuantity(itemId, newQuantity);

        res.status(200).json({message: "Quantity updated successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching items"});
    }
});

// 3) Create Item
router.post("/items", async (req, res) => {
    try {
        const name = req.body.name;
        const categoryId = req.body.category;
        const description = req.body.description;
        const quantity = req.body.quantity;
        const offerQuantity = req.body.offerQuantity;
        const newItemId = await warehouseManagementService.addItem(
            name,
            categoryId,
            description,
            quantity,
            offerQuantity
        );

        res.status(200).json({id: newItemId, message: "Created item successfully"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error fetching items"});
    }
});

// Category Related Endpoints

// 1) Get Categories with optional search
router.get("/categories", async (req, res) => {
    try {
        const search = req.query.search;
        const categories = await warehouseManagementService.getCategories(search);

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
            return res.status(400).json({error: "Category name is required"});
        }

        const categoryId = await warehouseManagementService.addCategory(name);

        if (categoryId) {
            res.status(201).json({id: categoryId, message: "Category created successfully"});
        } else {
            res.status(400).json({error: "This category already exists"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error creating category"});
    }
});

// 3) Edit Category name
router.patch("/categories/:id", async (req, res) => {
    try {
        const name = req.body.name; // Changed from req.query to req.body
        const id = req.params['id']

        if (!name) {
            return res.status(400).json({error: "Category name is required"});
        }

        const categoryId = await warehouseManagementService.editCategoryName(id, name);

        if (categoryId) {
            res.status(201).json({id: categoryId, message: "Category edited successfully"});
        } else {
            res.status(400).json({error: "This category already exists"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error updating category"});
    }
});

// 4) Delete Category
router.delete("/categories/:id", async (req, res) => {
    try {
        const id = req.params['id']

        const success = await warehouseManagementService.deleteCategory(id);

        if (success) {
            res.status(200).json({message: "Category deleted successfully"});
        } else {
            res.status(400).json({error: "This category cannot be deleted"});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error deleting category"});
    }
});

// 5) Check name availability
router.get("/categories/name-available", async (req, res) => {
    try {
        const name = req.query.name;

        if (!name) {
            return res.status(400).json({error: "Category name is required"});
        }

        const availability = await warehouseManagementService.isCategoryNameAvailable(name);

        res.status(200).send(availability);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Error checking category name availability"});
    }
});

module.exports = router;

