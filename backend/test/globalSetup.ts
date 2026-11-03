import { readFile } from 'node:fs/promises';
import { Client } from 'pg';

const sqlFiles = ['schema.sql', 'seed.sql'];

export async function setup() {
  const databaseUrl = new URL(process.env.TEST_DATABASE_URL!);
  const databaseName = databaseUrl.pathname.slice(1);
  // The database is dropped below, so refuse anything that is not a test database.
  if (!databaseName.endsWith('_test')) {
    throw new Error(`TEST_DATABASE_URL must name a database ending in _test, got "${databaseName}"`);
  }

  const maintenanceUrl = new URL(databaseUrl);
  maintenanceUrl.pathname = '/postgres';
  const admin = new Client({ connectionString: maintenanceUrl.href });
  await admin.connect();
  try {
    const name = admin.escapeIdentifier(databaseName);
    await admin.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
    await admin.query(`CREATE DATABASE ${name}`);
  } finally {
    await admin.end();
  }

  const client = new Client({ connectionString: databaseUrl.href });
  await client.connect();
  try {
    for (const file of sqlFiles) {
      await client.query(await readFile(new URL(`../../database/${file}`, import.meta.url), 'utf8'));
    }
  } finally {
    await client.end();
  }
}
