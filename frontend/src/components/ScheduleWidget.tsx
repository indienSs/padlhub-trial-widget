import { useCallback, useEffect, useMemo, useState } from 'react';
import type { TrialCard as TrialCardData, TrialFilters } from '../types';
import { fetchTrialById, fetchTrials } from '../api/trials';
import { addDaysISO, todayISO } from '../lib/date';
import { DayStrip, type DayItem } from './DayStrip';
import { FilterBar } from './FilterBar';
import { TrialList } from './TrialList';
import { TrialDetailsModal } from './TrialDetailsModal';
import { Toast, type ToastData } from './Toast';
import { ErrorState } from './ErrorState';
import { Spinner } from './Spinner';
import styles from './ScheduleWidget.module.css';

const BOOKING_DAYS = 14;

export function ScheduleWidget() {
  const [allTrials, setAllTrials] = useState<TrialCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedDate, setSelectedDate] = useState<string>(() => todayISO());
  const [filters, setFilters] = useState<TrialFilters>({});

  const [openTrialId, setOpenTrialId] = useState<string | null>(null);
  const [openTrialFallback, setOpenTrialFallback] =
    useState<TrialCardData | null>(null);
  const [toast, setToast] = useState<ToastData | null>(null);

  // Загрузка списка тренировок (с фильтрами станции/типа/уровня, без даты).
  const loadTrials = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTrials(filters);
      setAllTrials(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Не удалось загрузить тренировки');
      setAllTrials([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadTrials();
  }, [loadTrials]);

  // Список дней с количеством тренировок.
  const days: DayItem[] = useMemo(() => {
    const today = todayISO();
    return Array.from({ length: BOOKING_DAYS }, (_, i) => {
      const iso = i === 0 ? today : addDaysISO(today, i);
      const count = allTrials.filter((t) => t.date === iso).length;
      return { iso, count };
    });
  }, [allTrials]);

  // Если выбранный день пуст — оставляем выбор, но показываем пустое состояние.
  useEffect(() => {
    // При смене фильтров если в выбранном дне ничего нет, прокрутим ленту к первому непустому дню.
    if (loading) return;
    const hasOnSelected = allTrials.some((t) => t.date === selectedDate);
    if (!hasOnSelected) {
      const firstNonEmpty = days.find((d) => d.count > 0);
      if (firstNonEmpty) setSelectedDate(firstNonEmpty.iso);
    }
  }, [allTrials, selectedDate, days, loading]);

  const trialsForSelectedDay = useMemo(
    () => allTrials.filter((t) => t.date === selectedDate),
    [allTrials, selectedDate],
  );

  const hasFilters = Boolean(filters.stationId || filters.type || filters.level);

  const openDetails = useCallback((trial: TrialCardData) => {
    setOpenTrialId(trial.id);
    setOpenTrialFallback(trial);
  }, []);

  const handleAction = useCallback(
    (trial: TrialCardData) => {
      // no-op по условию: запись/оплата не реализуются.
      setToast({
        id: Date.now(),
        message: `Демо-режим: запись на «${trial.title}» недоступна.`,
      });
    },
    [],
  );

  const updateFilter = useCallback((next: Partial<TrialFilters>) => {
    setFilters((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => setFilters({}), []);

  return (
    <div className={`ph-widget ${styles.widget}`}>
      <header className={styles.head}>
        <div>
          <h1 className={styles.title}>Расписание пробных тренировок</h1>
          <p className={styles.subtitle}>Первые пробные тренировки · ПадлхАБ</p>
        </div>
        <button
          type="button"
          className={styles.refresh}
          onClick={() => void loadTrials()}
          aria-label="Обновить расписание"
          title="Обновить"
        >
          ↻
        </button>
      </header>

      <FilterBar filters={filters} onChange={updateFilter} onReset={resetFilters} />

      <DayStrip days={days} selected={selectedDate} onSelect={setSelectedDate} />

      <div className={styles.content}>
        {loading ? (
          <Spinner label="Загружаем расписание…" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => void loadTrials()} />
        ) : (
          <TrialList
            trials={trialsForSelectedDay}
            selectedDate={selectedDate}
            hasFilters={hasFilters}
            onOpen={openDetails}
            onAction={handleAction}
          />
        )}
      </div>

      <TrialDetailsModal
        open={openTrialId !== null}
        trialId={openTrialId}
        fallback={openTrialFallback}
        loader={fetchTrialById}
        onClose={() => {
          setOpenTrialId(null);
          setOpenTrialFallback(null);
        }}
        onAction={handleAction}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
