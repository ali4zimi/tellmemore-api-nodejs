import { defineEventHandler, readBody, setResponseHeaders } from 'h3';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default defineEventHandler(async (event) => {
  // Set CORS headers
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
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
