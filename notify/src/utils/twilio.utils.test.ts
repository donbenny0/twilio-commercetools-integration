import sendWhatsAppMessage from './twilio.utils';
import { PhoneNumberValidationError, WhatsAppMessageSendError } from '../errors/twilio.error';
import { Order } from '@commercetools/platform-sdk';

jest.mock('twilio', () => {
    return jest.fn().mockImplementation(() => {
        return {
            messages: {
                create: jest.fn().mockResolvedValue({ sid: 'mockSid' }),
            },
            lookups: {
                v2: {
                    phoneNumbers: jest.fn().mockImplementation(() => ({
                        fetch: jest.fn().mockResolvedValue({ valid: true }),
                    })),
                },
            },
        };
    });
});

describe('twilio.utils.ts', () => {
    const orderMock: Order = {
        id: '123',
        shippingAddress: { firstName: "jhon", mobile: '+1234567890' },
        // Add other properties as needed...
    } as any;

    it('should send WhatsApp message successfully', async () => {
        const response = await sendWhatsAppMessage(orderMock);
        expect(response).toEqual({ sid: 'mockSid' });
    });

    it('should throw PhoneNumberValidationError if phone number is invalid', async () => {
        const invalidOrderMock: Order = {
            id: '123',
            shippingAddress: { mobile: null }, // or invalid format
        } as any;

        await expect(sendWhatsAppMessage(invalidOrderMock)).rejects.toThrow(PhoneNumberValidationError);
    });

    // Add more tests for edge cases...
});