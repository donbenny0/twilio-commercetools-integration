import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import { decodePubSubData } from '../utils/helpers.utils';
import CustomError from '../errors/custom.error';
import { addNotificationLog } from '../services/customObject/notifications/addNotificationLogs.service';
import { messageHandler } from '../services/messaging/messageHandler.service';
import { resourceHandler } from '../services/messaging/resourceHandler.service';
dotenv.config();



export const post = async (request: Request, response: Response): Promise<Response> => {
  const pubSubMessage = request.body.message;
  const pubSubDecodedMessage = decodePubSubData(pubSubMessage);
  try {
    // Fetch the order using commercetools
    const resourceData: any = await resourceHandler(pubSubDecodedMessage);

    // Send messages
    await messageHandler(resourceData);
    await addNotificationLog('whatsapp', true, 'notifications', pubSubDecodedMessage)
    return response.status(200).send('Message sent successfully');
    
  } catch (error: any) {
    await addNotificationLog('whatsapp', false, 'notifications', pubSubDecodedMessage, error)
    if (error instanceof CustomError) {
      throw error;
    }
    throw new CustomError(500, error);
  }
};
