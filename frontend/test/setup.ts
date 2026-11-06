import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// The package throws outside the react-server build condition, which Vitest doesn't use.
vi.mock('server-only', () => ({}));

// connection() throws outside a Next.js request scope.
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  connection: () => Promise.resolve(),
}));

afterEach(cleanup);
