import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NenStatus } from '@/components/sheet/NenStatus';
import { sheet } from './mocks/sheets';

function datum(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling
    ?.textContent;
}

describe('NenStatus', () => {
  it('shows the main and secondary categories and each efficiency meter', () => {
    render(<NenStatus idPrefix="sheet-3" nen={sheet().nen} />);

    expect(datum('Principal')).toBe('Materialização');
    expect(datum('Secundária')).toBe('Especialização');

    const section = screen.getByRole('region', { name: 'Status' });
    const meters = within(section).getAllByRole('meter');
    expect(
      meters.map((meter) => [
        meter.getAttribute('aria-labelledby'),
        meter.getAttribute('value'),
      ]),
    ).toEqual([
      ['sheet-3-status-0', '60'],
      ['sheet-3-status-1', '80'],
      ['sheet-3-status-2', '100'],
      ['sheet-3-status-3', '0'],
      ['sheet-3-status-4', '60'],
      ['sheet-3-status-5', '40'],
    ]);
    expect(screen.getByText('100%')).toBeDefined();
    expect(screen.getByText('0%')).toBeDefined();
  });

  it('marks a null efficiency as unknown with an em dash and zero meter value', () => {
    render(
      <NenStatus
        idPrefix="sheet-9"
        nen={{
          categories: [],
          efficiency: [{ category: 'Intensificação', percent: null }],
        }}
      />,
    );

    expect(screen.queryByText('Principal', { selector: 'dt' })).toBeNull();
    expect(screen.getByText('—')).toBeDefined();
    const meter = screen.getByRole('meter', { name: 'Intensificação' });
    expect(meter.getAttribute('value')).toBe('0');
    expect(meter.getAttribute('aria-valuetext')).toBe('Desconhecido');
  });
});
