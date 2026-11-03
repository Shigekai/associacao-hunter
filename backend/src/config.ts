import 'dotenv/config';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const config = {
  databaseUrl: requireEnv('DATABASE_URL'),
  // Required: without it, cors() would allow every origin.
  frontendUrl: requireEnv('FRONTEND_URL'),
  port: Number(process.env.PORT) || 3001,
};
