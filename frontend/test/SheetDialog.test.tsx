import { fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SheetDialog, SheetTitle } from '@/components/sheet/SheetDialog';
import { mockDialog } from './mocks/dialog';
import { mockRouter } from './mocks/router';

vi.mock('next/navigation');

describe('SheetDialog', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/hunters/3?arcId=4');
  });

  it('opens as a modal, focuses the dialog and labels it by SheetTitle', () => {
    const { showModal } = mockDialog();
    mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    const dialog = screen.getByRole('dialog', { name: 'Kurapika' });
    expect(showModal).toHaveBeenCalledOnce();
    expect(document.activeElement).toBe(dialog);
  });

  it('navigates back when closed with close="back"', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    screen.getByRole<HTMLDialogElement>('dialog').close();

    expect(router.back).toHaveBeenCalledOnce();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('replaces the URL with the filtered results list when closed with close="list"', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="list">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    screen.getByRole<HTMLDialogElement>('dialog').close();

    expect(router.replace).toHaveBeenCalledWith('/hunters?arcId=4');
    expect(router.back).not.toHaveBeenCalled();
  });

  it('closes when the veil itself is clicked', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog);
    fireEvent.pointerUp(dialog);
    fireEvent.click(dialog);

    expect(router.back).toHaveBeenCalledOnce();
  });

  it('stays open when the click lands inside the sheet', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    const title = screen.getByRole('heading', { name: 'Kurapika' });
    fireEvent.pointerDown(title);
    fireEvent.pointerUp(title);
    fireEvent.click(title);

    expect(router.back).not.toHaveBeenCalled();
  });

  it('stays open when a press inside the sheet is released on the veil', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(screen.getByRole('heading', { name: 'Kurapika' }));
    fireEvent.pointerUp(dialog);
    fireEvent.click(dialog);

    expect(router.back).not.toHaveBeenCalled();
  });

  it('stays open when a press on the veil is released inside the sheet', () => {
    mockDialog();
    const router = mockRouter();

    render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    const dialog = screen.getByRole('dialog');
    fireEvent.pointerDown(dialog);
    fireEvent.pointerUp(screen.getByRole('heading', { name: 'Kurapika' }));
    fireEvent.click(dialog);

    expect(router.back).not.toHaveBeenCalled();
  });

  it('closes the dialog on unmount without navigating', () => {
    const { close } = mockDialog();
    const router = mockRouter();

    const { unmount } = render(
      <SheetDialog close="back">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>,
    );

    unmount();

    expect(close).toHaveBeenCalledOnce();
    expect(router.back).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('navigates instead of reopening when closed before hydration', () => {
    const { showModal } = mockDialog();
    const router = mockRouter();
    const ui = (
      <SheetDialog close="list">
        <SheetTitle>Kurapika</SheetTitle>
      </SheetDialog>
    );
    const container = document.createElement('div');
    container.innerHTML = renderToString(ui);
    container.querySelector('dialog')?.removeAttribute('open');
    document.body.append(container);

    render(ui, { container, hydrate: true });

    expect(router.replace).toHaveBeenCalledWith('/hunters?arcId=4');
    expect(showModal).not.toHaveBeenCalled();
  });
});
