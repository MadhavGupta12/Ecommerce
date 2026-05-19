import express from 'express';
import {
  createProduct,
  createProductReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct
} from '../controllers/productController.js';
import { admin, protect } from '../middleware/authMiddleware.js';
import { cacheMiddleware, invalidateCache } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Middleware to clear product cache upon successful mutations
const clearProductCache = (req, res, next) => {
  res.on('finish', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      invalidateCache('products');
    }
  });
  next();
};

router.route('/')
  .get(cacheMiddleware(120), getProducts)
  .post(protect, admin, clearProductCache, createProduct);

router.route('/:id/reviews')
  .post(protect, clearProductCache, createProductReview);

router.route('/:id')
  .get(cacheMiddleware(300), getProductById)
  .put(protect, admin, clearProductCache, updateProduct)
  .delete(protect, admin, clearProductCache, deleteProduct);

export default router;
