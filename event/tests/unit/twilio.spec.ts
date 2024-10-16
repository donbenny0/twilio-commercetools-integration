import { describe, expect, test } from '@jest/globals';
import { OrderInfo } from '../../src/interfaces/order.interface';


const whatsappValidResponse = {
    "account_sid": "ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "api_version": "2010-04-01",
    "body": "Hello there!",
    "date_created": "Thu, 24 Aug 2023 05:01:45 +0000",
    "date_sent": "Thu, 24 Aug 2023 05:01:45 +0000",
    "date_updated": "Thu, 24 Aug 2023 05:01:45 +0000",
    "direction": "outbound-api",
    "error_code": null,
    "error_message": null,
    "from": "whatsapp:+14155238886",
    "num_media": "0",
    "num_segments": "1",
    "price": null,
    "price_unit": null,
    "messaging_service_sid": "MGaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "sid": "SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    "status": "queued",
    "subresource_uris": {
        "media": "/2010-04-01/Accounts/ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Media.json"
    },
    "tags": {
        "campaign_name": "Spring Sale 2022",
        "message_type": "cart_abandoned"
    },
    "to": "whatsapp:+15005550006",
    "uri": "/2010-04-01/Accounts/ACaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/Messages/SMaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.json"
}

describe('sendWhatsAppMessage', () => {

    test('should call sendWhatsAppMessage with correct parameters', async () => {
        const order: OrderInfo = {
            shippingAddress: {
                firstName: "Sarah",
                lastName: "Williams",
                streetName: "456 Peaceful Street",
                streetNumber: "102",
                additionalStreetInfo: "Suite 2B",
                postalCode: "67890",
                city: "Tranquil Town",
                region: "Serenity Region",
                state: "California",
                country: "US",
                company: "CalmTech Ltd.",
                phone: "+1-800-1234567",
                mobile: "+917306227380",
                email: "sarah.williams@example.com"
            },
            products: [],
            orderState: "Confirmed"
        };


        // Set up the mocked return value for the mocked function
        const { sendWhatsAppMessage } = require('../../src/utils/twilio.utils'); // Import the mocked function

        sendWhatsAppMessage.mockReturnValue(Promise.resolve(whatsappValidResponse)); // Mock return value

        // Call the function that should invoke sendWhatsAppMessage
        const response = await sendWhatsAppMessage(order);

        // Assert that the mock was called with expected parameters
        expect(sendWhatsAppMessage).toHaveBeenCalledWith(order);
        expect(response).toEqual(whatsappValidResponse); // Check if the response matches your mock response
    })

});