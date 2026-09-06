const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const app = require('../src/app');
const config = require('../src/config/env');

let server;
let baseUrl;

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
});

test.after(async () => {
  await new Promise((resolve) => server.close(resolve));
});

test('GET /health returns 200 and healthy status', async () => {
  const res = await fetch(`${baseUrl}/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'healthy');
});

test('GET /webhook verification handshake works with correct token', async () => {
  const verifyToken = config.META_VERIFY_TOKEN;
  const challenge = '1158201444';
  const url = `${baseUrl}/webhook?hub.mode=subscribe&hub.verify_token=${encodeURIComponent(verifyToken)}&hub.challenge=${challenge}`;
  
  const res = await fetch(url);
  assert.equal(res.status, 200);
  const text = await res.text();
  assert.equal(text, challenge);
});

test('GET /webhook returns 403 with incorrect token', async () => {
  const url = `${baseUrl}/webhook?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=123`;
  const res = await fetch(url);
  assert.equal(res.status, 403);
});

test('POST /webhook returns 200 immediately for valid greeting payload', async () => {
  const payload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '123456', phone_number_id: '123' },
              messages: [
                {
                  from: '919876543210',
                  id: 'wamid.HBgLMTIzNDU2Nzg5',
                  timestamp: '1725619200',
                  text: { body: 'Namaste' },
                  type: 'text'
                }
              ]
            }
          }
        ]
      }
    ]
  };

  const payloadString = JSON.stringify(payload);
  const hmac = crypto.createHmac('sha256', config.META_APP_SECRET);
  hmac.update(payloadString);
  const signature = `sha256=${hmac.digest('hex')}`;

  const res = await fetch(`${baseUrl}/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hub-signature-256': signature,
    },
    body: payloadString,
  });

  assert.equal(res.status, 200);
});

test('POST /webhook returns 200 gracefully for status updates (delivered/read)', async () => {
  const statusPayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '123456', phone_number_id: '123' },
              statuses: [
                {
                  id: 'wamid.HBgLMTIzNDU2Nzg5',
                  status: 'read',
                  timestamp: '1725619300',
                  recipient_id: '919876543210'
                }
              ]
            }
          }
        ]
      }
    ]
  };

  const payloadString = JSON.stringify(statusPayload);
  const hmac = crypto.createHmac('sha256', config.META_APP_SECRET);
  hmac.update(payloadString);
  const signature = `sha256=${hmac.digest('hex')}`;

  const res = await fetch(`${baseUrl}/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hub-signature-256': signature,
    },
    body: payloadString,
  });

  assert.equal(res.status, 200);
});

test('POST /webhook handles interactive button replies (e.g. LOAN_MSME)', async () => {
  const interactivePayload = {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '123456789',
        changes: [
          {
            field: 'messages',
            value: {
              messaging_product: 'whatsapp',
              metadata: { display_phone_number: '123456', phone_number_id: '123' },
              messages: [
                {
                  from: '919876543210',
                  id: 'wamid.HBgLMTIzNDU2Nzg5',
                  timestamp: '1725619400',
                  type: 'interactive',
                  interactive: {
                    type: 'button_reply',
                    button_reply: {
                      id: 'LOAN_MSME',
                      title: 'MSME Loan'
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  };

  const payloadString = JSON.stringify(interactivePayload);
  const hmac = crypto.createHmac('sha256', config.META_APP_SECRET);
  hmac.update(payloadString);
  const signature = `sha256=${hmac.digest('hex')}`;

  const res = await fetch(`${baseUrl}/webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hub-signature-256': signature,
    },
    body: payloadString,
  });

  assert.equal(res.status, 200);
});

