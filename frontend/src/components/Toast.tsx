import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckIcon } from './icons/Icons';
import styles from './Toast.module.css';

export interface ToastData {
  id: number;
  message: string;
}

interface ToastProps {
  toast: ToastData | null;
  onDismiss: () => void;
  durationMs?: number;
}

export function Toast({ toast, onDismiss, durationMs = 3600 }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onDismiss, durationMs);
    return () => clearTimeout(t);
  }, [toast, durationMs, onDismiss]);

  if (!toast) return null;

  return createPortal(
    <div className={styles.host} role="status" aria-live="polite">
      <div key={toast.id} className={styles.toast}>
        <span className={styles.icon}>
          <CheckIcon width={18} height={18} />
        </span>
        <span className={styles.message}>{toast.message}</span>
      </div>
    </div>,
    document.body,
  );
}
