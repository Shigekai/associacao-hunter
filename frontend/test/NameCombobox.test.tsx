import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { Form, Formik } from 'formik';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { NameCombobox } from '@/components/search/NameCombobox';
import { mockFetch, mockFetchQueue } from './mocks/fetch';
import { nameSuggestions } from './mocks/lists';

function renderCombobox() {
  const onSubmit = vi.fn();
  render(
    <Formik initialValues={{ name: '' }} onSubmit={onSubmit}>
      <Form>
        <NameCombobox />
      </Form>
    </Formik>,
  );
  const input = screen.getByRole('combobox', {
    name: 'Nome',
  }) as HTMLInputElement;
  return { onSubmit, input };
}

function type(input: HTMLInputElement, value: string) {
  fireEvent.change(input, { target: { value } });
}

function press(input: HTMLInputElement, key: string) {
  return fireEvent.keyDown(input, { key });
}

async function advance(ms: number) {
  await act(() => vi.advanceTimersByTimeAsync(ms));
}

const optionNames = () =>
  screen.queryAllByRole('option').map((option) => option.textContent);

describe('NameCombobox', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks for suggestions once, after a 300 ms pause in typing', async () => {
    const fetchMock = mockFetch(nameSuggestions(0, []));
    const { input } = renderCombobox();

    type(input, 'z');
    await advance(200);
    type(input, 'zo');
    await advance(299);
    expect(fetchMock).not.toHaveBeenCalled();

    await advance(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/hunters/suggestions?name=zo',
      expect.anything(),
    );
  });

  it('shows the count and emphasizes the typed term', async () => {
    mockFetch(nameSuggestions(2, ['Killua Zoldyck', 'Illumi Zoldyck']));
    const { input } = renderCombobox();

    type(input, 'zo');
    await advance(300);

    expect(screen.getByText('2 registros')).toBeTruthy();
    expect(optionNames()).toEqual(['Killua Zoldyck', 'Illumi Zoldyck']);
    const [first] = screen.getAllByRole('option');
    expect(within(first).getByText('Zo').tagName).toBe('STRONG');
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('says how many it shows when there are more than five', async () => {
    mockFetch(nameSuggestions(7, ['A o', 'B o', 'C o', 'D o', 'E o']));
    const { input } = renderCombobox();

    type(input, 'o');
    await advance(300);

    expect(screen.getByText('7 registros · mostrando 5')).toBeTruthy();
    expect(screen.getAllByRole('option')).toHaveLength(5);
  });

  it('shows a nickname match without emphasis', async () => {
    mockFetch(nameSuggestions(1, ['Kurapika']));
    const { input } = renderCombobox();

    type(input, 'rato');
    await advance(300);

    expect(screen.getByText('1 registro')).toBeTruthy();
    expect(screen.getByRole('option').querySelector('strong')).toBeNull();
  });

  it('says when no record matches', async () => {
    mockFetch(nameSuggestions(0, []));
    const { input } = renderCombobox();

    type(input, 'xyz');
    await advance(300);

    expect(screen.getByText('Nenhum registro com “xyz”.')).toBeTruthy();
    expect(screen.queryAllByRole('option')).toHaveLength(0);
  });

  it('picks with the keyboard without submitting the form', async () => {
    mockFetch(nameSuggestions(2, ['Killua Zoldyck', 'Illumi Zoldyck']));
    const { input } = renderCombobox();
    type(input, 'zo');
    await advance(300);

    press(input, 'ArrowDown');
    const [, second] = screen.getAllByRole('option');
    expect(second.getAttribute('aria-selected')).toBe('true');
    expect(input.getAttribute('aria-activedescendant')).toBe(second.id);

    const submits = press(input, 'Enter');
    await advance(0);

    expect(submits).toBe(false);
    expect(input.value).toBe('Illumi Zoldyck');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('closes with Escape and keeps the typed name', async () => {
    mockFetch(nameSuggestions(1, ['Gon Freecss']));
    const { input } = renderCombobox();
    type(input, 'gon');
    await advance(300);

    press(input, 'Escape');

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(input.value).toBe('gon');
  });

  it('picks with a click', async () => {
    mockFetch(nameSuggestions(1, ['Gon Freecss']));
    const { input } = renderCombobox();
    type(input, 'gon');
    await advance(300);

    fireEvent.click(screen.getByRole('option', { name: 'Gon Freecss' }));
    await advance(0);

    expect(input.value).toBe('Gon Freecss');
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('keeps the previous suggestions while the next ones load', async () => {
    const { requests } = mockFetchQueue();
    const { input } = renderCombobox();
    type(input, 'zo');
    await advance(300);
    requests[0].respond(
      nameSuggestions(2, ['Killua Zoldyck', 'Illumi Zoldyck']),
    );
    await advance(0);

    type(input, 'zol');
    await advance(300);
    expect(requests).toHaveLength(2);
    expect(optionNames()).toEqual(['Killua Zoldyck', 'Illumi Zoldyck']);

    requests[1].respond(nameSuggestions(1, ['Illumi Zoldyck']));
    await advance(0);
    expect(optionNames()).toEqual(['Illumi Zoldyck']);
  });

  it("doesn't pick from an earlier term's suggestions while the next ones load", async () => {
    const { requests } = mockFetchQueue();
    const { input } = renderCombobox();
    type(input, 'Killua');
    await advance(300);
    requests[0].respond(nameSuggestions(1, ['Killua Zoldyck']));
    await advance(0);

    type(input, 'G');

    expect(optionNames()).toEqual(['Killua Zoldyck']);
    expect(input.getAttribute('aria-activedescendant')).toBeNull();
    const submits = press(input, 'Enter');
    expect(submits).toBe(true);
    expect(input.value).toBe('G');
  });

  it('ignores an answer that arrives after a newer term', async () => {
    const { requests } = mockFetchQueue();
    const { input } = renderCombobox();
    type(input, 'zo');
    await advance(300);
    type(input, 'zol');
    await advance(300);

    requests[1].respond(nameSuggestions(1, ['Illumi Zoldyck']));
    requests[0].respond(
      nameSuggestions(2, ['Killua Zoldyck', 'Illumi Zoldyck']),
    );
    await advance(0);

    expect(requests[0].signal?.aborted).toBe(true);
    expect(optionNames()).toEqual(['Illumi Zoldyck']);
  });

  it('shows no list when the request fails', async () => {
    mockFetch(new Response(null, { status: 502 }));
    const { input } = renderCombobox();

    type(input, 'gon');
    await advance(300);

    expect(screen.queryByRole('listbox')).toBeNull();
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('closes the list as soon as the name is erased', async () => {
    mockFetch(nameSuggestions(1, ['Gon Freecss']));
    const { input } = renderCombobox();
    type(input, 'gon');
    await advance(300);

    type(input, '');

    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('clears the name with its own button and keeps the focus', async () => {
    mockFetch(nameSuggestions(0, []));
    const { input } = renderCombobox();
    type(input, 'gon');

    fireEvent.click(screen.getByRole('button', { name: 'Limpar nome' }));
    await advance(0);

    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });
});
