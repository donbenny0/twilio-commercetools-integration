// import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
// import { Request, Response } from 'express';
// import { post } from '../../src/controllers/event.controller';
// import { getOrder } from '../../src/repository/orders/getOrder';
// import { sendWhatsAppMessage } from '../../src/utils/twilio.utils';
// import { decodePubSubData } from '../../src/utils/helpers.utils';
// import { OrderInfo } from '../../src/interfaces/order.interface';

// // Mocking dependencies
// jest.mock('../../src/repository/orders/getOrder');
// jest.mock('../../src/utils/twilio.utils');
// jest.mock('../../src/utils/helpers.utils');
// jest.mock('../../src/utils/logger.utils');

// describe('post controller', () => {
//     let mockRequest: Partial<Request>;
//     let mockResponse: Partial<Response>;

//     beforeEach(() => {
//         mockRequest = {
//             body: {
//                 message: {
//                     data: 'base64EncodedString',
//                 },
//             },
//         };
//         mockResponse = {
//             status: jest.fn().mockReturnThis(),
//             send: jest.fn().mockReturnThis(),
//         } as Partial<Response>;
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it('should successfully process a valid request', async () => {
//         const mockDecodedData = { orderId: '12345', orderState: 'Confirmed' };
//         const mockOrder: OrderInfo = {
//             shippingAddress: {
//                 firstName: "Sarah",
//                 lastName: "Williams",
//                 streetName: "456 Peaceful Street",
//                 streetNumber: "102",
//                 additionalStreetInfo: "Suite 2B",
//                 postalCode: "67890",
//                 city: "Tranquil Town",
//                 region: "Serenity Region",
//                 state: "California",
//                 country: "US",
//                 company: "CalmTech Ltd.",
//                 phone: "+1-800-1234567",
//                 mobile: "+917306227380",
//                 email: "sarah.williams@example.com"
//             },
//             products: [],
//             orderState: 'Confirmed',
//         };

//         (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
//         (getOrder as jest.Mock).mockResolvedValue(mockOrder);
//         (sendWhatsAppMessage as jest.Mock).mockResolvedValue(true);

//         await post(mockRequest as Request, mockResponse as Response);

//         expect(mockResponse.status).toHaveBeenCalledWith(200);
//         expect(mockResponse.send).toHaveBeenCalledWith('Message sent successfully');
//     });

//     it('should return 400 for invalid Pub/Sub message', async () => {
//         (decodePubSubData as jest.Mock).mockReturnValue(null);

//         await post(mockRequest as Request, mockResponse as Response);

//         expect(mockResponse.status).toHaveBeenCalledWith(400);
//         expect(mockResponse.send).toHaveBeenCalledWith('Invalid Pub/Sub message data');
//     });

//     it('should return 404 when order is not found', async () => {
//         const mockDecodedData = { orderId: '12345', orderState: 'Confirmed' };
//         (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
//         (getOrder as jest.Mock).mockResolvedValue(null);

//         await post(mockRequest as Request, mockResponse as Response);

//         expect(mockResponse.status).toHaveBeenCalledWith(404);
//         expect(mockResponse.send).toHaveBeenCalled();
//     });

//     it('should return 500 when WhatsApp message fails to send', async () => {
//         const mockDecodedData = { orderId: '12345', orderState: 'Confirmed' };
//         const mockOrder = {
//             shippingAddress: { mobile: '1234567890' },
//             products: [],
//             orderState: 'Confirmed',
//         };

//         (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
//         (getOrder as jest.Mock).mockResolvedValue(mockOrder);
//         (sendWhatsAppMessage as jest.Mock).mockResolvedValue(null);

//         await post(mockRequest as Request, mockResponse as Response);

//         expect(mockResponse.status).toHaveBeenCalledWith(500);
//         expect(mockResponse.send).toHaveBeenCalledWith('Failed to send WhatsApp message');
//     });

//     it('should return 500 for internal server errors', async () => {
//         (decodePubSubData as jest.Mock).mockImplementation(() => {
//             throw new Error('Unexpected error');
//         });

//         await post(mockRequest as Request, mockResponse as Response);

//         expect(mockResponse.status).toHaveBeenCalledWith(500);
//         expect(mockResponse.send).toHaveBeenCalledWith('Internal server error');
//     });
// });