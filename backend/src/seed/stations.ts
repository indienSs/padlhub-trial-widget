/** Окно записи (дней вперёд от сегодня), как в исходном виджете group_and_game. */
export const BOOKING_DAYS = 14;

export interface StationSeed {
  id: string;
  label: string;
  /** Город / район для шапки карточки деталей. */
  city: string;
  address: string;
  mapQuery: string;
}

/** Станции сети ПадлхАБ (идентификаторы совпадают с конфигом исходного виджета). */
export const STATIONS: StationSeed[] = [
  {
    id: '6b2d7e60-caff-4b22-89f6-6f19d7d311ab',
    label: 'Лето.Падел Академия',
    city: 'Москва',
    address: 'ул. Академика Скрябина, 12',
    mapQuery: 'Москва, ул. Академика Скрябина, 12',
  },
  {
    id: '42c6d4df-833d-480a-bdc8-986716569884',
    label: 'Лето.Падел Дружба',
    city: 'Москва',
    address: 'Ленинградский пр-т, 39',
    mapQuery: 'Москва, Ленинградский проспект, 39',
  },
  {
    id: '588b6151-f4f5-47d9-9449-80edf8cbc748',
    label: 'Лето.Падел Спорт',
    city: 'Москва',
    address: 'Каширское ш., 55',
    mapQuery: 'Москва, Каширское шоссе, 55',
  },
  {
    id: '0d5504f6-ea6f-44bb-a9e4-947faf0273ab',
    label: 'Лето.Падел РА',
    city: 'Москва',
    address: 'Рязанский пр-т, 24',
    mapQuery: 'Москва, Рязанский проспект, 24',
  },
  {
    id: '6a7a9edc-6869-40ad-a5a1-8a1cdfb746a1',
    label: 'Лето.Падел Нагатинская',
    city: 'Москва',
    address: '1-й Нагатинский пр-д, 2',
    mapQuery: 'Москва, 1-й Нагатинский проезд, 2',
  },
  {
    id: '3656cbaa-6426-490f-a44f-915404cbdd2b',
    label: 'Лето.Падел Полежаевская',
    city: 'Москва',
    address: 'Хорошёвское ш., 38',
    mapQuery: 'Москва, Хорошёвское шоссе, 38',
  },
];

export interface TrainerSeed {
  name: string;
  profileHandle: string;
  avatarUrl?: string;
}

export const TRAINERS: TrainerSeed[] = [
  { name: 'Алексей Морозов', profileHandle: '@alex_padel' },
  { name: 'Мария Соколова', profileHandle: '@maria_padel' },
  { name: 'Дмитрий Орлов', profileHandle: '@dima_padel' },
  { name: 'Елена Волкова', profileHandle: '@lena_padel' },
  { name: 'Игорь Кузнецов', profileHandle: '@igor_padel' },
  { name: 'Анна Новикова', profileHandle: '@anna_padel' },
  { name: 'Сергей Белов', profileHandle: '@sergey_padel' },
  { name: 'Ольга Лебедева', profileHandle: '@olga_padel' },
];

export const LEVELS = ['Начальный', 'Средний', 'Продвинутый', 'Любой'] as const;

export const DIRECTIONS = ['Падел', 'Сквош', 'Большой теннис'] as const;

export const TYPES = ['Открытая игра', 'Групповая тренировка'] as const;

export const WHAT_TO_BRING: string[] = [
  'Удобную спортивную форму',
  'Кроссовки с немаркой подошвой',
  'Бутылку воды',
  'Полотенце',
];

export const IMPORTANT_NOTE =
  'Приезжайте чуть раньше, чтобы успеть переодеться и к указанному времени уже быть на корте.';

export const DESCRIPTIONS: Record<string, string> = {
  'Открытая игра':
    'Первая пробная тренировка в формате открытой игры: познакомимся, разоберём основы и проведём короткий матч. Подходит тем, кто впервые берёт ракетку в руки.',
  'Групповая тренировка':
    'Первая пробная групповая тренировка: разминка, базовая техника ударов и игровые упражнения в маленькой группе под руководством тренера.',
};
