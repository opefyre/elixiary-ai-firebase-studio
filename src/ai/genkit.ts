import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai';
import {config} from 'dotenv';

config();

// Parse GCP credentials from environment variable
let credentials;
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  try {
    credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  } catch (e) {
    console.error('Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', e);
  }
}

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: 'studio-1063505923-cbb37',
      location: 'us-central1',
      ...(credentials && { credentials }),
    }),
  ],
});
