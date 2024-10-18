import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils';
import * as dotenv from 'dotenv';
import { getOrder } from '../repository/orders/getOrder';
import { OrderInfo } from '../interfaces/order.interface';
import sendWhatsAppMessage from '../utils/twilio.utils';
import { decodePubSubData } from '../utils/helpers.utils';
import { PubSubDecodedData } from '../interfaces/pubsub.interface';
dotenv.config();

// Controller to handle POST requests

export const post = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const pubSubMessage = request.body.message;


    // Process Pub/Sub message
    const pubSubDecodedMessage: PubSubDecodedData | null = decodePubSubData(pubSubMessage);
    if (!pubSubDecodedMessage || pubSubDecodedMessage.orderState !== "Confirmed") {
      logger.error('Error decoding Pub/Sub message data. The data might be corrupted or in an invalid orderState.', { receivedMessage: pubSubMessage });
      return response.status(400).send("Invalid Pub/Sub message data or invalid orderState");
    }

    // Fetch the order using commercetools
    const order: OrderInfo | null = await getOrder(pubSubDecodedMessage.orderId);
    if (!order) {
      logger.error('Order not found in commercetools or orderId is missing. Please verify if the orderId is valid and exists in the system.', { orderId: pubSubDecodedMessage.orderId });
      return response.status(404).send("Order not found in commercetools or orderId is missing");
    }

    // Send WhatsApp messagez
    const message = await sendWhatsAppMessage(order);
    if (!message) {
      logger.error('Failed to send WhatsApp message. There might be an issue with the Twilio service or the provided credentials.', { orderId: pubSubDecodedMessage.orderId, customerPhoneNumber: order.shippingAddress?.mobile });
      return response.status(400).send('Failed to send WhatsApp message');
    }

    logger.info('WhatsApp message sent successfully. The message has been delivered to the customer.');
    return response.status(200).send('Message sent successfully');
  } catch (error) {
    logger.error('Internal server error encountered while processing the request. Please check the server logs for more details.', error);
    return response.status(500).send('Internal server error');
  }
};
