import axios from 'axios';
import config from '../config/env.js';

// In-memory translation cache to optimize latency and minimize API calls
const translationCache = new Map();

/**
 * Translates text from source language to target language using Sarvam AI Translate API
 * @param {string} text - Text to translate
 * @param {string} targetLanguageCode - Sarvam language code (e.g. 'hi-IN', 'pa-IN', 'mr-IN', 'ta-IN', etc.)
 * @param {string} [sourceLanguageCode='en-IN'] - Source language code (default 'en-IN')
 * @returns {Promise<string>} Translated text, or original text on error/English
 */
async function translateText(text, targetLanguageCode, sourceLanguageCode = 'en-IN') {
  if (!text || !targetLanguageCode) {
    return text;
  }

  // No translation needed if target is English
  if (targetLanguageCode === 'en-IN' || targetLanguageCode === 'en') {
    return text;
  }

  // Check cache
  const cacheKey = `${sourceLanguageCode}:${targetLanguageCode}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const apiKey = config.SARVAM_API;
  if (!apiKey) {
    console.warn('[Translation Service] Missing SARVAM_API key. Returning untranslated text.');
    return text;
  }

  const endpoint = 'https://api.sarvam.ai/translate';

  const payload = {
    input: text,
    source_language_code: sourceLanguageCode,
    target_language_code: targetLanguageCode,
    speaker_gender: 'Female',
    mode: 'formal',
    model: 'mayura:v1',
  };

  try {
    const response = await axios.post(endpoint, payload, {
      headers: {
        'api-subscription-key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    });

    const translatedText = response.data?.translated_text;
    if (translatedText) {
      translationCache.set(cacheKey, translatedText);
      return translatedText;
    }

    return text;
  } catch (error) {
    console.error(
      `[Translation Service] Sarvam API translation failed for ${targetLanguageCode}:`,
      error.response?.data || error.message
    );
    // Graceful fallback to original text to prevent chat disruption
    return text;
  }
}

export { translateText };
export default { translateText };
