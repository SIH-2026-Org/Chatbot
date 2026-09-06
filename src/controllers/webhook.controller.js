const config = require('../config/env');
const { ONBOARDING_MESSAGE, GREETINGS } = require('../constants/messages');
const whatsappService = require('../services/whatsapp.service');

/**
 * Webhook Verification (GET /webhook)
 * Handles Meta's initial challenge-response handshake
 */
function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.META_VERIFY_TOKEN) {
    console.log('[Webhook Verification] Handshake successful.');
    return res.status(200).send(challenge);
  }

  console.warn('[Webhook Verification] Failed verification attempt. Token mismatch or invalid mode.');
  return res.sendStatus(403);
}

/**
 * Webhook Event Handler (POST /webhook)
 * Processes incoming WhatsApp messages and notifications
 */
function handleWebhook(req, res) {
  // 1. Non-Blocking Execution: Respond immediately with 200 OK to satisfy Meta's timeout requirements
  res.sendStatus(200);

  // 2. Safely parse Meta's nested payload with strict null checks
  const changeValue = req.body?.entry?.[0]?.changes?.[0]?.value;

  // If payload is empty or not matching expected structure, ignore gracefully
  if (!changeValue) {
    return;
  }

  // Handle status updates (e.g., sent, delivered, read receipts) without throwing errors
  if (changeValue.statuses && changeValue.statuses.length > 0) {
    const status = changeValue.statuses[0];
    console.log(`[Status Update] Message to ${status.recipient_id} status: ${status.status}`);
    return;
  }

  // Safely extract incoming message
  const message = changeValue.messages?.[0];
  if (!message) {
    return;
  }

  const senderPhone = message.from;
  const messageType = message.type;

  // 3. Process text messages
  if (messageType === 'text' && message.text?.body) {
    const incomingText = message.text.body.trim().toLowerCase();
    console.log(`[Incoming Message] From: ${senderPhone} | Text: "${message.text.body}"`);

    // Case-insensitive check for greetings
    if (GREETINGS.has(incomingText)) {
      console.log(`[Greeting Trigger] Matched greeting "${incomingText}". Sending interactive buttons...`);

      // Asynchronous dispatch of interactive buttons (non-blocking)
      whatsappService.sendInteractiveButtons(senderPhone).catch((err) => {
        console.error(`[Dispatch Error] Failed to send buttons to ${senderPhone}:`, err);
      });
    }
  } 
  // 4. Process interactive button replies
  else if (messageType === 'interactive' && message.interactive?.button_reply) {
    const buttonId = message.interactive.button_reply.id;
    const buttonTitle = message.interactive.button_reply.title;

    console.log(`[Interactive Response] From: ${senderPhone} | Button ID: ${buttonId} | Title: "${buttonTitle}"`);

    // Clean switch routing based on selected button ID
    switch (buttonId) {
      case 'LOAN_EDU':
        console.log(`[Route: Education Loan] User ${senderPhone} selected Education Loan.`);
        whatsappService.sendTextMessage(
          senderPhone,
          'You selected Education Loan. Please share your required loan amount, course details, or institute name to proceed.'
        ).catch((err) => console.error('[Dispatch Error]:', err));
        break;

      case 'LOAN_FARM':
        console.log(`[Route: Farming Loan] User ${senderPhone} selected Farming Loan.`);
        whatsappService.sendTextMessage(
          senderPhone,
          'You selected Farming & Agricultural Loan. Please tell us about your farming activity, land holding, or equipment needs.'
        ).catch((err) => console.error('[Dispatch Error]:', err));
        break;

      case 'LOAN_MSME':
        console.log(`[Route: MSME Loan] User ${senderPhone} selected MSME Loan.`);
        whatsappService.sendTextMessage(
          senderPhone,
          'You selected MSME & Small Business Loan. Please describe your business activity (e.g. dairy, retail) and estimated project cost.'
        ).catch((err) => console.error('[Dispatch Error]:', err));
        break;

      default:
        console.warn(`[Route: Unknown] Unrecognized button ID "${buttonId}" received from ${senderPhone}.`);
        break;
    }
  } else {
    console.log(`[Incoming Message] Non-handled message received (type: ${messageType}) from ${senderPhone}`);
  }
}

module.exports = {
  verifyWebhook,
  handleWebhook,
};
