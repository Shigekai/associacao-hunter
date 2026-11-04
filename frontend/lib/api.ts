import 'server-only';
import { connection } from 'next/server';

// Render's free tier holds the request while the service wakes up, which can take about a minute.
const healthTimeoutMs = 60_000;

function apiUrl(path: string) {
  // A trailing slash would turn /health into //health, which Express doesn't match.
  const baseUrl = process.env.API_URL?.replace(/\/+$/, '');
  if (!baseUrl) {
    throw new Error('Missing environment variable: API_URL');
  }
  return `${baseUrl}${path}`;
}

export async function isApiReady() {
  // Stops prerendering here: the check must run on every request.
  await connection();
  const url = apiUrl('/health');
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(healthTimeoutMs),
    });
    return response.ok;
  } catch {
    return false;
  }
}
