import { PubSubDecodedData, PubSubEncodedMessage } from '../interfaces/pubsub.interface';
import { logger } from './logger.utils';

// Process the event data
export const decodePubSubData = (pubSubMessage: PubSubEncodedMessage): PubSubDecodedData | null => {
    // Decode the base64-encoded data
    const decodedData = pubSubMessage.data
        ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
        : undefined;

    if (decodedData) {
        try {
            const parsedData: PubSubDecodedData = JSON.parse(decodedData);
            return {
                orderId: parsedData.orderId,
                orderState: parsedData.orderState
            };

        } catch (error) {
            logger.error('Failed to parse JSON:', { error });
            return null;
        }
    }
    return null;
};

