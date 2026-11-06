import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CharacterPortrait } from '@/components/CharacterPortrait';

describe('CharacterPortrait', () => {
  it('shows the picture in public/characters named after the character', () => {
    render(<CharacterPortrait name="Isaac Netero" alt="Netero" sizes="1px" />);

    expect(
      screen.getByRole('img', { name: 'Netero' }).getAttribute('src'),
    ).toContain(encodeURIComponent('/characters/isaac-netero.jpg'));
  });

  it('falls back to a halftone placeholder without a picture', () => {
    render(<CharacterPortrait name="Ging Freecss" alt="Ging" sizes="1px" />);

    expect(
      screen.getByRole('img', { name: 'Ging' }).getAttribute('src'),
    ).toBeNull();
  });
});
