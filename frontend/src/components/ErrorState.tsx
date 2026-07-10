import styles from './ErrorState.module.css';
import { RefreshIcon } from './icons/Icons';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Не удалось загрузить',
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className={styles.wrap} role="alert">
      <div className={styles.title}>{title}</div>
      <div className={styles.message}>{message}</div>
      {onRetry && (
        <button type="button" className={styles.retry} onClick={onRetry}>
          <RefreshIcon width={15} height={15} />
          Повторить
        </button>
      )}
    </div>
  );
}
