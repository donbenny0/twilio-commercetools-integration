import { createApiRoot } from '../../client/create.client';
import { OrderNotFoundError, FetchOrderError, InvalidOrderResponseError } from '../../errors/order.error';
import CustomError from '../../errors/custom.error';

// Create the API root for making requests to the commercetools platform
const apiRoot = createApiRoot();

/**
 * Fetches an order using the provided order ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to the order details if found.
 */


export async function getOrder(orderId: string) {

  try {
    // Fetch the order by ID
    const response = await apiRoot.orders().withId({ ID: orderId }).get().execute();

    if (!response) {
      throw new InvalidOrderResponseError();
    }

    return response.body;
  } catch (error: any) {
    if (error.statusCode === 404) {
      throw new OrderNotFoundError(orderId);
    }
    if (error instanceof CustomError) {
      throw error;
    }
    throw new FetchOrderError(orderId);
  }
}
