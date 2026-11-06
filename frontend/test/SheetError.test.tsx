import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SheetError } from '@/components/sheet/SheetError';

function FailingSheet(): never {
  throw new Error('API down');
}

describe('SheetError', () => {
  it('catches a failure inside the sheet and offers to retry', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

    let shouldFail = true;
    function Child() {
      if (shouldFail) {
        FailingSheet();
      }
      return <p>Kurapika</p>;
    }

    render(
      <SheetError>
        <Child />
      </SheetError>,
    );

    expect(screen.getByRole('alert').textContent).toContain(
      'Não foi possível carregar a ficha.',
    );

    shouldFail = false;
    await userEvent.click(
      screen.getByRole('button', { name: 'Tentar novamente' }),
    );

    expect(screen.getByText('Kurapika')).toBeDefined();
    spy.mockRestore();
  });
});
