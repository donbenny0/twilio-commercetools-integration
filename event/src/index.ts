import * as dotenv from 'dotenv';
dotenv.config();

import { logger } from './utils/logger.utils';
import app from './app';

const PORT = 8080;

// List of environment variables to retrieve and log
const requiredEnvKeys = [
  'CTP_CLIENT_ID',
  'CTP_CLIENT_SECRET',
  'CTP_PROJECT_KEY',
  'CTP_SCOPE',
  'CTP_REGION',
  'TWILIO_ACCOUNT_SID',
  'TWILIO_AUTH_TOKEN',
  'TWILIO_FROM_NUMBER',
  'CONNECT_PROVIDER',
  'CONNECT_GCP_TOPIC_NAME',
  'CONNECT_GCP_PROJECT_ID'
];

// Listen the application
const server = app.listen(PORT, () => {
  logger.info(`⚡️ Event application listening on port ${PORT}`);

  // Log only the specified environment variables
  logger.info('Relevant environment variables:');
  requiredEnvKeys.forEach(key => {
    logger.info(`${key}: ${process.env[key] || 'Not defined'}`);
  });
});

export default server;
