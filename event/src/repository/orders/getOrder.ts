import { ClientResponse, Order } from '@commercetools/platform-sdk';
import { createApiRoot } from '../../client/create.client';
import { OrderInfo } from '../../types/order.types';

// Create the API root for making requests to the commercetools platform
const apiRoot = createApiRoot();

/**
 * Fetches an order using the provided order ID.
 * @param orderId - The ID of the order to retrieve.
 * @returns A promise that resolves to the order details if found.
 * @throws Will throw an error if the order ID is not provided or if the fetch operation fails.
 */


export async function getOrder(orderId: string): Promise<OrderInfo> {
    // Check if orderId is provided
    if (!orderId) {
        throw new Error('Order ID is required to fetch the order.');
    }

    try {
        // Fetch the order by ID
        const response = await apiRoot
            .orders()
            .withId({ ID: orderId })
            .get()
            .execute();

        // Ensure the response contains the order
        if (!response || !response.body) {
            throw new Error(`Order not found for ID: ${orderId}`);
        }

        const order = response.body;

        // Check if shippingAddress is not empty
        if (!order.shippingAddress || Object.keys(order.shippingAddress).length === 0) {
            throw new Error(`Shipping address is empty for order ID: ${orderId}`);
        }

        // Structure the order response
        const orderResponse: OrderInfo = {
            shippingAddress: order.shippingAddress,
            products: order.lineItems,
            orderState: order.orderState
        };

        return orderResponse;

    } catch (error) {
        // Log the error for better debugging
        console.error(`Error fetching order with ID ${orderId}:`, error);

        // Throw a more descriptive error
        if (error instanceof Error) {
            throw new Error(`Failed to fetch order with ID ${orderId}: ${error.message}`);
        } else {
            throw new Error(`Failed to fetch order with ID ${orderId}: Unknown error occurred.`);
        }
    }
}

