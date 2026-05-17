import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';

export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.keyword ? { $text: { $search: req.query.keyword } } : {};
  const category = req.query.category ? { category: req.query.category } : {};
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : Number.MAX_SAFE_INTEGER;
  const rating = req.query.rating ? { rating: { $gte: Number(req.query.rating) } } : {};
  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 }
  };

  const filter = {
    ...keyword,
    ...category,
    ...rating,
    price: { $gte: minPrice, $lte: maxPrice }
  };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate('category', 'name')
    .sort(sortMap[req.query.sort] || sortMap.newest)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ message: 'Product removed' });
});
