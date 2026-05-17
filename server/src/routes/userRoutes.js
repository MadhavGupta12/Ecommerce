import express from 'express';
import { deleteUser, getUsers, updateUser } from '../controllers/userController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(protect, admin, getUsers);
router.route('/:id').put(protect, admin, updateUser).delete(protect, admin, deleteUser);

export default router;
