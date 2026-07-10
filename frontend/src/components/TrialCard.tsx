import type { TrialCard as TrialCardData } from '../types';
import { dayNumber, monthShort, weekdayLong } from '../lib/date';
import { Avatar } from './Avatar';
import { Participants } from './Participants';
import { ActionButton } from './ActionButton';
import { BallIcon, ClockIcon, LevelIcon, StationIcon, TypeIcon } from './icons/Icons';
import styles from './TrialCard.module.css';

interface TrialCardProps {
  trial: TrialCardData;
  onOpen: (trial: TrialCardData) => void;
  onAction: (trial: TrialCardData) => void;
}

export function TrialCard({ trial, onOpen, onAction }: TrialCardProps) {
  const timeLabel =
    trial.startTime || trial.endTime
      ? [trial.startTime, trial.endTime].filter(Boolean).join('–')
      : 'время уточняется';

  const courtLabel = trial.court || '';
  const stationLine = [trial.stationLabel, courtLabel].filter(Boolean).join(' · ');

  return (
    <article
      className={styles.card}
      data-type={trial.type}
      onClick={() => onOpen(trial)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(trial);
        }
      }}
      aria-label={`${trial.title}, ${trial.stationLabel}, ${weekdayLong(trial.date)} ${timeLabel}`}
    >
      {/* Шапка-пост: аватар тренера + имя + handle */}
      <div className={styles.author}>
        <Avatar name={trial.trainerName} url={trial.trainerAvatarUrl} size={44} />
        <div className={styles.authorText}>
          <span className={styles.authorName}>{trial.trainerName}</span>
          <span className={styles.authorHandle}>
            {trial.profileHandle || trial.stationLabel}
          </span>
        </div>
        <span className={styles.menuDots} aria-hidden>
          …
        </span>
      </div>

      <div className={styles.body}>
        {/* Бейдж типа + дата-плитка */}
        <div className={styles.topLine}>
          <span className={styles.typeBadge}>
            <TypeIcon width={14} height={14} />
            {trial.type}
          </span>
          <div className={styles.dateBadge} aria-hidden>
            <span className={styles.dateDay}>{dayNumber(trial.date)}</span>
            <span className={styles.dateMonth}>{monthShort(trial.date)}</span>
          </div>
        </div>

        {/* Заголовок */}
        <h3 className={styles.title}>{trial.title}</h3>

        {/* Мета-строки */}
        <div className={styles.meta}>
          <span className={styles.metaRow}>
            <span className={styles.metaIcon}>
              <ClockIcon />
            </span>
            <span>
              {weekdayLong(trial.date)}, {timeLabel}
            </span>
          </span>

          <span className={styles.metaRow}>
            <span className={styles.metaIcon}>
              <StationIcon />
            </span>
            <span>{stationLine || 'Станция уточняется'}</span>
          </span>

          <span className={styles.metaRow}>
            <span className={styles.metaIcon}>
              <LevelIcon />
            </span>
            <span>{trial.level}</span>
          </span>

          {trial.directions.length > 0 && (
            <span className={styles.metaRow}>
              <span className={styles.metaIcon}>
                <BallIcon />
              </span>
              <span>{trial.directions.join(' · ')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Низ: участники + цена + кнопка */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <Participants
            participants={trial.participants}
            max={trial.maxParticipants}
            trainerName={trial.trainerName}
            trainerAvatarUrl={trial.trainerAvatarUrl}
          />
        </div>
        <div className={styles.footerRight}>
          <span className={styles.price}>{trial.priceLabel}</span>
          <ActionButton onClick={() => onAction(trial)} />
        </div>
      </div>
    </article>
  );
}
