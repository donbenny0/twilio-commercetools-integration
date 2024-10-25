// Mock the Twilio client
jest.mock('twilio', () => {
    return jest.fn(() => ({
        messages: {
            create: jest.fn().mockResolvedValue({
                sid: 'mockSid',
                status: 'sent',
                to: '+1234567890',
                from: '+0987654321',
                dateCreated: new Date().toISOString(),
            }),
        },
        lookups: {
            v2: {
                phoneNumbers: jest.fn().mockImplementation((phoneNumber: string) => ({
                    fetch: jest.fn().mockResolvedValue({ valid: true })
                }))
            }
        }
    }));
});

import request from 'supertest';
import express from 'express';
import { post } from '../../src/controllers/event.controller';
import { getOrder } from '../../src/repository/orders/getOrder.repository';
import { Order } from '@commercetools/platform-sdk';

const app = express();
app.use(express.json());
app.post('/event', post);

jest.mock('../../src/repository/orders/getOrder.repository');
// Mock environment variable reading
jest.mock('../../src/utils/config.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        CTP_CLIENT_ID: "6CgfaNUyYB3NuCpcJyCMR2F7",
        CTP_CLIENT_SECRET: "qO_kB4yKFPO6kYqGQcKQQbNbLcR7dQM3",
        CTP_PROJECT_KEY: "orders-notifications",
        CTP_SCOPE: "manage_project:orders-notifications",
        CTP_REGION: "europe-west1.gcp"
    })
}));
jest.mock('../../src/utils/twilio.utils', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        TWILIO_ACCOUNT_SID: '6CgfaNUyYB3NuCpcJyCMR2F7',
        TWILIO_AUTH_TOKEN: '842adb84f0c9337238b54de67e964603',
        TWILIO_FROM_NUMBER: '+14155238886',
        CUSTOM_MESSAGE_TEMPLATE:"Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! Total rates: {{taxedPrice.taxPortions[*].rate}}."
    })
}));
describe('event.controller.ts', () => {
    let sendWhatsAppMessageSpy: jest.SpyInstance;

    beforeEach(() => {
        // Reset mocks before each test
        jest.resetAllMocks();

        // Mock the twilio.utils module
        jest.mock('../../src/utils/twilio.utils');
        const mockTwilioUtils = jest.requireActual('../../src/utils/twilio.utils');

        // Create a spy for sendWhatsAppMessage
        sendWhatsAppMessageSpy = jest.spyOn(mockTwilioUtils, 'default').mockResolvedValue({
            sid: 'mockSid',
            status: 'sent',
            to: '+1234567890',
            from: '+0987654321',
            dateCreated: new Date().toISOString(),
        });
    });

    afterEach(() => {
        // Restore the original implementation
        sendWhatsAppMessageSpy.mockRestore();
    });

    it('should send WhatsApp message for confirmed orders', async () => {
        const orderMock: Partial<Order> = {
            id: '123',
            shippingAddress: { mobile: '+1234567890', country: 'US' },
        };
        jest.mocked(getOrder).mockResolvedValue(orderMock as Order);

        const response = await request(app)
            .post('/event')
            .send({
                message: { data: Buffer.from(JSON.stringify({ orderId: '123', orderState: 'Confirmed' })).toString('base64') },
            });

        expect(response.status).toBe(200);
        expect(response.text).toBe('Message sent successfully');
    });

    it('should return 400 for invalid order state', async () => {
        const response = await request(app)
            .post('/event')
            .send({
                message: { data: Buffer.from(JSON.stringify({ orderId: '123', orderState: 'Cancelled' })).toString('base64') },
            });

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid order state');
    });

    it('should return 500 for internal server error', async () => {
        jest.mocked(getOrder).mockRejectedValue(new Error('Internal Error'));

        const response = await request(app)
            .post('/event')
            .send({
                message: { data: Buffer.from(JSON.stringify({ orderId: '123', orderState: 'Confirmed' })).toString('base64') },
            });

        expect(response.status).toBe(500);
        expect(response.text).toBe('Internal Server Error');
    });
});
