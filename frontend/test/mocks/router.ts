import { useRouter } from 'next/navigation';
import { vi } from 'vitest';

export function mockRouter() {
  const push = vi.fn();
  vi.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<
    typeof useRouter
  >);
  return push;
}
