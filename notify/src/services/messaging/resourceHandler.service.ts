import { transformOrder } from "../orders/orders.service";

export const resourceHandler = async (decodedData: Record<string, any>) => {
    switch (decodedData.resource.typeId) {
        case 'order':
            return await transformOrder(decodedData);

        default:
            return null;
    }
}
