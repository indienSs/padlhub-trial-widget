import type { TrialCard as TrialCardData } from '../types';
import { TrialCard } from './TrialCard';
import { dayMonthLong, weekdayLong } from '../lib/date';
import styles from './TrialList.module.css';

interface TrialListProps {
  trials: TrialCardData[];
  selectedDate: string;
  hasFilters: boolean;
  onOpen: (trial: TrialCardData) => void;
  onAction: (trial: TrialCardData) => void;
}

export function TrialList({
  trials,
  selectedDate,
  hasFilters,
  onOpen,
  onAction,
}: TrialListProps) {
  if (trials.length === 0) {
    const message = hasFilters
      ? 'По выбранным фильтрам тренировок нет'
      : 'На выбранную дату тренировок нет';
    return (
      <div className={styles.empty}>
        <div className={styles.emptyTitle}>{message}</div>
        <div className={styles.emptyHint}>
          Попробуйте выбрать другую дату или изменить фильтры.
        </div>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.dayHeader}>
        <span className={styles.dayTitle}>
          {weekdayLong(selectedDate)}, {dayMonthLong(selectedDate)}
        </span>
        <span className={styles.dayCount}>
          {trials.length}{' '}
          {pluralRu(trials.length, 'тренировка', 'тренировки', 'тренировок')}
        </span>
      </div>
      <div className={styles.list}>
        {trials.map((t) => (
          <TrialCard key={t.id} trial={t} onOpen={onOpen} onAction={onAction} />
        ))}
      </div>
    </section>
  );
}

function pluralRu(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
