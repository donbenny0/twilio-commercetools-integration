import { PhoneNumberValidationError, MessageSendError } from '../errors/twilio.error';
import { Order } from '@commercetools/platform-sdk';
import sendMessage from './twilio.utils';

// Mock environment variable reading
jest.mock('../utils/config.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        CTP_CLIENT_ID: "XXXXXXXXXXXXXXXXXXXXXXXX",
        CTP_CLIENT_SECRET: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        CTP_PROJECT_KEY: "test-scope",
        CTP_SCOPE: "manage_project:test-scope",
        CTP_REGION: "europe-west1.gcp"
    })
}));

// Mock Twilio client
const mockTwilioClient = {
    messages: {
        create: jest.fn().mockResolvedValue({})
    }
};

jest.mock('../utils/twilio.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        TWILIO_ACCOUNT_SID: 'XXXXXXXXXXXXXXXXXXXXXXXX',
        TWILIO_AUTH_TOKEN: 'test-auth-token',
        TWILIO_FROM_NUMBER: 'test-number',
        CUSTOM_MESSAGE_TEMPLATE: "Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! Total rates: {{taxedPrice.taxPortions[*].rate}}."
    }),
    __esModule: true,
    default: jest.fn().mockImplementation((_accountSid: string, _authToken: string) => mockTwilioClient)
}));

jest.mock('twilio', () => {
    const mockCreate = jest.fn().mockResolvedValue({ sid: 'mockSid' });
    return jest.fn().mockImplementation(() => ({
        messages: {
            create: mockCreate,
        },
        lookups: {
            v2: {
                phoneNumbers: jest.fn().mockImplementation((phoneNumber: string) => ({
                    fetch: jest.fn().mockImplementation(() => {
                        if (!phoneNumber || phoneNumber === 'null') {
                            return Promise.resolve({ valid: false });
                        }
                        return Promise.resolve({ valid: true });
                    }),
                })),
            },
        },
    }));
});

jest.mock('./logger.utils', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn()
    }
}));

jest.mock('./helpers.utils', () => ({
    generateMessage: jest.fn().mockResolvedValue('Test message')
}));

describe('twilio.utils.ts', () => {
    const orderMock: Partial<Order> = {
        id: '123',
        shippingAddress: { 
            firstName: "john", 
            mobile: '+1234567890',
            country: 'US' // Added required country field
        },
        taxedPrice: {
            totalNet: { type: "centPrecision", centAmount: 1000, currencyCode: 'USD', fractionDigits: 2 },
            totalGross: { type: "centPrecision", centAmount: 1200, currencyCode: 'USD', fractionDigits: 2 },
            taxPortions: [{ rate: 0.2, amount: { type: "centPrecision", centAmount: 200, currencyCode: 'USD', fractionDigits: 2 } }]
        }
    };

    const mockTwilioClient = jest.requireMock('twilio')();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send WhatsApp message successfully', async () => {
        const expectedParams = {
            body: 'Test message',
            from: 'whatsapp:undefined',
            to: 'whatsapp:+1234567890'
        };
        
        await sendMessage(orderMock, '+1234567890');
        
        expect(mockTwilioClient.messages.create).toHaveBeenCalledWith(expectedParams);
        expect(mockTwilioClient.messages.create).toHaveBeenCalledTimes(1);
    });

    it('should throw PhoneNumberValidationError if phone number is invalid', async () => {
        await expect(sendMessage(orderMock, '')).rejects.toThrow(PhoneNumberValidationError);
    });

    it('should throw MessageSendError if message sending fails', async () => {
        mockTwilioClient.messages.create.mockRejectedValueOnce(new Error('Failed to send'));
        await expect(sendMessage(orderMock, '+1234567890')).rejects.toThrow(MessageSendError);
    });
});
