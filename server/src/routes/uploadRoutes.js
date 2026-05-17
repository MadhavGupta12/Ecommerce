import express from 'express';
import { admin, protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  res.status(201).json({ image: `/${req.file.path.replaceAll('\\', '/')}` });
});

export default router;
