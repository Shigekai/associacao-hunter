import { Pool } from 'pg';
import { config } from './config.js';

export const pool = new Pool({
  connectionString: config.databaseUrl,
  connectionTimeoutMillis: 5000,
});

// Neon closes idle connections; an unhandled pool error would crash the process.
pool.on('error', (error) => {
  console.error('Idle database client error', error);
});
