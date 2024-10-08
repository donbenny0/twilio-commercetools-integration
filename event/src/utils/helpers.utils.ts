import { PubSubDecodedData, PubSubEncodedMessage } from '../interfaces/pubsub.interface';
import { logger } from './logger.utils';

// Process the event data
export const decodeData = (pubSubMessage: PubSubEncodedMessage): PubSubDecodedData | null => {
    const decodedData: string | undefined = pubSubMessage.data
        ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
        : undefined;

    if (decodedData) {
        try {
            return JSON.parse(decodedData);
        } catch (error) {
            logger.error('Failed to parse JSON:', { error });
            return null;
        }
    }
    return null;
};
