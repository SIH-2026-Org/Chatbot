const crypto = require('crypto');
const config = require('../config/env');

/**
 * Validates Meta webhook payload using HMAC-SHA256 signature
 */
function verifySignature(req, res, next) {
  const appSecret = config.META_APP_SECRET;

  // If no app secret is set (e.g. during local testing without verification), proceed
  if (!appSecret) {
    return next();
  }

  const signatureHeader = req.headers['x-hub-signature-256'];

  if (!signatureHeader) {
    console.error('[Signature Error] Missing x-hub-signature-256 header.');
    return res.sendStatus(403);
  }

  const [algorithm, providedHash] = signatureHeader.split('=');

  if (algorithm !== 'sha256' || !providedHash) {
    console.error('[Signature Error] Malformed signature header format.');
    return res.sendStatus(403);
  }

  // req.rawBody is attached by express.json({ verify: ... })
  const rawPayload = req.rawBody || Buffer.from(JSON.stringify(req.body));

  const hmac = crypto.createHmac('sha256', appSecret);
  hmac.update(rawPayload);
  const generatedHash = hmac.digest('hex');

  const expectedBuffer = Buffer.from(generatedHash, 'utf8');
  const providedBuffer = Buffer.from(providedHash, 'utf8');

  if (
    expectedBuffer.length === providedBuffer.length &&
    crypto.timingSafeEqual(expectedBuffer, providedBuffer)
  ) {
    return next();
  } else {
    console.error('[Signature Error] Payload verification failed. Hashes do not match.');
    return res.sendStatus(403);
  }
}

module.exports = verifySignature;
