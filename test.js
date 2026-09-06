require("dotenv").config();

const express = require('express');
const crypto = require('crypto');
const { raw } = require("body-parser");
const app = express();
// app.use(express.json());

// const VERIFY_TOKEN = 
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf; // Store the raw buffer
    }
}));

// Webhook Verification Endpoint
app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token === process.env.META_VERIFY_TOKEN) {
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});


app.post('/webhook', (req, res) => {

    const signatureHeader = req.headers['x-hub-signature-256'];
    const contentLength = req.headers['content-length']; // <CONTENT_LENGTH>
    const rawPayload = req.rawBody; // The raw <JSON_PAYLOAD>

    console.log(rawPayload);

    if (!signatureHeader) {
        console.error("No signature provided.");
        return res.sendStatus(403);
    }

    // 3. Extract the <SHA256_PAYLOAD_HASH>
    // The header looks like: "sha256=b63bb356dff0f1c24379..."
    const [algorithm, providedHash] = signatureHeader.split('=');

    // 4. Generate the HMAC-SHA256 hash using your app secret
    const hmac = crypto.createHmac('sha256', process.env.META_APP_SECRET);
    hmac.update(rawPayload);
    const generatedHash = hmac.digest('hex');

    // 5. Compare the hashes securely
    // It is best practice to use timingSafeEqual to prevent timing attacks
    const expectedBuffer = Buffer.from(generatedHash, 'utf8');
    const providedBuffer = Buffer.from(providedHash, 'utf8');

    let isValid = false;
    if (expectedBuffer.length === providedBuffer.length) {
        isValid = crypto.timingSafeEqual(expectedBuffer, providedBuffer);
    }

    // 6. Handle the result
    if (isValid) {
        console.log("Payload is valid. Processing...");
        const body = req.body;
        // TODO: Digest the payload contents according to business needs
        if (body.object === 'whatsapp_business_account') {
            for (const entry of body.entry) {
                for (const change of entry.changes) {
                    const value = change.value;

                    // 1. Handle Incoming Messages
                    if (value.messages && value.messages.length > 0) {
                        const message = value.messages[0];
                        const senderPhone = message.from; // The user's phone number

                        // Ensure the message is text before trying to read body
                        if (message.type === 'text') {
                            const messageText = message.text.body;
                            console.log(`Received text from ${senderPhone}: ${messageText}`);

                            // TODO: Trigger your bot logic here and send a reply
                        } else {
                            console.log(`Received a non-text message of type: ${message.type}`);
                        }
                    }

                    // 2. Handle Delivery/Read Status Updates
                    else if (value.statuses && value.statuses.length > 0) {
                        const status = value.statuses[0].status;
                        const recipientPhone = value.statuses[0].recipient_id;
                        console.log(`Message to ${recipientPhone} status updated to: ${status}`);
                    }
                }
            }
        }

        res.sendStatus(200); // Always return a 200 OK to Meta
    } else {
        console.error("Payload validation failed. Hashes do not match.");
        res.sendStatus(403); // Consider payload invalid
    }
});

app.listen(3000, () => console.log('Webhook is listening on port 3000'));