import { redirect } from 'next/navigation';
import { isApiReady } from '@/lib/api';

// Keeps the opening screen up even when the API answers at once.
const minimumLoadingMs = 4_000;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function HealthGate() {
  const [ready] = await Promise.all([isApiReady(), wait(minimumLoadingMs)]);
  if (ready) {
    redirect('/search');
  }

  return (
    <div role="alert" className="flex flex-col items-center gap-4">
      <p className="font-mono text-label font-medium tracking-caps-xl text-ink-muted uppercase">
        O servidor não respondeu.
      </p>
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- a full reload shows the loading bar again; a <Link> would keep this message on screen while retrying */}
      <a
        href="/"
        className="flex h-12 items-center rounded-md border-[1.5px] border-ink bg-white px-4 font-mono text-label font-semibold tracking-caps text-ink uppercase hover:bg-ink hover:text-white"
      >
        Tentar novamente
      </a>
    </div>
  );
}
