import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HealthGate } from '@/components/HealthGate';
import { isApiReady } from '@/lib/api';

vi.mock('@/lib/api');
vi.mock('next/navigation');

// Vitest can't render async Server Components, so the component is awaited as a function.
describe('HealthGate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('redirects to the search after at least 4 s when the API is ready', async () => {
    vi.mocked(isApiReady).mockResolvedValue(true);

    const gate = HealthGate();
    await vi.advanceTimersByTimeAsync(3_999);
    expect(redirect).not.toHaveBeenCalled();

    await vi.advanceTimersByTimeAsync(1);
    await gate;
    expect(redirect).toHaveBeenCalledWith('/search');
  });

  it('offers a retry when the API is down', async () => {
    vi.mocked(isApiReady).mockResolvedValue(false);

    const gate = HealthGate();
    await vi.advanceTimersByTimeAsync(4_000);
    render(await gate);

    expect(redirect).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toContain(
      'O servidor não respondeu.',
    );
    expect(
      screen
        .getByRole('link', { name: 'Tentar novamente' })
        .getAttribute('href'),
    ).toBe('/');
  });
});
