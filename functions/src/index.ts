/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { initializeApp, database } from 'firebase-admin';
import { onRequest } from 'firebase-functions/v2/https';
import * as logger from 'firebase-functions/logger';
import 'dotenv/config';

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

interface PomoData {
  type: string;
  round: string;
}

initializeApp({
  databaseURL: process.env.DATABASE_URL,
});

const pomoWebhook = onRequest((request, response) => {
  // get data from Pomofocus webhook
  const pomoData: PomoData = request.body;
  logger.info('pomoData', { data: pomoData });
  // get type
  const eventType: string = pomoData.type;
  const round: string = pomoData.round;

  const pomoStatusToDB: PomoData = {
    type: eventType,
    round,
  };

  logger.info('pomoFinalStatus', pomoStatusToDB);
  database()
    .ref('/pomoData/')
    .set(pomoStatusToDB)
    .then(() => {
      response.status(200).send('Data saved successfully!');
    })
    .catch((error) => {
      response.status(500).send(error);
    });
});

module.exports = pomoWebhook;
