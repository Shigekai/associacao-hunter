import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultsHeading } from '@/components/results/ResultsHeading';

describe('ResultsHeading', () => {
  it('links back to the search', () => {
    render(<ResultsHeading />);

    expect(
      screen
        .getByRole('link', { name: 'Voltar para a busca' })
        .getAttribute('href'),
    ).toBe('/search');
  });
});
