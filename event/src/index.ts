import * as dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils/logger.utils';
import app from './app';

const PORT = 8080;

// Sensitive variables you may want to mask or avoid logging
const sensitiveKeys = ['API_KEY', 'DB_PASSWORD', 'JWT_SECRET', 'TWILIO_AUTH_TOKEN','CTP_CLIENT_SECRET','TWILIO_ACCOUNT_SID'];

const maskSensitiveData = (key: string, value: string | undefined) => {
  return sensitiveKeys.includes(key) ? '*****' : value;
};

// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Event application listening on port ${PORT}`);

  // Log environment variables
  logger.info('Environment variables:');
  Object.keys(process.env).forEach(key => {
    logger.info(`${key}: ${maskSensitiveData(key, process.env[key])}`);
  });
});

export default server;
