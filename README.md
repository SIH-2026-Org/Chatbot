# SAARTHI-SETU - WhatsApp Conversational Assistant

Conversational WhatsApp AI assistant integration for **SAARTHI-SETU**, built on Node.js, Express, and the Meta WhatsApp Cloud API (v20.0).

---

## 📁 Project Structure

```
.
├── src/
│   ├── config/
│   │   └── env.js                   # Validates and exports environment configurations
│   ├── constants/
│   │   └── messages.js              # Onboarding message template & greeting triggers
│   ├── controllers/
│   │   └── webhook.controller.js    # GET handshake & non-blocking POST handler
│   ├── middleware/
│   │   └── verifySignature.js       # Meta HMAC-SHA256 signature verification
│   ├── routes/
│   │   └── webhook.routes.js        # Express router for /webhook
│   ├── services/
│   │   └── whatsapp.service.js      # Meta Graph API integration for outgoing messages
│   ├── app.js                       # Express app setup and middleware configuration
│   └── server.js                    # HTTP server bootstrap and startup listener
├── .env.example                     # Sample environment variable template
├── .gitignore                       # Standard Node.js gitignore
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your Meta WhatsApp Cloud API credentials:

```bash
cp .env.example .env
```

Ensure the following keys are set:
- `PORT`: Port for the Express server (default: `3000`)
- `META_VERIFY_TOKEN`: Your custom webhook verification token configured in Meta Developer Portal
- `META_APP_SECRET`: Meta App Secret (used for verifying HMAC-SHA256 signatures)
- `WHATSAPP_TOKEN`: Meta System User or Temporary Access Token (with `whatsapp_business_messaging` permission)
- `PHONE_NUMBER_ID`: WhatsApp Phone Number ID from your WhatsApp Cloud API app

### 2. Run the Application

```bash
# Start server in production mode
npm start

# Start server in watch/development mode
npm run dev
```

---

## ⚙️ Webhook Endpoints

| Method | Route | Description |
|---|---|---|
| `GET` | `/webhook` | Handshake challenge response for Meta Webhook setup |
| `POST` | `/webhook` | Ingests incoming WhatsApp messages & statuses (non-blocking 200 OK) |
| `GET` | `/health` | Server health check endpoint |

---

## 🛡️ Architecture Highlights
- **Strict Non-Blocking Webhook**: Returns `200 OK` synchronously to Meta to satisfy latency limits and eliminate retry storms.
- **Deep Null Safety**: Safely extracts `req.body.entry[0].changes[0].value.messages[0]` and handles status delivery/read receipts without crashing.
- **HMAC SHA-256 Verification**: Verifies `x-hub-signature-256` securely with timing-safe comparison to prevent timing attacks.
