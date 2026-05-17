import express from 'express';

const router = express.Router();

router.get('/config', (_req, res) => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  res.json({ clientId: clientId && clientId !== 'your_paypal_client_id' ? clientId : 'sb' });
});

export default router;
