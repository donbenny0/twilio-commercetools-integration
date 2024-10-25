import { decodePubSubData, generateMessage } from './helpers.utils';
import { PubSubDecodedData } from '../interfaces/pubsub.interface';
import { Order } from '@commercetools/platform-sdk';

describe('helpers.utils.ts', () => {
    describe('decodePubSubData', () => {
        it('should decode valid base64 encoded data', () => {
            const validMessage = { data: Buffer.from(JSON.stringify({ orderId: '123', orderState: 'Confirmed' })).toString('base64') };
            const result = decodePubSubData(validMessage);
            expect(result).toEqual({ orderId: '123', orderState: 'Confirmed' });
        });

        it('should throw an error when data is missing', () => {
            expect(() => decodePubSubData({})).toThrow();
        });

        // Add more tests for edge cases...
    });

    describe('generateMessage', () => {
        const orderMock: Order = {
            id: '123',
            shippingAddress: { mobile: '+1234567890' },
            // Add other properties as needed...
        } as any; // Use proper Order structure

        it('should generate message from order data', () => {
            process.env.CUSTOM_MESSAGE_TEMPLATE = "Order {{shippingAddress.mobile}} has been confirmed.";
            const result = generateMessage(orderMock);
            expect(result).toBe("Order +1234567890 has been confirmed.");
        });

        it('should throw an error if template is missing', () => {
            delete process.env.CUSTOM_MESSAGE_TEMPLATE;
            expect(() => generateMessage(orderMock)).toThrow();
        });

        // Add more tests for edge cases...
    });
});
