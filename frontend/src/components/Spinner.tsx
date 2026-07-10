import styles from './Spinner.module.css';

interface SpinnerProps {
  label?: string;
  compact?: boolean;
}

export function Spinner({ label = 'Загрузка…', compact = false }: SpinnerProps) {
  if (compact) {
    return (
      <span className={styles.compact} role="status">
        <span className={styles.ring} />
      </span>
    );
  }
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <span className={styles.ring} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}
