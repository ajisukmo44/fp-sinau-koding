const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const catalogController = require("../controllers/catalogController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('catalog route middleware');
  next();
});

// Get all catalogs
router.get("/", authenticateToken, catalogController.getCatalog);
router.get("/:id", authenticateToken, catalogController.getCatalogDetail);
router.post("/", authenticateToken, catalogController.addCatalogs);
router.put("/:id", authenticateToken, catalogController.updateCatalogData); // Update a todo by ID
router.delete("/:id", authenticateToken, catalogController.deleteCatalog);

module.exports = router;