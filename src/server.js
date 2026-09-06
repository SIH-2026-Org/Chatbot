const app = require('./app');
const config = require('./config/env');

const server = app.listen(config.PORT, () => {
  console.log(`=========================================`);
  console.log(` SAARTHI-SETU WhatsApp Webhook Server`);
  console.log(` Running on port: ${config.PORT}`);
  console.log(` Webhook URL: http://localhost:${config.PORT}/webhook`);
  console.log(`=========================================`);
});

module.exports = server;
