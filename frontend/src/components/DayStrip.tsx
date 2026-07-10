import { useEffect, useRef } from 'react';
import { dayNumber, monthShort, weekdayShort } from '../lib/date';
import styles from './DayStrip.module.css';

export interface DayItem {
  iso: string;
  count: number;
}

interface DayStripProps {
  days: DayItem[];
  selected: string;
  onSelect: (iso: string) => void;
}

export function DayStrip({ days, selected, onSelect }: DayStripProps) {
  const railRef = useRef<HTMLDivElement>(null);

  // Прокрутка к выбранному дню.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const idx = days.findIndex((d) => d.iso === selected);
    if (idx < 0) return;
    const el = rail.children[idx] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [selected, days]);

  if (days.length === 0) return null;

  return (
    <div className={styles.wrap} role="tablist" aria-label="Выбор даты">
      <div className={styles.rail} ref={railRef}>
        {days.map((day) => {
          const active = day.iso === selected;
          return (
            <button
              key={day.iso}
              type="button"
              role="tab"
              aria-selected={active}
              className={styles.tile}
              data-active={active ? '' : undefined}
              data-empty={day.count === 0 ? '' : undefined}
              onClick={() => onSelect(day.iso)}
            >
              <span className={styles.weekday}>{weekdayShort(day.iso)}</span>
              <span className={styles.day}>{dayNumber(day.iso)}</span>
              <span className={styles.month}>{monthShort(day.iso)}</span>
              <span className={styles.badge}>{day.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
