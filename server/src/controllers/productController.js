import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 8;
  const page = Number(req.query.page) || 1;
  
  // Advanced fuzzy search using regex across name and brand
  const keyword = req.query.keyword ? {
    $or: [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { brand: { $regex: req.query.keyword, $options: 'i' } }
    ]
  } : {};
  
  // Handle category filter - support both ObjectId and slug
  let category = {};
  if (req.query.category) {
    const categoryDoc = await Category.findOne({ 
      $or: [
        { _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null },
        { slug: req.query.category }
      ].filter(c => c !== null)
    });
    if (categoryDoc) {
      category = { category: categoryDoc._id };
    }
  }
  
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
  let product;
  
  // Try to find by slug first
  product = await Product.findOne({ slug: req.params.id }).populate('category', 'name');
  
  // If not found, try to find by ObjectId (if it's a valid MongoDB ID)
  if (!product && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(req.params.id).populate('category', 'name');
  }
  
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
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
