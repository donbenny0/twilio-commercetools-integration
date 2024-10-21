import { createApiRoot } from '../../client/create.client';
import { OrderInfo } from '../../interfaces/order.interface';
import {
  MissingOrderIdError,
  OrderNotFoundError,
  FetchOrderError,
  InvalidOrderResponseError
} from '../../errors/order.error'; // Assuming these errors are stored in 'order.errors.ts'
import CustomError from '../../errors/custom.error';

// Create the API root for making requests to the commercetools platform
const apiRoot = createApiRoot();

/**
 * Fetches an order using the provided order ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to the order details if found.
 * @throws Will throw an error if the order ID is not provided or if the fetch operation fails.
 */
export async function getOrder(orderId: string): Promise<OrderInfo> {
  if (!orderId) {
    throw new MissingOrderIdError();
  }

  try {
    // Fetch the order by ID
    const response = await apiRoot.orders().withId({ ID: orderId }).get().execute();

    if (!response || !response.body) {
      throw new InvalidOrderResponseError();
    }

    const order = response.body;

    if (!order.shippingAddress) {
      throw new InvalidOrderResponseError();
    }

    const orderResponse: OrderInfo = {
      shippingAddress: order.shippingAddress,
    };

    return orderResponse;

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
