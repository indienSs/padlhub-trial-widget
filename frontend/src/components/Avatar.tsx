import { avatarColor, getInitials } from '../lib/format';
import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
  url?: string;
  size?: number;
}

export function Avatar({ name, url, size = 44 }: AvatarProps) {
  const style = { width: size, height: size } as const;
  if (url) {
    return <img className={styles.avatar} src={url} alt={name} style={style} loading="lazy" />;
  }
  return (
    <span
      className={styles.avatar}
      style={{ ...style, background: avatarColor(name) }}
      aria-hidden
    >
      {getInitials(name)}
    </span>
  );
}
