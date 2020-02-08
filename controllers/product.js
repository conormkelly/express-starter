const Product = require('../models/Product');

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  return res.status(200).json({ success: true, data: products });
};

exports.getProductById = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.status(200).json({ success: true, data: product });
};

exports.createProduct = async (req, res, next) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
};

exports.updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true
  });
  res.status(200).json({ success: true, data: product });
};

exports.deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  res.status(200).json({ success: true, data: product });
};
