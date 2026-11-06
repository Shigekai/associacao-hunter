import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import NotFound from '@/app/not-found';

describe('NotFound', () => {
  it('says nothing was found and links back to the search', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: 'Nenhum registro encontrado' }),
    ).toBeDefined();
    expect(
      screen.getByRole('link', { name: 'Editar busca' }).getAttribute('href'),
    ).toBe('/search');
  });
});
