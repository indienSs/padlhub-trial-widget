export const MONTHS_SHORT = [
  'ЯНВ', 'ФЕВ', 'МАРТ', 'АПР', 'МАЙ', 'ИЮН',
  'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК',
];

export const MONTHS_LONG = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
];

export const WEEKDAYS_SHORT = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
export const WEEKDAYS_LONG = [
  'воскресенье', 'понедельник', 'вторник', 'среда',
  'четверг', 'пятница', 'суббота',
];

function parseDate(iso: string): Date {
  // Принимаем YYYY-MM-DD; добавляем время, чтобы избежать сдвига таймзоны.
  return new Date(`${iso}T00:00:00`);
}

export function todayISO(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return toISO(d);
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDaysISO(iso: string, days: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + days);
  return toISO(d);
}

/** «01» */
export function dayNumber(iso: string): string {
  return String(parseDate(iso).getDate()).padStart(2, '0');
}

/** «ИЮН» */
export function monthShort(iso: string): string {
  return MONTHS_SHORT[parseDate(iso).getMonth()];
}

/** «СР» */
export function weekdayShort(iso: string): string {
  return WEEKDAYS_SHORT[parseDate(iso).getDay()];
}

/** «среда» */
export function weekdayLong(iso: string): string {
  return WEEKDAYS_LONG[parseDate(iso).getDay()];
}

/** «10 июня» */
export function dayMonthLong(iso: string): string {
  const d = parseDate(iso);
  return `${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}
