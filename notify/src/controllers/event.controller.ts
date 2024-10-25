import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sendWhatsAppMessage from '../utils/twilio.utils';
import { decodePubSubData } from '../utils/helpers.utils';
import { PubSubDecodedData } from '../interfaces/pubsub.interface';
import CustomError from '../errors/custom.error';
import { Order } from '@commercetools/platform-sdk';
import { getOrder } from '../repository/orders/getOrder.repository';
dotenv.config();



export const post = async (request: Request, response: Response): Promise<Response> => {
  try {
    const pubSubMessage = request.body.message;

    // Process Pub/Sub message
    const pubSubDecodedMessage: PubSubDecodedData = decodePubSubData(pubSubMessage);
    if (pubSubDecodedMessage.orderState !== "Confirmed") {
      return response.status(400).send("Invalid order state");
    }
    // Fetch the order using commercetools
    const order: Order = await getOrder(pubSubDecodedMessage.orderId);

    // Send WhatsApp messages
    await sendWhatsAppMessage(order);

    return response.status(200).send('Message sent successfully');
  } catch (error:any) {
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, error);
  }
};
