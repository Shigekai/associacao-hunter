import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { SearchFormLoader } from '@/components/search/SearchFormLoader';
import { SearchLicense } from '@/components/search/SearchLicense';

export const metadata: Metadata = {
  title: 'Busca',
};

export default function SearchPage() {
  return (
    <main className="page-container flex justify-center pt-4 pb-6">
      <div className="flex w-full flex-col gap-3.5 desktop:max-w-form desktop:gap-4">
        <h1 className="text-title-sm font-black font-stretch-125% desktop:text-title">
          Pesquisar...
        </h1>
        <SearchLicense>
          <Suspense
            fallback={
              <div className="flex min-h-105 items-center justify-center desktop:min-h-82">
                <LoadingIndicator />
              </div>
            }
          >
            <SearchFormLoader />
          </Suspense>
        </SearchLicense>
      </div>
    </main>
  );
}
