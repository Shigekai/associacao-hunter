import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SheetCloseButton } from '@/components/sheet/SheetCloseButton';

describe('SheetCloseButton', () => {
  it('submits a dialog form, so the native dialog closes itself', () => {
    render(<SheetCloseButton />);

    const button = screen.getByRole('button', { name: 'Fechar ficha' });
    expect(button.getAttribute('type')).toBe('submit');
    expect(button.closest('form')?.getAttribute('method')).toBe('dialog');
  });
});
