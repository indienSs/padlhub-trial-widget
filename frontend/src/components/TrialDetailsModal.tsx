import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { TrialCard as TrialCardData } from '../types';
import { dayMonthLong, weekdayLong } from '../lib/date';
import { Avatar } from './Avatar';
import { Participants } from './Participants';
import { ActionButton } from './ActionButton';
import { Spinner } from './Spinner';
import { ErrorState } from './ErrorState';
import {
  BallIcon,
  CheckIcon,
  ClockIcon,
  CloseIcon,
  InfoIcon,
  LevelIcon,
  StationIcon,
} from './icons/Icons';
import styles from './TrialDetailsModal.module.css';

interface TrialDetailsModalProps {
  open: boolean;
  trialId: string | null;
  fallback?: TrialCardData | null;
  loader: (id: string) => Promise<TrialCardData>;
  onClose: () => void;
  onAction: (trial: TrialCardData) => void;
}

export function TrialDetailsModal({
  open,
  trialId,
  fallback,
  loader,
  onClose,
  onAction,
}: TrialDetailsModalProps) {
  const [trial, setTrial] = useState<TrialCardData | null>(fallback ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !trialId) return;
    let cancelled = false;

    // Если есть данные из списка — показываем сразу, потом догружаем свежие.
    setTrial(fallback ?? null);
    setError(null);
    setLoading(true);

    loader(trialId)
      .then((data) => {
        if (!cancelled) setTrial(data);
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          if (fallback) {
            // На случай если детали не пришли — оставляем данные из списка.
            setTrial(fallback);
          } else {
            setError(e instanceof Error ? e.message : 'Не удалось открыть тренировку');
          }
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, trialId, fallback, loader]);

  // Закрытие по Esc + блокировка прокрутки фона.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  const timeLabel =
    trial?.startTime || trial?.endTime
      ? [trial.startTime, trial.endTime].filter(Boolean).join('–')
      : 'время уточняется';

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={trial?.title || 'Детали тренировки'}
    >
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Закрыть"
        >
          <CloseIcon width={20} height={20} />
        </button>

        {loading && !trial && <Spinner label="Загрузка…" />}
        {error && !trial && <ErrorState message={error} onRetry={() => loader(trialId!)} />}

        {trial && (
          <div className={styles.content}>
            {/* Шапка */}
            <div className={styles.header}>
              <div className={styles.typeBadge}>
                <BallIcon width={14} height={14} />
                {trial.type}
              </div>
              <h2 className={styles.title}>{trial.title}</h2>
              <div className={styles.dateLine}>
                {weekdayLong(trial.date)}, {dayMonthLong(trial.date)}
                <span className={styles.dot}>·</span>
                <span className={styles.time}>{timeLabel}</span>
              </div>
            </div>

            {/* Тренер */}
            <div className={styles.trainer}>
              <Avatar name={trial.trainerName} url={trial.trainerAvatarUrl} size={48} />
              <div className={styles.trainerText}>
                <span className={styles.trainerName}>{trial.trainerName}</span>
                <span className={styles.trainerHandle}>
                  Тренер · {trial.profileHandle || trial.stationLabel}
                </span>
              </div>
            </div>

            {/* Факты */}
            <div className={styles.facts}>
              <Fact icon={<StationIcon width={18} height={18} />} label="Станция">
                {[trial.stationLabel, trial.court].filter(Boolean).join(' · ') ||
                  'Станция уточняется'}
              </Fact>
              <Fact icon={<ClockIcon width={18} height={18} />} label="Время">
                {timeLabel}
              </Fact>
              <Fact icon={<LevelIcon width={18} height={18} />} label="Уровень">
                {trial.level}
              </Fact>
              {trial.directions.length > 0 && (
                <Fact icon={<BallIcon width={18} height={18} />} label="Направление">
                  {trial.directions.join(', ')}
                </Fact>
              )}
            </div>

            {/* Описание */}
            {trial.description && (
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>О тренировке</h3>
                <p className={styles.blockText}>{trial.description}</p>
              </div>
            )}

            {/* Что взять с собой */}
            {trial.whatToBring.length > 0 && (
              <div className={styles.block}>
                <h3 className={styles.blockTitle}>Что взять с собой</h3>
                <ul className={styles.bringList}>
                  {trial.whatToBring.map((item) => (
                    <li key={item}>
                      <span className={styles.bringIcon}>
                        <CheckIcon width={14} height={14} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Важное примечание */}
            {trial.importantNote && (
              <div className={styles.note}>
                <span className={styles.noteIcon}>
                  <InfoIcon width={18} height={18} />
                </span>
                <span>{trial.importantNote}</span>
              </div>
            )}

            {/* Места + действие */}
            <div className={styles.footer}>
              <Participants
                participants={trial.participants}
                max={trial.maxParticipants}
                trainerName={trial.trainerName}
                trainerAvatarUrl={trial.trainerAvatarUrl}
              />
              <div className={styles.priceLine}>
                <span className={styles.price}>{trial.priceLabel}</span>
                <ActionButton block onClick={() => onAction(trial)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Fact({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.fact}>
      <span className={styles.factIcon}>{icon}</span>
      <div className={styles.factText}>
        <span className={styles.factLabel}>{label}</span>
        <span className={styles.factValue}>{children}</span>
      </div>
    </div>
  );
}
