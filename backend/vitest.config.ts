import 'dotenv/config';
import { defineConfig } from 'vitest/config';

const testDatabaseUrl = process.env.TEST_DATABASE_URL;
if (!testDatabaseUrl) {
  throw new Error('Missing environment variable: TEST_DATABASE_URL');
}

export default defineConfig({
  test: {
    globalSetup: './test/globalSetup.ts',
    setupFiles: ['./test/setup.ts'],
    // config.ts reads DATABASE_URL, and dotenv never overrides a variable that is already set.
    env: { DATABASE_URL: testDatabaseUrl },
  },
});
