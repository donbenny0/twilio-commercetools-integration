import { Address } from "@commercetools/platform-sdk";

export interface OrderInfo {
    shippingAddress?: Address;
    products: Object;
    orderState: string
}