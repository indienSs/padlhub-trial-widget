/** Извлекает инициалы из имени: «Алексей Морозов» → «АМ». */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1][0] ?? '' : '';
  return (first + last).toUpperCase();
}

/** Цвет аватара по имени (детерминированный). */
export function avatarColor(seed: string): string {
  const palette = ['#7744FF', '#F8873D', '#EE8B60', '#2EA36B', '#3B82F6', '#E0457B'];
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return palette[hash % palette.length];
}

export interface FillState {
  ratio: number; // 0..1
  label: string;
  tone: 'empty' | 'few' | 'half' | 'almost' | 'full';
}

/** Текстовое состояние заполнения тренировки. */
export function fillState(participants: number, max: number): FillState {
  const ratio = max > 0 ? participants / max : 0;
  const left = Math.max(0, max - participants);
  let tone: FillState['tone'] = 'half';
  if (participants === 0) tone = 'empty';
  else if (ratio < 0.4) tone = 'few';
  else if (ratio < 0.7) tone = 'half';
  else if (ratio < 1) tone = 'almost';
  else tone = 'full';

  let label: string;
  if (participants === 0) {
    label = 'Стань первым участником';
  } else if (left === 0) {
    label = `Нет свободных мест${max ? ` · ${participants}/${max}` : ''}`;
  } else {
    label = `Осталось ${left} ${plural(left, 'место', 'места', 'мест')}`;
  }

  return { ratio, label, tone };
}

export function plural(n: number, one: string, few: string, many: string): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}
