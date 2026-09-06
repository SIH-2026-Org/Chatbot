import app from './app.js';
import config from './config/env.js';

const server = app.listen(config.PORT, () => {
  console.log(`=========================================`);
  console.log(` SAARTHI-SETU WhatsApp Webhook Server`);
  console.log(` Running on port: ${config.PORT}`);
  console.log(` Webhook URL: http://localhost:${config.PORT}/webhook`);
  console.log(`=========================================`);
});

export default server;
