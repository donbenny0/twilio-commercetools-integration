# Connector Installation Guide

## Prerequisites

* A CommerceTools project.
* A Twilio account with WhatsApp API access.

## How to Install

1. Make sure that you have created an [Twilio ](https://www.twilio.com/)account. Your credentials data that you need for a successful deployment is as follows:
   * **TWILIO_ACCOUNT_SID** ( Used to authenticate REST API requests )
   * **TWILIO_AUTH_TOKEN** ( Used to authenticate REST API requests )
   * **TWILIO_FROM_NUMBER** ( To use Twilio's Messaging APIs with WhatsApp, you will need a WhatsApp-enabled phone number, also referred to as a WhatsApp Sender. )
2. To deploy and to use a commercetools connector, you need a dedicated API Client. You can create it in Settings > Developer Settings > Create new API client (top right corner) using the Admin client scope template. You will need:
   * **CTP_CLIENT_ID**
   * **CTP_CLIENT_SECRET**
   * **CTP_PROJECT_KEY**
   * **CTP_SCOPE**
