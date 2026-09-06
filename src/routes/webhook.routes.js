import express from 'express';
import * as webhookController from '../controllers/webhook.controller.js';
import verifySignature from '../middleware/verifySignature.js';

const router = express.Router();

// Meta Webhook Verification Challenge
router.get('/', webhookController.verifyWebhook);

// Meta Incoming Event Handler (with HMAC signature verification)
router.post('/', verifySignature, webhookController.handleWebhook);

export default router;
