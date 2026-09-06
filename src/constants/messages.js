/**
 * SAARTHI-SETU Conversational Messages & Multilingual Templates
 */

export const ONBOARDING_MESSAGE = 
`Welcome to SAARTHI-SETU! One Call. Right Scheme. Right Door.
I am here to help you find the best government support and financial schemes tailored to your needs.  To get started, please tell me what kind of support you are looking for by typing a letter, or simply describe what you need in your own words (for example: 'I need 1.2 lakh for a dairy business'):

A) Education Loan
B) Farming & Agricultural Loan
C) MSME & Small Business Loan
D) Other Subsidies & Support`;

export const LANGUAGE_SELECT_TEMPLATE = 
'Welcome to SAARTHI-SETU! One Call. Right Scheme. Right Door.\n\nTo help you access government financial schemes and subsidies, please choose your preferred language (English or an Indian regional language) from the list below:';

export const SCHEME_MENU_TEMPLATE = 
'Welcome to SAARTHI-SETU! One Call. Right Scheme. Right Door.\n\nI am here to help you find government financial schemes and subsidies tailored to your needs. Please choose what type of financial aid you need:';

export const LOAN_DETAILS_TEMPLATES = {
  LOAN_EDU: 'You selected Education Loan. Please share your required loan amount, course details, or institute name to check matching government schemes.',
  LOAN_FARM: 'You selected Farming & Agricultural Loan. Please tell us about your farming activity (e.g. dairy, crops), land holding, or equipment needs.',
  LOAN_MSME: 'You selected MSME & Small Business Loan. Please describe your business activity (e.g. shop, manufacturing) and estimated project cost.',
};

/**
 * Supported Languages for SAARTHI-SETU (English + Indian Official Languages supported by Sarvam AI)
 */
export const SUPPORTED_LANGUAGES = [
  { id: 'LANG_en-IN', code: 'en-IN', name: 'English', native: 'English', title: 'English', description: 'English' },
  { id: 'LANG_hi-IN', code: 'hi-IN', name: 'Hindi', native: 'हिन्दी', title: 'हिन्दी (Hindi)', description: 'Hindi' },
  { id: 'LANG_pa-IN', code: 'pa-IN', name: 'Punjabi', native: 'ਪੰਜਾਬੀ', title: 'ਪੰਜਾਬੀ (Punjabi)', description: 'Punjabi' },
  { id: 'LANG_mr-IN', code: 'mr-IN', name: 'Marathi', native: 'मराठी', title: 'मराठी (Marathi)', description: 'Marathi' },
  { id: 'LANG_bn-IN', code: 'bn-IN', name: 'Bengali', native: 'বাংলা', title: 'বাংলা (Bengali)', description: 'Bengali' },
  { id: 'LANG_gu-IN', code: 'gu-IN', name: 'Gujarati', native: 'ગુજરાતી', title: 'ગુજરાતી (Gujarati)', description: 'Gujarati' },
  { id: 'LANG_ta-IN', code: 'ta-IN', name: 'Tamil', native: 'தமிழ்', title: 'தமிழ் (Tamil)', description: 'Tamil' },
  { id: 'LANG_te-IN', code: 'te-IN', name: 'Telugu', native: 'తెలుగు', title: 'తెలుగు (Telugu)', description: 'Telugu' },
  { id: 'LANG_kn-IN', code: 'kn-IN', name: 'Kannada', native: 'ಕನ್ನಡ', title: 'ಕನ್ನಡ (Kannada)', description: 'Kannada' },
  { id: 'LANG_ml-IN', code: 'ml-IN', name: 'Malayalam', native: 'മലയാളം', title: 'മലയാളം (Malayalam)', description: 'Malayalam' },
  { id: 'LANG_od-IN', code: 'od-IN', name: 'Odia', native: 'ଓଡ଼ିଆ', title: 'ଓଡ଼ିଆ (Odia)', description: 'Odia' },
];

/**
 * Fast text-input alias dictionary for language selection (supports digits and names)
 */
export const LANGUAGE_ALIAS_MAP = {
  '1': 'en-IN', 'english': 'en-IN', 'en': 'en-IN', 'eng': 'en-IN',
  '2': 'hi-IN', 'hindi': 'hi-IN', 'हिन्दी': 'hi-IN',
  '3': 'pa-IN', 'punjabi': 'pa-IN', 'ਪੰਜਾਬੀ': 'pa-IN',
  '4': 'mr-IN', 'marathi': 'mr-IN', 'मराठी': 'mr-IN',
  '5': 'bn-IN', 'bengali': 'bn-IN', 'bangla': 'bn-IN', 'বাংলা': 'bn-IN',
  '6': 'gu-IN', 'gujarati': 'gu-IN', 'ગુજરાતી': 'gu-IN',
  '7': 'ta-IN', 'tamil': 'ta-IN', 'தமிழ்': 'ta-IN',
  '8': 'te-IN', 'telugu': 'te-IN', 'తెలుగు': 'te-IN',
  '9': 'kn-IN', 'kannada': 'kn-IN', 'ಕನ್ನಡ': 'kn-IN',
  '10': 'ml-IN', 'malayalam': 'ml-IN', 'മലയാളം': 'ml-IN',
  '11': 'od-IN', 'odia': 'od-IN', 'oriya': 'od-IN', 'ଓଡ଼ିଆ': 'od-IN',
};

// Compact button titles (strictly <= 20 characters for Meta WhatsApp compliance)
export const LOAN_BUTTON_LABELS = {
  'en-IN': { edu: 'Education Loan', farm: 'Farming Loan', msme: 'MSME Loan' },
  'hi-IN': { edu: 'शिक्षा ऋण', farm: 'कृषि ऋण', msme: 'MSME ऋण' },
  'pa-IN': { edu: 'ਸਿੱਖਿਆ ਕਰਜ਼ਾ', farm: 'ਖੇਤੀ ਕਰਜ਼ਾ', msme: 'MSME ਕਰਜ਼ਾ' },
  'mr-IN': { edu: 'शिक्षण कर्ज', farm: 'शेती कर्ज', msme: 'MSME कर्ज' },
  'gu-IN': { edu: 'શિક્ષણ લોન', farm: 'ખેતી લોન', msme: 'MSME લોન' },
  'ta-IN': { edu: 'கல்விக் கடன்', farm: 'விவசாயக் கடன்', msme: 'MSME கடன்' },
  'te-IN': { edu: 'విద్య రుణం', farm: 'వ్యవసాయ రుణం', msme: 'MSME రుణం' },
  'kn-IN': { edu: 'ಶಿಕ್ಷಣ ಸಾಲ', farm: 'ಕೃಷಿ ಸಾಲ', msme: 'MSME ಸಾಲ' },
  'bn-IN': { edu: 'শিক্ষা ঋণ', farm: 'কৃষি ঋণ', msme: 'MSME ঋণ' },
  'ml-IN': { edu: 'വിദ്യാഭ്യാസ വായ്പ', farm: 'കാർഷിക വായ്പ', msme: 'MSME വായ്പ' },
  'od-IN': { edu: 'ଶିକ୍ଷା ଋଣ', farm: 'କୃଷି ଋଣ', msme: 'MSME ଋଣ' },
};

export const GREETINGS = new Set(['hi', 'hello', 'hey', 'namaste', 'greetings', 'start', 'halo', 'namaskar', 'pranam', 'satshriakal', 'sat sri akal']);
