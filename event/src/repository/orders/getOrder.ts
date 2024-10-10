import { createApiRoot } from '../../client/create.client';
import { OrderInfo } from '../../interfaces/order.interface';

// Create the API root for making requests to the commercetools platform
const apiRoot = createApiRoot();

/**
 * Fetches an order using the provided order ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to the order details if found.
 * @throws Will throw an error if the order ID is not provided or if the fetch operation fails.
 */

export async function getOrder(orderId: string): Promise<OrderInfo | null> {
  if (!orderId) {
    return null;
  }
  try {
    // Fetch the order by ID
    const response = await apiRoot
      .orders()
      .withId({ ID: orderId })
      .get()
      .execute();

    const order = response.body;

    const orderResponse: OrderInfo = {
      shippingAddress: order.shippingAddress,
      products: order.lineItems,
      orderState: order.orderState,
    };

    return orderResponse;
  } catch (error) {
    return null; // Returning null to handle this in the controller
  }
}

