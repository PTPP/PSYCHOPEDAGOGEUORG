import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";

admin.initializeApp();

// Definiujemy sekrety, których będziemy używać
const SMS_API_KEY = functions.config().secrets.SMS_API_KEY;
const SMS_URL = functions.config().secrets.SMS_URL;
const MAIL_API_KEY = functions.config().secrets.MAIL_API_KEY;
const MAIL_URL = functions.config().secrets.MAIL_URL;

interface NotificationPayload {
  type: 'sms' | 'email';
  to: string;
  text?: string; // dla SMS
  subject?: string; // dla Email
  message?: string; // dla Email
  fromAlias?: string; // dla Email (opcjonalnie)
}

export const sendNotification = functions.https.onCall(async (data: NotificationPayload, context) => {
  const { type, to, text, subject, message, fromAlias } = data;

  if (!type || !to) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with "type" and "to" arguments.');
  }

  try {
    if (type === 'sms') {
      if (!text) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing "text" for SMS notification.');
      }
      
      const smsPayload = {
        kluczyk: SMS_API_KEY,
        phone: to,
        text: text,
      };

      const response = await fetch(SMS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(smsPayload),
        redirect: 'follow',
      });

      const responseData = await response.json();
      return { success: true, response: responseData };
    
    } else if (type === 'email') {
      if (!subject || !message) {
        throw new functions.https.HttpsError('invalid-argument', 'Missing "subject" or "message" for email notification.');
      }

      const emailPayload: any = {
        kluczyk: MAIL_API_KEY,
        to: to,
        subject: subject,
        message: message,
      };

      if (fromAlias) {
        emailPayload.fromAlias = fromAlias;
      }

      const response = await fetch(MAIL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(emailPayload),
      });

      const responseData = await response.json();
      return { success: true, response: responseData };

    } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid notification type specified.');
    }
  } catch (error) {
    console.error("Error sending notification:", error);
    throw new functions.https.HttpsError('internal', 'Failed to send notification.', error);
  }
});
