import twilio, { Twilio } from 'twilio';


// Twilio configuration
const accountSid: string | undefined = process.env.TWILIO_ACCOUNT_SID;
const authToken: string | undefined = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber: string | undefined = process.env.TWILIO_FROM_NUMBER;

// create twilio client
const client: Twilio = twilio(accountSid, authToken);


// Send WhatsApp notification
export const sendWhatsAppMessage = async (order: any) => {
    const toPhoneNumber: string = order.shippingAddress?.mobile;
    const firstName: string = order.shippingAddress?.firstName;

    // Message body
    const messageBody: string = `Hi *${firstName}*,\n\nThank you for your order! We're excited to let you know that your order has been confirmed. 🛒🎉\n\nWe'll notify you once it's shipped. Feel free to reach out if you have any questions.\n\nThank you for shopping with us!`;

    return await client.messages.create({
        body: messageBody,
        from: `whatsapp:${fromPhoneNumber}`,
        to: `whatsapp:${toPhoneNumber}`,
    });
};