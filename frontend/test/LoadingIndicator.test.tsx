import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LoadingIndicator } from '@/components/LoadingIndicator';

describe('LoadingIndicator', () => {
  it('announces that the page is loading', () => {
    render(<LoadingIndicator />);

    expect(screen.getByRole('status').textContent).toContain('Carregando');
  });
});
