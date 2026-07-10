import type { TrialFilters } from '../types';
import { LEVEL_OPTIONS, STATION_OPTIONS, TYPE_OPTIONS } from '../config';
import { RefreshIcon } from './icons/Icons';
import styles from './FilterBar.module.css';

interface FilterBarProps {
  filters: TrialFilters;
  onChange: (next: Partial<TrialFilters>) => void;
  onReset: () => void;
}

function NativeSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.selectWrap}>
        <select
          className={styles.select}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        >
          {children}
        </select>
        <span className={styles.chevron} aria-hidden>
          ▾
        </span>
      </div>
    </label>
  );
}

export function FilterBar({ filters, onChange, onReset }: FilterBarProps) {
  const hasFilters = Boolean(filters.stationId || filters.type || filters.level);

  return (
    <div className={styles.bar}>
      <NativeSelect
        label="Станция"
        value={filters.stationId ?? ''}
        onChange={(v) => onChange({ stationId: v || undefined })}
      >
        <option value="">Все станции</option>
        {STATION_OPTIONS.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect
        label="Тип"
        value={filters.type ?? ''}
        onChange={(v) => onChange({ type: v || undefined })}
      >
        <option value="">Все типы</option>
        {TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </NativeSelect>

      <NativeSelect
        label="Уровень"
        value={filters.level ?? ''}
        onChange={(v) => onChange({ level: v || undefined })}
      >
        <option value="">Любой уровень</option>
        {LEVEL_OPTIONS.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </NativeSelect>

      <button
        type="button"
        className={styles.reset}
        onClick={onReset}
        disabled={!hasFilters}
        title="Сбросить фильтры"
      >
        <RefreshIcon width={15} height={15} />
        <span>Сбросить</span>
      </button>
    </div>
  );
}
