import {genkit} from 'genkit';
import {vertexAI} from '@genkit-ai/vertexai';
import {config} from 'dotenv';

config();

export const ai = genkit({
  plugins: [
    vertexAI({
      projectId: 'studio-1063505923-cbb37',
      location: 'us-central1',
    }),
  ],
});
