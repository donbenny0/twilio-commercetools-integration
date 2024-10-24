import { PubSubDecodedData, PubSubEncodedMessage } from '../interfaces/pubsub.interface';
import { logger } from './logger.utils';
import { MissingPubSubMessageDataError, Base64DecodingError, JsonParsingError } from '../errors/pubsub.error';

// Helper function to decode base64 and parse JSON
const decodeAndParseData = (data: string): PubSubDecodedData => {
    try {
        // Decode base64 and parse JSON in a single block
        const decodedData = Buffer.from(data, 'base64').toString().trim();
        const parsedData: PubSubDecodedData = JSON.parse(decodedData);

        return {
            orderId: parsedData.orderId,
            orderState: parsedData.orderState
        };
    } catch (error) {
        // Check if it's a decoding or parsing error
        if (error instanceof SyntaxError) {
            logger.error('Failed to parse JSON:', { error });
            throw new JsonParsingError();
        } else {
            logger.error('Failed to decode base64 data', { error });
            throw new Base64DecodingError();
        }
    }
};

// Process the event data
export const decodePubSubData = (pubSubMessage: PubSubEncodedMessage): PubSubDecodedData => {
    // Check if the message has data to decode
    if (!pubSubMessage.data) {
        logger.error('Missing data field in the Pub/Sub message');
        throw new MissingPubSubMessageDataError();
    }

    // Decode and parse the data
    return decodeAndParseData(pubSubMessage.data);
};

// Generate custom messageBody
export const generateMessage = (data: any): string => {
    const template = process.env.CUSTOM_MESSAGE_TEMPLATE;
    if (!template) return '';

    const regex = /{{(.*?)}}/g;

    return template.replace(regex, (_, path: string) => {
        const value = path.trim()
            .split('.')
            .reduce<any>((obj, key) => obj?.[key], data);

        return value ?? '';
    });
};