import { X } from 'lucide-react';
import { Button } from '@/components/Button';

type SheetCloseButtonProps = {
  className?: string;
};

export function SheetCloseButton({ className }: SheetCloseButtonProps) {
  return (
    <form method="dialog" className={className}>
      <Button
        type="submit"
        variant="inverse"
        size="icon"
        aria-label="Fechar ficha"
      >
        <X size={22} />
      </Button>
    </form>
  );
}
