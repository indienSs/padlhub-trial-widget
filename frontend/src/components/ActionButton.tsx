import { useId } from 'react';
import styles from './ActionButton.module.css';
import { Spinner } from './Spinner';

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  /** Вариант для модалки (широкая). */
  block?: boolean;
  label?: string;
}

export function ActionButton({
  onClick,
  disabled,
  loading,
  block,
  label = 'Записаться',
}: ActionButtonProps) {
  const id = useId();
  return (
    <button
      id={id}
      type="button"
      className={styles.btn}
      data-block={block ? '' : undefined}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? <Spinner compact /> : label}
    </button>
  );
}
