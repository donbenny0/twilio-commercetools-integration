import { Request, Response } from 'express';
import { post } from '../../src/controllers/event.controller';
import { decodePubSubData } from '../../src/utils/helpers.utils';
import { addNotificationLog } from '../../src/services/customObject/notifications/addNotificationLogs.service';
import { messageHandler } from '../../src/services/messaging/messageHandler.service';
import { resourceHandler } from '../../src/services/messaging/resourceHandler.service';
import CustomError from '../../src/errors/custom.error';

// Mock modules
jest.mock('../../src/utils/helpers.utils');
jest.mock('../../src/services/customObject/notifications/addNotificationLogs.service');
jest.mock('../../src/services/messaging/messageHandler.service');
jest.mock('../../src/services/messaging/resourceHandler.service');
// Mock environment variable reading
jest.mock('../../src/utils/config.utils.ts', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        CTP_CLIENT_ID: "client-id",
        CTP_CLIENT_SECRET: "client-secret",
        CTP_PROJECT_KEY: "project-key",
        CTP_SCOPE: "scope",
        CTP_REGION: "region"
    })
}));
jest.mock('../../src/utils/twilio.utils', () => ({
    readConfiguration: jest.fn().mockReturnValue({
        TWILIO_ACCOUNT_SID: 'sid',
        TWILIO_AUTH_TOKEN: 'auth-token',
        TWILIO_FROM_NUMBER: 'from-number',
        CUSTOM_MESSAGE_TEMPLATE:"Hello {{shippingAddress.firstName}},\n\n your order #{{id}} has been confirmed! Total rates: {{taxedPrice.taxPortions[*].rate}}."
    })
}));
describe('Event Controller Integration Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockStatus = jest.fn().mockReturnThis();
  const mockSend = jest.fn().mockReturnThis();

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      body: {
        message: {
          data: Buffer.from(JSON.stringify({
            orderId: 'mockOrderId',
            orderState: 'Confirmed'
          })).toString('base64')
        }
      }
    };

    mockResponse = {
      status: mockStatus,
      send: mockSend
    };
  });

  describe('Successful scenarios', () => {
    test('should return 200 and send message successfully', async () => {
      // Arrange
      const mockDecodedData = {
        orderId: 'mockOrderId',
        orderState: 'Confirmed'
      };
      const mockResourceData = { id: 'mockOrderId', shippingAddress: { mobile: '1234567890' } };

      (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
      (resourceHandler as jest.Mock).mockResolvedValue(mockResourceData);
      (messageHandler as jest.Mock).mockResolvedValue(undefined);
      (addNotificationLog as jest.Mock).mockResolvedValue(undefined);

      // Act
      await post(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockSend).toHaveBeenCalledWith('Message sent successfully');
      expect(addNotificationLog).toHaveBeenCalledWith('whatsapp', true, 'notifications', mockDecodedData);
    });
  });

  describe('Error scenarios', () => {
    test('should handle errors during message sending and return CustomError', async () => {
      // Arrange
      const mockDecodedData = {
        orderId: 'mockOrderId',
        orderState: 'Confirmed'
      };
      const mockResourceData = { id: 'mockOrderId', shippingAddress: { mobile: '1234567890' } };

      (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
      (resourceHandler as jest.Mock).mockResolvedValue(mockResourceData);
      (messageHandler as jest.Mock).mockImplementation(() => {
        throw new Error('Message handler failed');
      });

      // Act & Assert
      await expect(post(mockRequest as Request, mockResponse as Response)).rejects.toThrow(CustomError);
      expect(addNotificationLog).toHaveBeenCalledWith('whatsapp', false, 'notifications', mockDecodedData, expect.any(Error));
    });
  });
});
