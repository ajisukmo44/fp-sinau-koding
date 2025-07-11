const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const transactionController = require("../controllers/transactionController");
const itemsRouter = express.Router();

// Middleware specific to this route
router.use((req, res, next) => {
  console.log('Product route middleware');
  next();
});

// Get all products
router.get("/", authenticateToken, transactionController.getTransaction);
router.get("/:id", authenticateToken, transactionController.getTransactionDetail);
router.post("/", authenticateToken, transactionController.addTransactions);
router.put("/:id", authenticateToken, transactionController.updateTransactionData); // Update a todo by ID
router.delete("/:id", authenticateToken, transactionController.deleteTransaction);

// Create new product
// router.post('/', (req, res) => {
//   const { name, price } = req.body;
//   res.status(201).json({ id: 3, name, price });
// });

// Update product
// router.put('/:id', (req, res) => {
//   const { id } = req.params;
//   const { name, price } = req.body;
//   res.json({ id, name, price });
// });

// Delete product
// router.delete('/:id', (req, res) => {
//   res.status(204).end();
// });

module.exports = router;