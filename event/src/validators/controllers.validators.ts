import { logger } from "../utils/logger.utils";

// Validate Twilio credentials
export const validateTwilioCredentials = (accountSid?: string, authToken?: string): boolean => {
    if (!accountSid || !authToken) {
        logger.error('Twilio credentials are missing.');
        return false;
    }
    return true;
};