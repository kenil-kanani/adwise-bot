import dotenv from 'dotenv';

dotenv.config();

export const BOT_TOKEN = process.env.BOT_TOKEN;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY;