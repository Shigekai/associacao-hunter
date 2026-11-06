import { ChevronLeft } from 'lucide-react';
import { ButtonLink } from '@/components/Button';

export function ResultsHeading() {
  return (
    <div className="flex items-center gap-3 desktop:gap-3.5">
      <ButtonLink
        href="/search"
        variant="secondary"
        size="icon"
        aria-label="Voltar para a busca"
      >
        <ChevronLeft size={20} />
      </ButtonLink>
      <h1 className="text-title-sm font-black font-stretch-125% desktop:text-title">
        Resultados
      </h1>
    </div>
  );
}
