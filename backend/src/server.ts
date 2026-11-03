import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { pool } from './database.js';

const app = express();

// An array makes cors echo only a matching origin; a plain string is sent to every caller.
app.use(cors({ origin: [config.frontendUrl] }));

app.get('/health', async (_request, response) => {
  try {
    await pool.query('SELECT 1');
    response.json({ status: 'ok', database: 'ok' });
  } catch (error) {
    console.error('Health check failed', error);
    response.status(503).json({ status: 'error', database: 'unreachable' });
  }
});

app.listen(config.port, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Backend listening on http://localhost:${config.port}`);
});
