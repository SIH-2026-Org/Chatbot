import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: process.env.PORT || 3000,
  META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN,
  META_APP_SECRET: process.env.META_APP_SECRET,
  WHATSAPP_TOKEN: process.env.WHATSAPP_TOKEN,
  PHONE_NUMBER_ID: process.env.PHONE_NUMBER_ID,
  SARVAM_API: process.env.SARVAM_API,
  GRAPH_API_VERSION: process.env.GRAPH_API_VERSION || 'v20.0',
};

// Validate critical WhatsApp sending credentials
if (!config.WHATSAPP_TOKEN || !config.PHONE_NUMBER_ID) {
  console.warn(
    '[Config Warning] WHATSAPP_TOKEN or PHONE_NUMBER_ID is missing. Outgoing WhatsApp messages cannot be delivered until configured in .env'
  );
}

if (!config.SARVAM_API) {
  console.warn(
    '[Config Warning] SARVAM_API is missing. Regional translations will fallback to English/Hindi.'
  );
}

export default config;
export { config };
