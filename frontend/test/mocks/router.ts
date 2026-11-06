import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

export function mockRouter() {
  const push = vi.fn();
  const back = vi.fn();
  const replace = vi.fn();
  vi.mocked(useRouter).mockReturnValue({
    push,
    back,
    replace,
  } as unknown as ReturnType<typeof useRouter>);
  return Object.assign(push, { back, replace });
}
