# SAARTHI-SETU - WhatsApp Conversational Assistant

Conversational WhatsApp AI assistant integration for **SAARTHI-SETU**, built with Node.js (ESM), Express, Meta WhatsApp Cloud API (v20.0), and **Sarvam AI** for multilingual translation across the official languages of India.

---

## 📁 Project Structure

```
.
├── src/
│   ├── config/
│   │   └── env.js                   # Validates and exports environment configurations (Meta & Sarvam)
│   ├── constants/
│   │   └── messages.js              # 10 Indian official languages, multilingual templates & loan buttons
│   ├── controllers/
│   │   └── webhook.controller.js    # Language selection list menu & scheme category router
│   ├── middleware/
│   │   └── verifySignature.js       # Meta HMAC-SHA256 signature verification
│   ├── routes/
│   │   └── webhook.routes.js        # Express router for /webhook
│   ├── services/
│   │   ├── whatsapp.service.js      # Meta Graph API integration (interactive list, reply buttons & text)
│   │   ├── translation.service.js   # Sarvam AI translation client with in-memory caching
│   │   └── session.service.js       # In-memory user state & language preference manager
│   ├── app.js                       # Express app setup and middleware configuration
│   └── server.js                    # HTTP server bootstrap and startup listener
├── test/
│   └── webhook.test.js              # Automated test suite (run via node --test)
├── .env.example                     # Sample environment variable template
├── .gitignore                       # Standard Node.js gitignore
├── package.json
└── README.md
```

---

## 🌟 How the Language Selection Flow Works

### 1. Official Indian Languages Supported by Sarvam AI
From the 22 scheduled languages of India (Eighth Schedule), Sarvam AI supports the following **10 official languages** (fitting precisely within WhatsApp's 10-item interactive list constraint):

1. **हिन्दी (Hindi)** - `hi-IN`
2. **বাংলা (Bengali)** - `bn-IN`
3. **मराठी (Marathi)** - `mr-IN`
4. **తెలుగు (Telugu)** - `te-IN`
5. **தமிழ் (Tamil)** - `ta-IN`
6. **ગુજરાતી (Gujarati)** - `gu-IN`
7. **ಕನ್ನಡ (Kannada)** - `kn-IN`
8. **ଓଡ଼ିଆ (Odia)** - `od-IN`
9. **മലയാളം (Malayalam)** - `ml-IN`
10. **ਪੰਜਾਬੀ (Punjabi)** - `pa-IN`

*(English is also supported via text alias)*

---

### 2. User Experience Flow

1. **First Contact or Greeting ("Hi" / "Hello" / "Namaste")**:
   - The user receives an Interactive List Message titled **"Select Language"**.
   - Tapping the button opens a clean popup menu listing all 10 official Indian languages with their native scripts.
   - Alternatively, the user can simply reply with the digit (`1` to `10`) or the language name (`"Punjabi"`, `"मराठी"`, etc.).

2. **Language Selection & Dynamic Translation**:
   - Once chosen, the language preference is stored in the session.
   - The main scheme menu (Education Loan, Farming Loan, MSME Loan) is dynamically translated into the chosen language via **Sarvam AI** (`model: "mayura:v1"`).

3. **Subsequent Scheme Discovery**:
   - All subsequent interactions and information requests are translated and served in the user's selected language.

4. **Session Reset**:
   - Typing *"Hi"* or *"Hello"* at any point resets the session and re-presents the language list menu.

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Ensure `.env` contains your credentials:

```bash
PORT=3000
META_VERIFY_TOKEN="your_verify_token"
META_APP_SECRET="your_meta_app_secret"
WHATSAPP_TOKEN="your_whatsapp_access_token"
PHONE_NUMBER_ID="your_phone_number_id"
SARVAM_API="your_sarvam_api_key"
```

### 2. Run the Application

```bash
# Start server in production mode
npm start

# Start server in watch/development mode
npm run dev

# Run automated integration tests
npm test
```
