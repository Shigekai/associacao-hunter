import clsx from 'clsx';
import { resultsGridClassName } from './resultsGrid';
import styles from './ResultsSkeleton.module.css';

const cardDelays = [
  '[--delay:0s] desktop:[--delay:0.3s]',
  '[--delay:0.15s]',
  '[--delay:0.3s] desktop:[--delay:0s]',
  '[--delay:0.45s] desktop:[--delay:0.75s]',
  '[--delay:0.6s]',
  '[--delay:0.75s] desktop:[--delay:0.45s]',
];

type BoneProps = {
  className: string;
};

function Bone({ className }: BoneProps) {
  return <div className={clsx('skeleton', styles.pulse, className)} />;
}

export function ResultsSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-5 desktop:gap-7">
      <p role="status" className="sr-only">
        Carregando registros…
      </p>
      <div
        aria-hidden="true"
        className="flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between desktop:gap-4"
      >
        <div className="-mr-4 flex gap-2 overflow-hidden desktop:mr-0">
          <Bone className="h-6.25 w-30 shrink-0 rounded-full desktop:h-6.5 desktop:w-32" />
          <Bone className="h-6.25 w-35 shrink-0 rounded-full desktop:h-6.5 desktop:w-38" />
          <Bone className="h-6.25 w-27.5 shrink-0 rounded-full desktop:h-6.5 desktop:w-29.5" />
        </div>
        <Bone className="h-3 w-19 rounded-[3px] desktop:w-21" />
      </div>
      <div aria-hidden="true" className={resultsGridClassName}>
        {cardDelays.map((delay) => (
          <div
            key={delay}
            className={clsx(
              delay,
              'grid h-54 grid-cols-[108px_minmax(0,1fr)] overflow-hidden rounded-xl border border-line bg-white desktop:h-60.75 desktop:grid-cols-[132px_minmax(0,1fr)]',
            )}
          >
            <div
              className={clsx(
                'relative overflow-hidden border-r border-line skeleton',
                styles.pulse,
              )}
            >
              <div
                className={clsx(
                  'absolute inset-x-0 top-0 h-0.5 bg-ink/38 shadow-[0_1px_0_var(--color-white)] shadow-white/60 motion-reduce:hidden',
                  styles.scan,
                )}
              />
            </div>
            <div className="flex flex-col px-3.5 pt-3.5 pb-3 desktop:px-4.5 desktop:py-4">
              <Bone className="h-2.5 w-18 rounded-[3px] desktop:w-19" />
              <Bone className="mt-2.5 h-4.5 w-[82%] rounded-[3px] desktop:mt-3 desktop:h-5 desktop:w-[78%]" />
              <Bone className="mt-2 hidden h-3 w-[48%] rounded-[3px] desktop:block" />
              <div className="mt-3 flex flex-col gap-1 border-t border-line-subtle pt-2.5 desktop:mt-3.5 desktop:flex-row desktop:items-center desktop:gap-3.5 desktop:pt-3">
                <Bone className="h-2.25 w-6.5 rounded-[3px] desktop:w-7" />
                <Bone className="h-3 w-24 rounded-[3px]" />
              </div>
              <div className="mt-2 flex h-11.25 items-center justify-between border-t border-line-subtle desktop:mt-2.5 desktop:h-9.75 desktop:pt-1.5">
                <Bone className="h-2.5 w-20 rounded-[3px] desktop:w-21" />
                <Bone className="size-4 rounded-[3px] desktop:size-3.5" />
              </div>
              <Bone className="mt-auto h-2.5 w-17 rounded-[3px] desktop:w-18" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
