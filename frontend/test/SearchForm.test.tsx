import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchForm } from '@/components/search/SearchForm';
import { mockFetch } from './mocks/fetch';
import {
  affiliations,
  arcs,
  nameSuggestions,
  nenCategories,
} from './mocks/lists';
import { mockRouter } from './mocks/router';

vi.mock('next/navigation');

function renderForm() {
  const push = mockRouter();
  render(
    <SearchForm
      arcs={arcs}
      nenCategories={nenCategories}
      affiliations={affiliations}
    />,
  );
  return push;
}

const nameInput = () => screen.getByRole('combobox', { name: 'Nome' });
const select = (label: string) =>
  screen.getByLabelText(label) as HTMLSelectElement;

describe('SearchForm', () => {
  beforeEach(() => {
    mockFetch(nameSuggestions(0, []));
  });

  it('searches with only the filled filters, trimming the name', async () => {
    const user = userEvent.setup();
    const push = renderForm();

    await user.type(nameInput(), ' Killua ');
    await user.selectOptions(select('Arco'), 'Greed Island');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() =>
      expect(push).toHaveBeenCalledWith('/hunters?name=Killua&arcId=4'),
    );
  });

  it('searches every hunter when no filter is set', async () => {
    const user = userEvent.setup();
    const push = renderForm();

    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/hunters'));
  });

  it('clears every filter without searching', async () => {
    const user = userEvent.setup();
    const push = renderForm();
    await user.type(nameInput(), 'Gon');
    await user.selectOptions(select('Arco'), 'Exame Hunter');
    await user.selectOptions(select('Categoria Nen'), 'Transmutação');
    await user.selectOptions(select('Filiação'), 'Família Zoldyck');

    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    expect(nameInput()).toHaveProperty('value', '');
    expect(select('Arco').value).toBe('');
    expect(select('Categoria Nen').value).toBe('');
    expect(select('Filiação').value).toBe('');
    expect(push).not.toHaveBeenCalled();
  });

  it('submits as a plain GET to /hunters before hydration', () => {
    renderForm();

    const form = screen
      .getByRole('button', { name: 'Buscar' })
      .closest('form') as HTMLFormElement;

    expect(form.getAttribute('action')).toBe('/hunters');
    expect(form.getAttribute('method')).toBe('get');
    expect(
      Array.from(form.elements, (element) =>
        element.getAttribute('name'),
      ).filter(Boolean),
    ).toEqual(['name', 'arcId', 'categoryId', 'affiliationId']);
  });
});
