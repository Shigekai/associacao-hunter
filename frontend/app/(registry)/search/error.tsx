'use client';

import { Button } from '@/components/Button';

type SearchErrorProps = {
  error: unknown;
  retry: () => void;
};

export default function SearchError({ retry }: SearchErrorProps) {
  return (
    <main className="page-container flex justify-center pt-16">
      <div
        role="alert"
        className="flex flex-col items-center gap-4 text-center"
      >
        <p className="font-mono text-label font-medium tracking-caps-xl text-ink-muted uppercase">
          Não foi possível carregar os filtros.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="px-4"
          onClick={() => retry()}
        >
          Tentar novamente
        </Button>
      </div>
    </main>
  );
}
