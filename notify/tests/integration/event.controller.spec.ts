import { Request, Response } from 'express';
import { post } from '../../src/controllers/event.controller';
import { getOrder } from '../../src/repository/orders/getOrder.repository';
import { decodePubSubData } from '../../src/utils/helpers.utils';
import { PubSubDecodedData } from '../../src/interfaces/pubsub.interface';
import { OrderNotFoundError } from '../../src/errors/order.error';
import { MissingPubSubMessageDataError } from '../../src/errors/pubsub.error';
import CustomError from '../../src/errors/custom.error';
// Mock modules
jest.mock('../../src/repository/orders/getOrder.repository');
jest.mock('../../src/utils/twilio.utils', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('../../src/utils/helpers.utils');
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


  describe('Error scenarios', () => {
    test('should return 400 for non-confirmed order state', async () => {
      // Arrange
      const mockDecodedData: PubSubDecodedData = {
        orderId: 'mockOrderId',
        orderState: 'Processing'
      };
      (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);

      // Act
      await post(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockSend).toHaveBeenCalledWith('Invalid order state');
    });

    test('should handle missing PubSub message data', async () => {
      // Arrange
      mockRequest.body.message.data = undefined;
      (decodePubSubData as jest.Mock).mockImplementation(() => {
        throw new MissingPubSubMessageDataError();
      });

      // Act & Assert
      await expect(post(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(MissingPubSubMessageDataError);
    });

    test('should handle order not found error', async () => {
      // Arrange
      const mockDecodedData: PubSubDecodedData = {
        orderId: 'nonExistentOrder',
        orderState: 'Confirmed'
      };
      (decodePubSubData as jest.Mock).mockReturnValue(mockDecodedData);
      (getOrder as jest.Mock).mockRejectedValue(new OrderNotFoundError('nonExistentOrder'));

      // Act & Assert
      await expect(post(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(OrderNotFoundError);
    });

    test('should handle unexpected errors with CustomError', async () => {
      // Arrange
      (decodePubSubData as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act & Assert
      await expect(post(mockRequest as Request, mockResponse as Response))
        .rejects
        .toThrow(CustomError);
      await expect(post(mockRequest as Request, mockResponse as Response))
        .rejects
        .toHaveProperty('statusCode', 500);
    });
  });
});