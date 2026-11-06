import { Pool, types } from 'pg';
import { config } from './config.js';

// DATE stays as 'YYYY-MM-DD': parsing it into a JS Date would shift the day with the server time zone.
types.setTypeParser(types.builtins.DATE, (value) => value);

export const pool = new Pool({
  connectionString: config.databaseUrl,
  connectionTimeoutMillis: 5000,
});

// Neon closes idle connections; an unhandled pool error would crash the process.
pool.on('error', (error) => {
  console.error('Idle database client error', error);
});
