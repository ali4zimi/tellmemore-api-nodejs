import { defineEventHandler, readBody, setResponseHeaders, getHeader, getMethod } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  // Handle preflight OPTIONS request
  if (getMethod(event) === 'OPTIONS') {
    setResponseHeaders(event, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400'
    });
    return '';
  }

  // Get the origin from the request
  const origin = getHeader(event, 'origin');
  const allowedOrigins = ['https://www.netflix.com', 'https://netflix.com'];
  const allowedOrigin = allowedOrigins.includes(origin || '') ? origin : '*';

  // Set CORS headers for the actual request
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });

  const body = await readBody(event);
  const { subtitles, question, apiKey } = body || {};

  if (!subtitles || !question) {
    return {
      error: "Both 'subtitles' and 'question' are required."
    };
  }

  const prompt = `Movie subtitles: ${subtitles}\nUser question: ${question}\nAnswer:`;

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(prompt);
    const answer = result.response.text().trim();
    return { answer };
  } catch (e: any) {
    return {
      error: e.message || String(e)
    };
  }
});
