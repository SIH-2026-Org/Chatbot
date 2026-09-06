const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhook.controller');
const verifySignature = require('../middleware/verifySignature');

// Meta Webhook Verification Challenge
router.get('/', webhookController.verifyWebhook);

// Meta Incoming Event Handler (with optional HMAC signature verification)
router.post('/', verifySignature, webhookController.handleWebhook);

module.exports = router;
