import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ArcList } from '@/components/sheet/ArcList';

describe('ArcList', () => {
  it('lists the arcs in order with two-digit numbers', () => {
    render(
      <ArcList
        idPrefix="sheet-3"
        arcs={[
          { number: 1, name: 'Exame Hunter', startChapter: 1, endChapter: 43 },
          {
            number: 5,
            name: 'Formigas Quimera',
            startChapter: 186,
            endChapter: 318,
          },
        ]}
      />,
    );

    expect(
      screen.getAllByRole('listitem').map((item) => item.textContent),
    ).toEqual(['01Exame Hunter', '05Formigas Quimera']);
  });
});
