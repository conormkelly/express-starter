const express = require('express');
const router = express.Router();

// Import controller methods
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../../controllers/product');

// Validation middleware
const { validateId } = require('../../middleware/validation');

// Associate controller methods with routes
router.get('/', getAllProducts);
router.get('/:id', validateId('product'), getProductById);
router.post('/', createProduct);
router.put('/:id', validateId('product'), updateProduct);
router.delete('/:id', validateId('product'), deleteProduct);

module.exports = router;
