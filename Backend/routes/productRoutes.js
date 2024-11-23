const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController'); // Ensure this path is correct

// Route to add a product
router.post('/add-product', productController.addProduct);

// Route to fetch all products
router.get('/products', productController.getProducts);

module.exports = router;
