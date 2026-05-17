import express from 'express';
import { getDashboardStats } from '../controllers/adminController.js';
import { admin, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);

export default router;
