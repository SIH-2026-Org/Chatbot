import axios from 'axios';
import config from '../config/env.js';

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
 * Sends interactive reply buttons via Meta WhatsApp Cloud API
 * @param {string} recipientPhone - Recipient's phone number
 * @param {string} [bodyText] - Custom message body text
 * @param {Array<{id: string, title: string}>} [buttons] - Array of up to 3 buttons
 * @returns {Promise<object|null>} Response data or null on error
 */
async function sendInteractiveButtons(recipientPhone, bodyText, buttons) {
  const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, GRAPH_API_VERSION } = config;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error(
      '[WhatsApp Service] Error: WHATSAPP_TOKEN or PHONE_NUMBER_ID is not configured in .env'
    );
    return null;
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const defaultBody = 'Welcome to SAARTHI-SETU! One Call. Right Scheme. Right Door.\n\nPlease select the type of loan/scheme support you are looking for:';
  const defaultButtons = [
    { id: 'LOAN_EDU', title: 'Education Loan' },
    { id: 'LOAN_FARM', title: 'Farming Loan' },
    { id: 'LOAN_MSME', title: 'MSME Loan' },
  ];

  const activeBody = bodyText || defaultBody;
  const activeButtons = (buttons && buttons.length > 0 ? buttons : defaultButtons).slice(0, 3);

  const formattedButtons = activeButtons.map((btn) => ({
    type: 'reply',
    reply: {
      id: String(btn.id),
      // Meta WhatsApp button title maximum 20 characters
      title: String(btn.title).slice(0, 20),
    },
  }));

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipientPhone,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: {
        text: activeBody,
      },
      action: {
        buttons: formattedButtons,
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
      `[WhatsApp Service] Interactive buttons dispatched to ${recipientPhone} (ID: ${response.data?.messages?.[0]?.id})`
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

/**
 * Sends an interactive list message via Meta WhatsApp Cloud API
 * @param {string} recipientPhone - Recipient's phone number
 * @param {string} bodyText - Body text of the list message
 * @param {string} buttonText - Text on the list trigger button (e.g. "Select Language", max 20 chars)
 * @param {Array<{id: string, title: string, description?: string}>} rows - Array of up to 10 rows
 * @param {string} [sectionTitle="Available Languages"] - Title of the section (max 24 chars)
 * @returns {Promise<object|null>} Response data or null on error
 */
async function sendInteractiveList(recipientPhone, bodyText, buttonText, rows, sectionTitle = 'Available Languages') {
  const { WHATSAPP_TOKEN, PHONE_NUMBER_ID, GRAPH_API_VERSION } = config;

  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error(
      '[WhatsApp Service] Error: WHATSAPP_TOKEN or PHONE_NUMBER_ID is not configured in .env'
    );
    return null;
  }

  const endpoint = `https://graph.facebook.com/${GRAPH_API_VERSION}/${PHONE_NUMBER_ID}/messages`;

  const formattedRows = (rows || []).slice(0, 10).map((row) => ({
    id: String(row.id),
    title: String(row.title).slice(0, 24),
    description: row.description ? String(row.description).slice(0, 72) : undefined,
  }));

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: recipientPhone,
    type: 'interactive',
    interactive: {
      type: 'list',
      header: {
        type: 'text',
        text: 'SAARTHI-SETU',
      },
      body: {
        text: bodyText,
      },
      action: {
        button: String(buttonText || 'Choose Option').slice(0, 20),
        sections: [
          {
            title: String(sectionTitle).slice(0, 24),
            rows: formattedRows,
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
      `[WhatsApp Service] Interactive list message dispatched to ${recipientPhone} (ID: ${response.data?.messages?.[0]?.id})`
    );
    return response.data;
  } catch (error) {
    console.error(
      `[WhatsApp Service] Error sending interactive list to ${recipientPhone}:`,
      error.response?.data || error.message
    );
    return null;
  }
}

export {
  sendTextMessage,
  sendInteractiveButtons,
  sendInteractiveList,
};

export default {
  sendTextMessage,
  sendInteractiveButtons,
  sendInteractiveList,
};
