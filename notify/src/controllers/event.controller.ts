import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import sendWhatsAppMessage from '../utils/twilio.utils';
import { decodePubSubData } from '../utils/helpers.utils';
import { PubSubDecodedData } from '../interfaces/pubsub.interface';
import CustomError from '../errors/custom.error';
import { Order } from '@commercetools/platform-sdk';
import { addNotificationLog } from '../services/customObject/notifications/addNotificationLogs.service';
import { transformOrder } from '../services/orders/orders.service';
dotenv.config();



export const post = async (request: Request, response: Response): Promise<Response> => {
  const pubSubMessage = request.body.message;
  const pubSubDecodedMessage: PubSubDecodedData = decodePubSubData(pubSubMessage);
  try {
    // Fetch the order using commercetools
    const order: Order = await transformOrder(pubSubDecodedMessage);

    // Send WhatsApp messages
    await sendWhatsAppMessage(order);
    await addNotificationLog('whatsapp', true, 'Order', 'notifications', pubSubDecodedMessage)
    return response.status(200).send('Message sent successfully');
  } catch (error: any) {
    await addNotificationLog('whatsapp', false, 'Order', 'notifications', pubSubDecodedMessage, error)
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, error);
  }
};
