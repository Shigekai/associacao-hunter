import { Suspense } from 'react';
import { Emblem } from '@/components/Emblem';
import { HealthGate } from '@/components/HealthGate';
import { LoadingIndicator } from '@/components/LoadingIndicator';

export default function Home() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center gap-9 bg-white desktop:gap-11">
      <Emblem className="h-auto w-42 desktop:w-54" />
      <Suspense fallback={<LoadingIndicator />}>
        <HealthGate />
      </Suspense>
      <p className="absolute inset-x-0 bottom-10 text-center font-mono text-caption font-medium tracking-caps-xl text-ink-subtle uppercase desktop:bottom-8">
        Associação Hunter
      </p>
    </main>
  );
}
