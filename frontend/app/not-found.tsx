import { Search } from 'lucide-react';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/Button';
import { Emblem } from '@/components/Emblem';
import { ResultsHeading } from '@/components/results/ResultsHeading';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  title: 'Não encontrado',
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="page-container flex flex-1 flex-col gap-5 pt-2 pb-8 desktop:gap-7 desktop:pb-12">
        <ResultsHeading />
        <section
          aria-labelledby="not-found-title"
          className="flex flex-1 flex-col items-center justify-center gap-5.5 pb-10 text-center desktop:gap-6 desktop:pb-6"
        >
          <Emblem aria-hidden="true" className="h-auto w-36 desktop:w-42" />
          <div className="flex flex-col items-center gap-2.5 px-2 desktop:max-w-110 desktop:px-0">
            <h2
              id="not-found-title"
              className="text-name leading-[1.15] font-extrabold font-stretch-112% desktop:text-2xl desktop:leading-[1.15]"
            >
              Nenhum registro encontrado
            </h2>
            <p className="text-body text-pretty text-ink-muted">
              Nenhum personagem corresponde a esta busca. Confira o nome
              digitado ou amplie os filtros.
            </p>
          </div>
          <ButtonLink
            href="/search"
            variant="primary"
            className="self-stretch desktop:self-auto desktop:px-6"
          >
            Editar busca
            <Search size={18} strokeWidth={2.25} />
          </ButtonLink>
        </section>
      </main>
    </div>
  );
}
