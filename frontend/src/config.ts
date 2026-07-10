/**
 * Справочники фильтров. Соответствуют сиду бэкенда (см. backend/src/seed/stations.ts).
 * В реальной интеграции можно получать через отдельный эндпоинт /api/meta.
 */

export interface StationOption {
  id: string;
  label: string;
}

export const STATION_OPTIONS: StationOption[] = [
  { id: '6b2d7e60-caff-4b22-89f6-6f19d7d311ab', label: 'Лето.Падел Академия' },
  { id: '42c6d4df-833d-480a-bdc8-986716569884', label: 'Лето.Падел Дружба' },
  { id: '588b6151-f4f5-47d9-9449-80edf8cbc748', label: 'Лето.Падел Спорт' },
  { id: '0d5504f6-ea6f-44bb-a9e4-947faf0273ab', label: 'Лето.Падел РА' },
  { id: '6a7a9edc-6869-40ad-a5a1-8a1cdfb746a1', label: 'Лето.Падел Нагатинская' },
  { id: '3656cbaa-6426-490f-a44f-915404cbdd2b', label: 'Лето.Падел Полежаевская' },
];

export const TYPE_OPTIONS: string[] = ['Открытая игра', 'Групповая тренировка'];

export const LEVEL_OPTIONS: string[] = ['Начальный', 'Средний', 'Продвинутый', 'Любой'];
