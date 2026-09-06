import config from '../config/env.js';
import {
  LANGUAGE_SELECT_TEMPLATE,
  SCHEME_MENU_TEMPLATE,
  LOAN_DETAILS_TEMPLATES,
  LOAN_BUTTON_LABELS,
  SUPPORTED_LANGUAGES,
  LANGUAGE_ALIAS_MAP,
  GREETINGS,
} from '../constants/messages.js';
import * as whatsappService from '../services/whatsapp.service.js';
import * as translationService from '../services/translation.service.js';
import * as sessionService from '../services/session.service.js';

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
 * Prompts user to select a language from the official Indian languages supported by Sarvam AI
 * @param {string} senderPhone - User's phone number
 */
async function promptLanguageSelectionList(senderPhone) {
  console.log(`[Language Prompt] Presenting 10 official Indian languages to ${senderPhone}`);

  // Immediately set session to awaiting language
  sessionService.updateSession(senderPhone, {
    stage: 'AWAITING_LANGUAGE',
    selectedLanguageCode: null,
  });

  const listRows = SUPPORTED_LANGUAGES.map((lang) => ({
    id: lang.id,
    title: lang.title,
    description: lang.name,
  }));

  await whatsappService.sendInteractiveList(
    senderPhone,
    LANGUAGE_SELECT_TEMPLATE,
    'Select Language',
    listRows,
    'Indian Languages'
  );
}

/**
 * Sends the main loan & scheme onboarding menu translated into user's selected language
 * @param {string} senderPhone - User's phone number
 * @param {string} languageCode - User's chosen language code
 */
async function sendSchemeMenu(senderPhone, languageCode) {
  // Update session state immediately
  sessionService.updateSession(senderPhone, {
    selectedLanguageCode: languageCode,
    stage: 'AWAITING_SCHEME_CATEGORY',
  });

  // Translate scheme menu prompt into the user's chosen language
  const translatedMenuText = await translationService.translateText(
    SCHEME_MENU_TEMPLATE,
    languageCode,
    'en-IN'
  );

  const labels = LOAN_BUTTON_LABELS[languageCode] || LOAN_BUTTON_LABELS['en-IN'];
  const buttons = [
    { id: 'LOAN_EDU', title: labels.edu },
    { id: 'LOAN_FARM', title: labels.farm },
    { id: 'LOAN_MSME', title: labels.msme },
  ];

  await whatsappService.sendInteractiveButtons(senderPhone, translatedMenuText, buttons);
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
  if (!changeValue) {
    return;
  }

  // Handle status updates (e.g. sent, delivered, read receipts) without throwing errors
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
  const session = sessionService.getSession(senderPhone);

  // =========================================================================
  // 3. Process Interactive Responses (Button Replies OR List Replies)
  // =========================================================================
  if (messageType === 'interactive' && message.interactive) {
    const interaction = message.interactive.button_reply || message.interactive.list_reply;
    if (!interaction) {
      return;
    }

    const optionId = interaction.id;
    const optionTitle = interaction.title;
    console.log(`[Interactive Response] From: ${senderPhone} | Selected ID: ${optionId} ("${optionTitle}")`);

    // A) User selected a language from the list
    if (optionId.startsWith('LANG_')) {
      const selectedLanguage = optionId.replace('LANG_', '');
      console.log(`[Language Selected] User ${senderPhone} selected language: ${selectedLanguage}`);

      sendSchemeMenu(senderPhone, selectedLanguage).catch((err) => {
        console.error('[Dispatch Error] Failed to send scheme menu after language selection:', err);
      });
      return;
    }

    // B) User selected a loan category button
    if (optionId.startsWith('LOAN_')) {
      const activeLanguage = session?.selectedLanguageCode || 'en-IN';
      const englishTemplate =
        LOAN_DETAILS_TEMPLATES[optionId] ||
        'You have selected a scheme category. Please share details of your financial requirement.';

      console.log(`[Scheme Category Selected] Button: ${optionId} | Language: ${activeLanguage}`);

      // Update session stage immediately
      sessionService.updateSession(senderPhone, { stage: 'IN_CONVERSATION' });

      // Translate response text into the user's chosen language
      translationService
        .translateText(englishTemplate, activeLanguage, 'en-IN')
        .then((translatedResponse) => {
          return whatsappService.sendTextMessage(senderPhone, translatedResponse);
        })
        .catch((err) => {
          console.error('[Dispatch Error] Failed to send loan category response:', err);
        });
      return;
    }
  }

  // =========================================================================
  // 4. Process Inbound Text Messages
  // =========================================================================
  if (messageType === 'text' && message.text?.body) {
    const incomingText = message.text.body.trim();
    const normalizedInput = incomingText.toLowerCase();
    const isGreeting = GREETINGS.has(normalizedInput);

    console.log(`[Incoming Message] From: ${senderPhone} | Text: "${incomingText}" | isGreeting: ${isGreeting}`);

    // If greeting received: Start everything over with fresh language selection
    if (isGreeting) {
      if (session) {
        console.log(`[Session Reset] Greeting "${incomingText}" received from active session ${senderPhone}. Restarting session.`);
      }
      sessionService.resetSession(senderPhone);
      promptLanguageSelectionList(senderPhone).catch((err) => {
        console.error('[Dispatch Error] Failed to send language list on greeting:', err);
      });
      return;
    }

    // If user has NOT selected a language yet:
    if (!session || !session.selectedLanguageCode) {
      // Check if user typed language number (1-10) or language name (e.g. "hindi", "punjabi")
      const matchedLang = LANGUAGE_ALIAS_MAP[normalizedInput];
      if (matchedLang) {
        console.log(`[Text Language Select] Matched text input "${incomingText}" to ${matchedLang}`);
        sendSchemeMenu(senderPhone, matchedLang).catch((err) => {
          console.error('[Dispatch Error] Failed to send scheme menu from text selection:', err);
        });
        return;
      }

      // If text doesn't match any language, present language list menu
      promptLanguageSelectionList(senderPhone).catch((err) => {
        console.error('[Dispatch Error] Failed to prompt language selection list:', err);
      });
      return;
    }

    // If user is already in session and provided scheme details / questions:
    const selectedLanguage = session.selectedLanguageCode;
    const englishReply =
      `Thank you for your message: "${incomingText}". Our scheme matching engine is analyzing your request to find government subsidies and loan schemes tailored for you.`;

    translationService
      .translateText(englishReply, selectedLanguage, 'en-IN')
      .then((translatedReply) => {
        return whatsappService.sendTextMessage(senderPhone, translatedReply);
      })
      .catch((err) => {
        console.error('[Dispatch Error] Failed to dispatch user query response:', err);
      });
    return;
  }

  console.log(`[Incoming Message] Unhandled message type: ${messageType} from ${senderPhone}`);
}

export {
  verifyWebhook,
  handleWebhook,
  promptLanguageSelectionList,
  sendSchemeMenu,
};

export default {
  verifyWebhook,
  handleWebhook,
  promptLanguageSelectionList,
  sendSchemeMenu,
};
