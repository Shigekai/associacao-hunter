import { vi } from 'vitest';

export function mockDialog() {
  const showModal = vi.fn(function (this: HTMLDialogElement) {
    if (this.hasAttribute('open')) {
      throw new DOMException('Dialog is already open', 'InvalidStateError');
    }
    this.setAttribute('open', '');
  });

  const close = vi.fn(function (this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) {
      return;
    }
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  });

  HTMLDialogElement.prototype.showModal = showModal;
  HTMLDialogElement.prototype.close = close;

  return { showModal, close };
}
