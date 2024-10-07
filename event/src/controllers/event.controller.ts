import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils'; // Assuming this is your logger
import twilio from 'twilio';
import * as dotenv from 'dotenv';
import { getOrder } from '../repository/orders/getOrder';
dotenv.config(); // Load environment variables from a .env file

/**
 * Exposed event POST endpoint.
 * Receives the Pub/Sub message and works with it
 *
 * @param {Request} request The express request
 * @param {Response} response The express response
 * @returns
 */

export const post = async (request: Request, response: Response) => {
  try {

    // Receive the Pub/Sub message
    const pubSubMessage = request.body.message;

    // For our example we will use the customer id as a var
    // and the query the commercetools sdk with that info
    const decodedData = pubSubMessage.data
      ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
      : undefined;

    if (decodedData) {
      const jsonData = JSON.parse(decodedData);

      // Use environment variables for Twilio credentials
      const accountSid = process.env.TWILIO_ACCOUNT_SID; // Default for debugging
      const authToken = process.env.TWILIO_AUTH_TOKEN; // Default for debugging

      if (!accountSid || !authToken) {
        logger.error('Twilio credentials are missing.');
        return response.status(500).json({ error: 'Twilio credentials are missing' });
      }

      const order = await getOrder(jsonData.orderId);
      const toPhoneNumber = order.shippingAddress.mobile

      const client = twilio(accountSid, authToken);

      const message = await client.messages.create({
        body: `Hi, ${order.shippingAddress.firstName} ${order.shippingAddress.lastName} your order has been confirmed`,
        from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
        to: `whatsapp:${toPhoneNumber}`,
      });

      // Log successful message response
      logger.info('Message sent successfully:', { messageSid: message.sid });

      // Respond with the message details
      return response.status(200).json(message);
    }



  } catch (error) {
    // Debugging: Log the error with details
    logger.error('Error sending WhatsApp message:', { error: error });

    // Return an appropriate error response
    return response.status(500).json({
      error: 'Internal server error. Failed to send WhatsApp message.',
      details: error,
    });
  }
};
// export const post = async (request: Request, response: Response) => {
//   try {

//     const orderId: string = request.body.orderId;
//     // console.log("Order ID",orderId);
//     const orders = await getOrder(orderId);
//     console.log(orders);

//     response.json({ "message": orders })

//   } catch (error) {
//     // Debugging: Log the error with details
//     logger.error('Error :', { error: error });

//     // Return an appropriate error response
//     return response.status(500).json({
//       error: 'Internal server error',
//       details: error,
//     });
//   }
// };
