import { Avatar } from './Avatar';
import { fillState } from '../lib/format';
import styles from './Participants.module.css';

interface ParticipantsProps {
  participants: number;
  max: number;
  trainerName: string;
  trainerAvatarUrl?: string;
}

export function Participants({
  participants,
  max,
  trainerName,
  trainerAvatarUrl,
}: ParticipantsProps) {
  const state = fillState(participants, max);

  // «Кольца» участников: тренер + занятые места (до 4 видимых).
  const visibleCount = Math.min(participants, 3);
  const rings = visibleCount > 0 ? Array.from({ length: visibleCount }) : [];

  return (
    <div className={styles.row} data-tone={state.tone}>
      <div className={styles.rings}>
        {rings.length === 0 ? (
          <Avatar name={trainerName} url={trainerAvatarUrl} size={28} />
        ) : (
          <>
            <Avatar name={trainerName} url={trainerAvatarUrl} size={28} />
            {rings.slice(0, 2).map((_, i) => (
              <span key={i} className={styles.guestRing} style={{ '--i': i + 1 } as React.CSSProperties}>
                {i === rings.length - 1 && participants - rings.length > 0
                  ? `+${participants - rings.length}`
                  : ''}
              </span>
            ))}
            {participants > rings.length && rings.length < 3 && (
              <span
                className={styles.guestRing}
                style={{ '--i': rings.length } as React.CSSProperties}
              >
                +{participants - rings.length}
              </span>
            )}
          </>
        )}
      </div>
      <span className={styles.label}>{state.label}</span>
    </div>
  );
}
