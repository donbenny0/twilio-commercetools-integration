import { Address } from "@commercetools/platform-sdk";

export type OrderInfo = {
    shippingAddress: Address;
    products: Object;
    orderState: string
}