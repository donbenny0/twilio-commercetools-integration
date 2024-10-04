import { Request, Response } from 'express';
import { logger } from '../utils/logger.utils'; // Assuming this is your logger
import twilio from 'twilio';
import * as dotenv from 'dotenv';
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
    logger.debug('Received message:', { message: pubSubMessage });
    
    // Check if the message is valid
    if (!pubSubMessage || !pubSubMessage.data) {
      logger.warn('Received empty or invalid Pub/Sub message:', { message: pubSubMessage });
      return response.status(400).json({
        error: 'Bad Request. No data in the message.',
      });
    }

    // Decode the data from base64
    const decodedData = Buffer.from(pubSubMessage.data, 'base64').toString().trim();
    const jsonData = JSON.parse(decodedData); // Parse JSON only if data is present
    logger.debug('Decoded data:', { data: jsonData });

    return response.status(200).json({
      message: 'Message received successfully',
      data: jsonData,
    });

  } catch (error) {
    // Debugging: Log the error with details
    logger.error('Error in receiving message:', { error: error, stack: error });

    // Return an appropriate error response
    return response.status(500).json({
      error: 'Internal server error. Failed to send WhatsApp message.',
      details: error, // Log just the message to avoid exposing sensitive data
    });
  }
};

// export const post = async (request: Request, response: Response) => {
//   try {
//     // Ensure the request has the necessary parameters
//     const toPhoneNumber = request.body.to;
//     const fromPhoneNumber = request.body.from;

//     if (!toPhoneNumber || !fromPhoneNumber) {
//       logger.warn('No phone number provided in request body.');
//       return response.status(400).json({ error: 'Phone number is required.' });
//     }

//     // Receive the Pub/Sub message
//     const pubSubMessage = request.body.message;

//     // For our example we will use the customer id as a var
//     // and the query the commercetools sdk with that info
//     const decodedData = pubSubMessage.data
//       ? Buffer.from(pubSubMessage.data, 'base64').toString().trim()
//       : undefined;

//     if (decodedData) {
//       const jsonData = JSON.parse(decodedData);

//     }

//     // Use environment variables for Twilio credentials
//     const accountSid = process.env.TWILIO_ACCOUNT_SID; // Default for debugging
//     const authToken = process.env.TWILIO_AUTH_TOKEN; // Default for debugging

//     if (!accountSid || !authToken) {
//       logger.error('Twilio credentials are missing.');
//       return response.status(500).json({ error: 'Twilio credentials are missing' });
//     }

//     const client = twilio(accountSid, authToken);

//     const message = await client.messages.create({
//       body: "This is the ship that made the Kessel Run in fourteen parsecs?",
//       from: `whatsapp:${process.env.TWILIO_FROM_NUMBER}`,
//       to: `whatsapp:${toPhoneNumber}`,
//     });

//     // Log successful message response
//     logger.info('Message sent successfully:', { messageSid: message.sid });

//     // Respond with the message details
//     return response.status(200).json(message);


//   } catch (error) {
//     // Debugging: Log the error with details
//     logger.error('Error sending WhatsApp message:', { error: error });

//     // Return an appropriate error response
//     return response.status(500).json({
//       error: 'Internal server error. Failed to send WhatsApp message.',
//       details: error,
//     });
//   }
// };
