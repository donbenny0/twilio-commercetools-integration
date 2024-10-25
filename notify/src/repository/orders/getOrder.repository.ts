import { createApiRoot } from '../../client/create.client';
import { OrderNotFoundError, FetchOrderError, InvalidOrderResponseError } from '../../errors/order.error';
import CustomError from '../../errors/custom.error';

/**
 * Fetches an order using the provided order ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to the order details if found.
 * @throws {OrderNotFoundError} If the order is not found
 * @throws {FetchOrderError} If there's an error fetching the order
 * @throws {InvalidOrderResponseError} If the response is invalid
 */
export async function getOrder(orderId: string) {
  // Validate input
  if (!orderId) {
    throw new Error('Order ID is required');
  }

  let apiRootInstance;
  try {
    // Initialize API root with error handling
    apiRootInstance = createApiRoot();
    if (!apiRootInstance) {
      throw new Error('Failed to initialize API client');
    }

    // Verify the orders method exists
    if (typeof apiRootInstance.orders !== 'function') {
      throw new Error('Invalid API client configuration');
    }

    // Fetch the order by ID
    const response = await apiRootInstance
      .orders()
      .withId({ ID: orderId })
      .get()
      .execute();

    // Validate response
    if (!response || !response.body) {
      throw new InvalidOrderResponseError();
    }

    return response.body;

  } catch (error: any) {
    // Handle specific error types
    if (error instanceof CustomError) {
      throw error;
    }

    // Handle 404 errors specifically
    if (error?.statusCode === 404) {
      throw new OrderNotFoundError(`Order with ID ${orderId} not found`);
    }
    // Handle other API errors
    if (error?.message) {
      throw new FetchOrderError(`Failed to fetch order: ${error.message}`);
    }
    // Generic error fallback
    throw new FetchOrderError('An unexpected error occurred while fetching the order');
  }
}