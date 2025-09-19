import { defineEventHandler, setResponseHeaders, getHeader } from 'h3';

export default defineEventHandler(async (event) => {
  // Get the origin from the request
  const origin = getHeader(event, 'origin');
  const allowedOrigins = ['https://www.netflix.com', 'https://netflix.com'];
  const allowedOrigin = allowedOrigins.includes(origin || '') ? origin : '*';

  // Handle CORS preflight requests
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  });

  return '';
});