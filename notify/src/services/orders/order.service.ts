import CustomError from "../../errors/custom.error";
import { InvalidOrderResponseError, MissingOrderIdError } from "../../errors/order.error";
import { OrderInfo } from "../../interfaces/order.interface";
import { getOrder } from "../../repository/orders/getOrder.repository";

export const transformOrder = async (orderId: string): Promise<OrderInfo> => {
    if (!orderId || orderId.trim() === '') {
        throw new MissingOrderIdError();
    }

    try {
        const order = await getOrder(orderId);
        if (!order.shippingAddress) {
            throw new InvalidOrderResponseError();
        }

        const orderResponse: OrderInfo = {
            shippingAddress: order.shippingAddress,
        };
        return orderResponse;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw new Error(`An unexpected error occurred: ${error}`);
    }
};
