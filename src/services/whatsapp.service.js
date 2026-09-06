const axios = require('axios');
const config = require('../config/env');

/**
 * Sends a text message to a user via Meta WhatsApp Cloud API
 * @param {string} to - Recipient's phone number with country code (e.g. "919876543210")
 * @param {string} text - The body text of the message
 * @returns {Promise<object|null>} Response data from Meta API or null on error
 */
async function sendTextMessage(to, text) {
  const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, GRAPH_API_VERSION } = config;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error(
      '[WhatsApp Service] Error: WHATSAPP_TOKEN or PHONE_NUMBER_ID is not configured in .env'
    );
    return null;
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to,
    type: 'text',
    text: {
      preview_url: false,
      body: text,
    },
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `[WhatsApp Service] Message dispatched to ${to} (Message ID: ${response.data?.messages?.[0]?.id})`
    );
    return response.data;
  } catch (error) {
    const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
    console.error(`[WhatsApp Service] Failed to send message to ${to}:`, errorDetails);
    return null;
  }
}

/**
 * Sends interactive reply buttons for scheme categories
 * @param {string} recipientPhone - Recipient's phone number
 * @returns {Promise<object|null>} Response data or null on error
 */
async function sendInteractiveButtons(recipientPhone) {
  const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, GRAPH_API_VERSION } = config;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error(
      '[WhatsApp Service] Error: WHATSAPP_TOKEN or PHONE_NUMBER_ID is not configured in .env'
    );
    return null;
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipientPhone,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: 'Welcome to SAARTHI-SETU! One Call. Right Scheme. Right Door.\n\nPlease select the type of loan/scheme support you are looking for:',
      },
      action: {
        buttons: [
          {
            type: 'reply',
            reply: {
              id: 'LOAN_EDU',
              title: 'Education Loan',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'LOAN_FARM',
              title: 'Farming Loan',
            },
          },
          {
            type: 'reply',
            reply: {
              id: 'LOAN_MSME',
              title: 'MSME Loan',
            },
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(
      `[WhatsApp Service] Interactive buttons sent to ${recipientPhone} (ID: ${response.data?.messages?.[0]?.id})`
    );
    return response.data;
  } catch (error) {
    console.error(
      `[WhatsApp Service] Error sending interactive buttons to ${recipientPhone}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

module.exports = {
  sendTextMessage,
  sendInteractiveButtons,
};
