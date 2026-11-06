import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SheetHeader } from '@/components/sheet/SheetHeader';
import { sheet } from './mocks/sheets';

function renderHeader(overrides: Parameters<typeof sheet>[0] = {}) {
  const data = sheet(overrides);
  render(
    <SheetHeader character={data.character} affiliations={data.affiliations} />,
  );
}

describe('SheetHeader', () => {
  it('shows the full name and first nickname in quotes', () => {
    renderHeader({
      character: {
        firstName: 'Chrollo',
        lastName: 'Lucilfer',
        nicknames: ['Chro', 'Danchou'],
      },
    });

    expect(
      screen.getByRole('heading', { level: 2, name: 'Chrollo Lucilfer' }),
    ).toBeDefined();
    expect(screen.getByText('“Chro”')).toBeDefined();
    expect(screen.queryByText(/Danchou/)).toBeNull();
  });

  it('omits the nickname when the character has none', () => {
    renderHeader({ character: { nicknames: [] } });

    expect(screen.queryByText(/“/)).toBeNull();
  });

  it('shows the license seal and active Hunter Association role', () => {
    renderHeader();

    expect(screen.getByText('Hunter licenciado')).toBeDefined();
    expect(screen.getByText('Lista Negra')).toBeDefined();
  });

  it('omits the role line when the role is Hunter', () => {
    renderHeader({
      affiliations: [
        {
          name: 'Associação Hunter',
          type: 'Organização',
          role: 'Hunter',
          joinedArc: 'Exame Hunter',
          leftArc: null,
          isActive: true,
        },
      ],
    });

    expect(screen.getByText('Hunter licenciado')).toBeDefined();
    expect(screen.queryByText('Hunter')).toBeNull();
  });

  it('omits the license seal when the character is not a licensed Hunter', () => {
    renderHeader({
      character: { isLicensedHunter: false },
      affiliations: [
        {
          name: 'Associação Hunter',
          type: 'Organização',
          role: 'Presidente',
          joinedArc: 'Exame Hunter',
          leftArc: 'Formigas Quimera',
          isActive: false,
        },
      ],
    });

    expect(screen.queryByText('Hunter licenciado')).toBeNull();
    expect(screen.queryByText('Presidente')).toBeNull();
  });
});
