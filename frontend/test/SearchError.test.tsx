import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import SearchError from '@/app/(registry)/search/error';

describe('SearchError', () => {
  it('offers to load the filters again', async () => {
    const retry = vi.fn();
    render(<SearchError error={new Error('API down')} retry={retry} />);

    expect(screen.getByRole('alert').textContent).toContain(
      'Não foi possível carregar os filtros.',
    );

    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    );
    expect(retry).toHaveBeenCalledOnce();
  });
});
