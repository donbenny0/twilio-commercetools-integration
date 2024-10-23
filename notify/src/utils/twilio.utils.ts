import twilio, { Twilio } from 'twilio';
import { OrderInfo } from '../interfaces/order.interface';
import { logger } from './logger.utils';
import { PhoneNumberValidationError, WhatsAppMessageSendError } from '../errors/twilio.error';

// Twilio configuration
const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber: string | undefined = process.env.TWILIO_FROM_NUMBER;


// Create Twilio client
const client: Twilio = twilio(accountSid, authToken);

// Send WhatsApp notification
const sendWhatsAppMessage = async (order: OrderInfo) => {
    const toPhoneNumber = order.shippingAddress?.mobile;
    if (!toPhoneNumber || !(await validatePhoneNumber(toPhoneNumber))) {
        throw new PhoneNumberValidationError(toPhoneNumber || 'undefined');
    }

    try {
        const firstName = order.shippingAddress?.firstName || 'Valued Customer';

        // Message body
        const messageBody = `Dear *${firstName}*,\n\nThank you for your order! We're excited to let you know that your order has been confirmed. 🛒🎉\n\nWe'll notify you once it's shipped. Feel free to reach out if you have any questions.\n\nThank you for shopping with us!`;

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
        throw new WhatsAppMessageSendError(toPhoneNumber);
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
