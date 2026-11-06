import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import { describe, expect, it, vi } from 'vitest';
import { HealthGate } from '@/components/HealthGate';
import { isApiReady } from '@/lib/api';

vi.mock('@/lib/api');
vi.mock('next/navigation');

// Vitest can't render async Server Components, so the component is awaited as a function.
describe('HealthGate', () => {
  it('redirects to the search as soon as the API is ready', async () => {
    vi.mocked(isApiReady).mockResolvedValue(true);

    await HealthGate();

    expect(redirect).toHaveBeenCalledWith('/search');
  });

  it('offers a retry when the API is down', async () => {
    vi.mocked(isApiReady).mockResolvedValue(false);

    render(await HealthGate());

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
