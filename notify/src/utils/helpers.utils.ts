import { PubSubDecodedData, PubSubEncodedMessage } from '../interfaces/pubsub.interface';
import { logger } from './logger.utils';
import { MissingPubSubMessageDataError, Base64DecodingError, JsonParsingError } from '../errors/pubsub.error';
import { Order } from '@commercetools/platform-sdk';
import { GeneralError, InvalidPlaceholder } from '../errors/helpers.errors';
import CustomError from '../errors/custom.error';

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
export const generateMessage = (data: Order): string => {
    const defaultMessage = "Dear *{{shippingAddress.firstName}}*,\n\nThank you for your order! We're excited to let you know that your order has been confirmed. 🛒🎉\n\nWe'll notify you once it's shipped. Feel free to reach out if you have any questions.\n\nThank you for shopping with us!"
    const template = process.env.CUSTOM_MESSAGE_TEMPLATE || defaultMessage;

    const extractValues = (obj: Order, pathString: string): any[] => {
        const segments: string[] = [];
        const wildcardPositions: (boolean | number)[] = [];

        // Parse the path string into segments and track array positions
        pathString.split('.').forEach((segment: string) => {
            const arrayMatch = segment.match(/(.*)\[(\*|\d+)\]/);
            if (arrayMatch) {
                const [, key, index] = arrayMatch;
                segments.push(key);
                wildcardPositions.push(index === '*' ? true : parseInt(index, 10));
            } else {
                segments.push(segment);
                wildcardPositions.push(false);
            }
        });

        // Navigate through the object structure
        let current: any[] = [obj];

        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            const isWildcard = wildcardPositions[i];

            current = current.flatMap((item: any) => {
                const value = item[segment];

                if (isWildcard === true) {
                    // Handle wildcard array access
                    return Array.isArray(value) ? value : [];
                } else if (typeof isWildcard === 'number') {
                    // Handle specific index array access
                    return Array.isArray(value) && value[isWildcard] ? [value[isWildcard]] : [];
                } else {
                    // Handle regular property access
                    return value !== undefined && value !== null ? [value] : [];
                }
            });

            if (current.length === 0) break;
        }

        return current;
    };

    // Replace template placeholders with actual values
    return template.replace(/{{(.*?)}}/g, (match: string, path: string): string => {
        try {
            const values = extractValues(data, path.trim());
            if (values.length === 0) {
                throw new InvalidPlaceholder(path.trim()); // Throw an error for invalid placeholder
            }
            return values.join(', ');
        } catch (error) {
            if (error instanceof CustomError) {
                logger.error(`Invalid placeholder: ${error.message}`);
                throw error;
            } else {
                logger.error('Error:', error);
                throw new GeneralError('An unexpected error occurred while generating the message.');
            }
        }
    });
};





