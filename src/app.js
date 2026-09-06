import express from 'express';
import webhookRoutes from './routes/webhook.routes.js';

const app = express();

// Parse JSON while preserving raw body for HMAC SHA-256 signature verification
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'saarthi-setu-whatsapp-bot' });
});

// Mount webhook routes
app.use('/webhook', webhookRoutes);

export default app;
