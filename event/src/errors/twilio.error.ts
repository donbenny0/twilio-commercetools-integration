import CustomError from '../errors/custom.error';

// Error for missing Twilio configuration (e.g., account SID, auth token, phone number)
export class MissingTwilioConfigError extends CustomError {
  constructor(missingConfig: string) {
    super(500, `Twilio configuration is missing: ${missingConfig}`);
  }
}

// Error for phone number validation failure
export class PhoneNumberValidationError extends CustomError {
  constructor(phoneNumber: string) {
    super(400, `Failed to validate phone number: ${phoneNumber}`);
  }
}

// Error for when the WhatsApp message fails to send
export class WhatsAppMessageSendError extends CustomError {
  constructor(phoneNumber: string) {
    super(500, `Failed to send WhatsApp message to: ${phoneNumber}`);
  }
}
