import { defineEventHandler, setResponseHeaders } from 'h3';

export default defineEventHandler(async (event) => {
  // Handle CORS preflight requests
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400'
  });

  return '';
});