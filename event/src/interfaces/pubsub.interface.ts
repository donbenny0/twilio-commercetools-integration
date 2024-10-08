export interface PubSubEncodedMessage {
    data?: string;
}

export interface PubSubDecodedData {
    orderId: string;
    orderState: string;
}
