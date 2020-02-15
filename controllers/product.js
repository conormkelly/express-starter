const asyncHandler = require('../utils/error-handling/asyncHandler');
const ErrorResponse = require('../utils/error-handling/ErrorResponse');
const Product = require('../models/Product');

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({ success: true, data: products });
});

exports.getProductById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    return next(
      new ErrorResponse({
        message: `No product found with ID: '${id}'.`,
        statusCode: 404
      })
    );
  }

  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  if (!product) {
    return next(
      new ErrorResponse({
        message: `No product found with ID: '${id}'.`,
        statusCode: 404
      })
    );
  }

  product = await Product.findByIdAndUpdate(id, req.body, { new: true });
  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  let product = await Product.findById(id);

  if (!product) {
    return next(
      new ErrorResponse({
        message: `No product found with ID: '${id}'.`,
        statusCode: 404
      })
    );
  }

  product = await Product.findByIdAndDelete(id);
  res.status(200).json({ success: true, data: product });
});
