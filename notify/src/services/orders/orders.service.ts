import { Order } from "@commercetools/platform-sdk";
import { PubSubDecodedData } from "../../interfaces/pubsub.interface";
import { getOrder } from "../../repository/orders/getOrder.repository";
import CustomError from "../../errors/custom.error";
import { InvalidOrderState } from "../../errors/order.error";

export const transformOrder = async (decodedMessage: PubSubDecodedData): Promise<Order> => {
    try {
        if (decodedMessage.orderState !== "Confirmed") {
            throw new InvalidOrderState();
        }
        const order: Order = await getOrder(decodedMessage.orderId);
        return order;
    } catch (error) {
        if (error instanceof CustomError) {
            throw error;
        }
        throw new Error('An unexpected error occurred!');
    }
}

export const getRecipientFromOrder = async (decodedMessage: PubSubDecodedData, channel: string): Promise<string> => {

    const order: Order = await getOrder(decodedMessage.orderId);

    if (channel === 'whatsapp') {
        return order?.shippingAddress?.mobile || 'Unknown user';
    }

    return 'Unknown user';
}