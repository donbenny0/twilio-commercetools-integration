import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';
import * as dotenv from 'dotenv';
import { getOrder } from '../repository/orders/getOrder';
import { OrderInfo } from '../interfaces/order.interface';
import { validateTwilioCredentials } from '../validators/controllers.validators';
import { sendWhatsAppMessage } from '../utils/twilio.utils';
import { decodeData } from '../utils/helpers.utils';
dotenv.config();





// Controller to handle POST requests
export const post = async (request: Request, response: Response): Promise<Response> => {
  try {

    const pubSubMessage = request.body.message;

    // Validate Twilio credentials
    // if (!validateTwilioCredentials(accountSid, authToken)) {
    //   return response.status(500).json({ error: 'Twilio credentials are missing' });
    // }
    
    // Process Pub/Sub message
    const pubSubDecodedData = decodeData(pubSubMessage);
    if (!pubSubDecodedData) {
      logger.error('Invalid Pub/Sub message data');
      return response.status(400).json({ error: 'Invalid Pub/Sub message data' });
    }

    // Fetch the order using commercetools
    const order: OrderInfo | null = await getOrder(pubSubDecodedData.orderId);
    if (!order) {
      logger.error('Order not found:', { orderId: pubSubDecodedData.orderId });
      return response.status(404).json({ error: 'Order not found' });
    }

    // Send WhatsApp message
    const message = await sendWhatsAppMessage(order);
    if (!message) {
      logger.error('Failed to send WhatsApp message');
      return response.status(500).json({ error: 'Failed to send WhatsApp message.' });
    }

    logger.info('Message sent successfully:', { messageSid: message.sid });
    return response.status(200).json(message);
  } catch (error) {
    logger.error('Error sending WhatsApp message:', { error });

    return response.status(500).json({
      error: 'Internal server error. Failed to send WhatsApp message.',
      details: error,
    });
  }
};
