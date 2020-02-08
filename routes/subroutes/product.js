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

// Associate controller methods with routes
router.route('/').get(getAllProducts);
router.route('/:id').get(getProductById);
router.route('/').post(createProduct);
router.route('/:id').put(updateProduct);
router.route('/:id').delete(deleteProduct);

module.exports = router;
