import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultsSkeleton } from '@/components/results/ResultsSkeleton';

describe('ResultsSkeleton', () => {
  it('announces that the records are loading', () => {
    render(<ResultsSkeleton />);

    expect(screen.getByRole('status').textContent).toBe(
      'Carregando registros…',
    );
  });
});
