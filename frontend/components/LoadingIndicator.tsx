import styles from './LoadingIndicator.module.css';

export function LoadingIndicator() {
  return (
    <div role="status" className="flex flex-col items-center gap-3.5">
      <div className="h-0.5 w-38 overflow-hidden bg-line-subtle desktop:w-46">
        <div className={`h-full w-2/5 bg-ink ${styles.bar}`} />
      </div>
      <p className="flex gap-px font-mono text-label font-medium tracking-caps-xl text-ink-muted uppercase">
        Carregando
        <span aria-hidden="true" className={styles.dot}>
          .
        </span>
        <span aria-hidden="true" className={styles.dot}>
          .
        </span>
        <span aria-hidden="true" className={styles.dot}>
          .
        </span>
      </p>
    </div>
  );
}
