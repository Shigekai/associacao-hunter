import { notFound } from 'next/navigation';
import { vi } from 'vitest';

export const notFoundError = new Error('notFound');

export function mockNotFound() {
  vi.mocked(notFound).mockImplementation(() => {
    throw notFoundError;
  });
}
