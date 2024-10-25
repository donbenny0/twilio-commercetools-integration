
import { getOrder } from './getOrder.repository';
import { OrderNotFoundError, FetchOrderError } from '../../errors/order.error';

// Mock the entire module
jest.mock('../../client/create.client', () => ({
    createApiRoot: jest.fn()
}));

describe('getOrder.repository.ts', () => {
    let mockExecute: jest.Mock<Promise<{ body: { id: string; state: string } }>>;

    beforeEach(() => {
        // Reset the mock before each test
        jest.resetAllMocks();

        // Set up the mock structure
        mockExecute = jest.fn().mockResolvedValue({ body: { id: '123', state: 'Confirmed' } });
        const mockGet = jest.fn().mockReturnValue({ execute: mockExecute });
        const mockWithId = jest.fn().mockReturnValue({ get: mockGet });
        const mockOrders = jest.fn().mockReturnValue({ withId: mockWithId });

        // Mock the createApiRoot function
        require('../../client/create.client').createApiRoot.mockReturnValue({
            orders: mockOrders
        });
    });

    it('should fetch order by ID', async () => {
        const order = await getOrder('123');
        expect(order).toEqual({ id: '123', state: 'Confirmed' });
    });

    it('should throw OrderNotFoundError if order does not exist', async () => {
        mockExecute.mockRejectedValue({ statusCode: 404 });

        await expect(getOrder('invalidId')).rejects.toThrow(OrderNotFoundError);
    });

    it('should throw FetchOrderError for other errors', async () => {
        mockExecute.mockRejectedValue(new Error('Some other error'));

        await expect(getOrder('123')).rejects.toThrow(FetchOrderError);
    });
});
