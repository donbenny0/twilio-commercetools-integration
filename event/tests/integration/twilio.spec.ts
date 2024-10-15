import { Request, Response } from 'express';
import { sendWhatsAppMessage } from '../../src/utils/twilio.utils';
import { post } from '../../src/controllers/event.controller';
import { getOrder } from '../../src/repository/orders/getOrder';
import { decodePubSubData } from '../../src/utils/helpers.utils';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { mocked } from 'jest-mock';
import { MessageInstance } from 'twilio/lib/rest/api/v2010/account/message';

jest.mock('../../src/utils/config.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        CTP_CLIENT_ID:"6CgfaNUyYB3NuCpcJyCMR2F7",
        CTP_CLIENT_SECRET:"qO_kB4yKFPO6kYqGQcKQQbNbLcR7dQM3",
        CTP_PROJECT_KEY:"orders-notifications",
        CTP_SCOPE:"manage_project:orders-notifications",
        CTP_REGION:"europe-west1.gcp"
    })
}));
jest.mock('../../src/utils/twilio.utils', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        TWILIO_ACCOUNT_SID: '6CgfaNUyYB3NuCpcJyCMR2F7',
        TWILIO_AUTH_TOKEN: '842adb84f0c9337238b54de67e964603',
        TWILIO_FROM_NUMBER: '+14155238886'
    })
}));

jest.mock('../../src/repository/orders/getOrder');
jest.mock('../../src/utils/twilio.utils');
jest.mock('../../src/utils/helpers.utils');
jest.mock('../../src/utils/logger.utils', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        warn: jest.fn()
    }
}));

describe('POST /event', () => {
    const mockRequest = (body: any) => ({ body } as Request);
    const mockResponse = () => {
        const res = {} as Response;
        res.status;
        res.send;
        return res;
    };

    const dummyOrderInfo = {
        shippingAddress: {
            firstName: "Sarah",
            lastName: "Williams",
            streetName: "456 Peaceful Street",
            streetNumber: "102",
            additionalStreetInfo: "Suite 2B",
            postalCode: "67890",
            city: "Tranquil Town",
            region: "Serenity Region",
            state: "California",
            country: "US",
            company: "CalmTech Ltd.",
            phone: "+1-800-1234567",
            mobile: "12345678",
            email: "sarah.williams@example.com"
        },
        products: [
        ],
        orderState: "Confirmed"
    };
    const mockMessageInstance: Partial<MessageInstance> = {
        sid: 'mock-message-id',
        body: 'Test message body',
        numSegments: '1',
        direction: 'outbound-api',
        from: 'whatsapp:+1234567890',
        to: 'whatsapp:+0987654321',
        dateCreated: new Date(),
        dateUpdated: new Date(),
        dateSent: new Date(),
        accountSid: 'AC1234567890',
        status: 'sent',
        // Add other required properties as needed
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if WhatsApp message sending fails', async () => {
        const req = mockRequest({
            message: {
                data: Buffer.from(JSON.stringify({ orderId: 'order-123' })).toString('base64')
            }
        });
        const res = mockResponse();

        mocked(decodePubSubData).mockReturnValueOnce({ orderId: 'order-123', orderState: "Confirmed" });
        mocked(getOrder).mockResolvedValueOnce(dummyOrderInfo);
        mocked(sendWhatsAppMessage).mockResolvedValueOnce(null);

        await post(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Failed to send WhatsApp message');
    });

    // it('should return 200 if WhatsApp message is sent successfully', async () => {
    //     const req = mockRequest({
    //         message: {
    //             data: Buffer.from(JSON.stringify({ orderId: 'order-123' })).toString('base64')
    //         }
    //     });
    //     const res = mockResponse();

    //     mocked(decodePubSubData).mockReturnValueOnce({ orderId: 'order-123', orderState: "Confirmed" });
    //     mocked(getOrder).mockResolvedValueOnce(dummyOrderInfo);
    //     mocked(sendWhatsAppMessage).mockResolvedValueOnce(mockMessageInstance as MessageInstance);

    //     await post(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.send).toHaveBeenCalledWith('Message sent successfully');
    // });
});