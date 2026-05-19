import express from 'express';
import { 
  deleteUser, 
  getUsers, 
  updateUser, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/wishlist').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/wishlist/:productId').delete(protect, removeFromWishlist);
router.route('/:id').put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
