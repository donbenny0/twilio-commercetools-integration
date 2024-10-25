import twilio, { Twilio } from 'twilio';
import { logger } from './logger.utils';
import { PhoneNumberValidationError, WhatsAppMessageSendError } from '../errors/twilio.error';
import { Order } from '@commercetools/platform-sdk';
import { generateMessage } from './helpers.utils';

// Twilio configuration
const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber: string | undefined = process.env.TWILIO_FROM_NUMBER;


// Create Twilio client
const client: Twilio = twilio(accountSid, authToken);

// Send WhatsApp notification
const sendWhatsAppMessage = async (order: Order) => {
    const toPhoneNumber = order.shippingAddress?.mobile;
    if (!toPhoneNumber || !(await validatePhoneNumber(toPhoneNumber))) {
        throw new PhoneNumberValidationError(toPhoneNumber || 'undefined');
    }

    try {
        // Message body
        const messageBody = generateMessage(order);

        // Send the message
        const response = await client.messages.create({
            body: messageBody,
            from: `whatsapp:${fromPhoneNumber}`,
            to: `whatsapp:${toPhoneNumber}`,
        });

        logger.info('WhatsApp message sent successfully. The message has been delivered to the customer.');
        return response;
    } catch (error) {
        logger.error(`Error sending WhatsApp message: ${error}`);
        throw new WhatsAppMessageSendError(toPhoneNumber, error);
    }
}

// Validate phone number
const validatePhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    try {
        const validationResponse = await client.lookups.v2.phoneNumbers(phoneNumber).fetch();
        return validationResponse.valid;
    } catch (error) {
        logger.error(`Error validating phone number: ${error}`);
        throw new PhoneNumberValidationError(phoneNumber);
    }
};

export default sendWhatsAppMessage;
