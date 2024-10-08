import { Address, LineItem } from '@commercetools/platform-sdk';

export interface OrderInfo {
    shippingAddress?: Address;
    products: LineItem[];
    orderState: string;
}
