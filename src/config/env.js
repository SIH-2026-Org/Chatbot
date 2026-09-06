require('dotenv').config();

const config = {
  PORT: process.env.PORT || 3000,
  META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN,
  META_APP_SECRET: process.env.META_APP_SECRET,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  GRAPH_API_VERSION: process.env.GRAPH_API_VERSION || 'v20.0',
};

// Validate critical WhatsApp sending credentials
if (!config.WHATSAPP_TOKEN || !config.PHONE_NUMBER_ID) {
  console.warn(
    '[Config Warning] WHATSAPP_TOKEN or PHONE_NUMBER_ID is missing. Outgoing WhatsApp messages cannot be delivered until configured in .env'
  );
}

module.exports = config;
