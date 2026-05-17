import express from 'express';

const router = express.Router();

router.get('/config', (_req, res) => {
  res.json({ clientId: process.env.PAYPAL_CLIENT_ID || 'sb' });
});

export default router;
