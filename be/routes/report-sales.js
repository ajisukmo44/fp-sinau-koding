const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const reportSalesController = require("../controllers/admin/reportSalesController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('Product route middleware');
  next();
});

// Get all products
router.get("/", authenticateToken, reportSalesController.getReportSales);
router.get("/:id", authenticateToken, reportSalesController.getReportSalesDetail);

module.exports = router;