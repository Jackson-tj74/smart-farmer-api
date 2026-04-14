import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('OPENAI_API_KEY is missing in environment variables');
}

export const openai = new OpenAI({
  apiKey: apiKey,
});

export const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';