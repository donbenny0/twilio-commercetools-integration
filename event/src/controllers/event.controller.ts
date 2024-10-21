import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { getOrder } from '../repository/orders/getOrder';
import { OrderInfo } from '../interfaces/order.interface';
import sendWhatsAppMessage from '../utils/twilio.utils';
import { decodePubSubData } from '../utils/helpers.utils';
import { PubSubDecodedData } from '../interfaces/pubsub.interface';
import CustomError from '../errors/custom.error';
dotenv.config();

// Controller to handle POST requests

export const post = async (
  request: Request,
  response: Response
): Promise<Response> => {
  try {
    const pubSubMessage = request.body.message;

    // Process Pub/Sub message
    const pubSubDecodedMessage: PubSubDecodedData = decodePubSubData(pubSubMessage);
    if (pubSubDecodedMessage.orderState !== "Confirmed") {
      return response.status(400).send("Invalid orderState");
    }
    // Fetch the order using commercetools
    const order: OrderInfo = await getOrder(pubSubDecodedMessage.orderId);

    // Send WhatsApp messages
    await sendWhatsAppMessage(order);

    return response.status(200).send('Message sent successfully');
  } catch (error) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, 'Internal Server Error');
  }
};
