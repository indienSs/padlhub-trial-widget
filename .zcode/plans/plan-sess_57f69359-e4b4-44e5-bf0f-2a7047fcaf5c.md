# План: Виджет расписания «Первых пробных тренировок» в формате турнирного расписания

## Контекст (из анализа референсов)
- **Целевой формат** (https://padlhub.ru/tournaments) — React-виджет `LKWidgetTournamentSignup`: лента «социальных» карточек-постов, сгруппированных по дням недели, с горизонтальной лентой дней-плиток (ПН/ИЮН/01 …), фильтрами (станция/тип/уровень) и кнопкой действия.
- **Источник «пробных тренировок»** (https://padlhub.ru/group_and_game) — сторонний VivaCRM-виджет. Из его конфига извлечены: 6 станций ПадлхАБ, `bookingDays:14`, цена «Бесплатно», словарь терминов (корт/занятие/станция/тренировка).
- **Модель карточки** восстановлена из бандла турнирного виджета: `id, title, date, startTime, endTime, stationLabel, tournamentTypeLabel, level, genderLabel, trainerName, trainerAvatarUrl, profileHandle, priceLabel, maxParticipants, participants, spotsLeft, waitlistCount` + поля деталей (описание, что взять с собой, регламент).

## Структура монорепозитория
```
padlhub-trial-widget/
├─ backend/        # NestJS + MongoDB
├─ frontend/       # React 19 + TS + Vite (виджет)
├─ docker-compose.yml
├─ .gitignore
└─ README.md
```

---

## Backend (NestJS + MongoDB)

### Стек
NestJS 10, `@nestjs/mongoose` (Mongoose 8), class-validator/transformer, TypeScript.

### Модель `TrialTraining` (`backend/src/trials/schemas/trial-training.schema.ts`)
Поля (1:1 с фронтенд-карточкой):
- `title`, `type` (enum: «Открытая игра» | «Групповая тренировка»), `stationId`/`stationLabel`, `court`
- `date` (ISO yyyy-mm-dd), `startTime`/`endTime` («19:00»)
- `trainerName`/`trainerAvatarUrl?`/`profileHandle?`
- `level` («Начальный/Средний/Продвинутый/Любой»), `genderLabel` («М/Ж»), `priceLabel` («Бесплатно»)
- `directions: string[]`, `description?`, `whatToBring?: string[]`, `importantNote?`
- `maxParticipants`, `participants`, `spotsLeft` (вычисляется), `waitlistCount`
- `createdAt`/`updatedAt`

### 6 станций (сид-константа)
Имена станций сети ПадлхАБ: «Лето.Падел Академия», «Лето.Падел Дружба», «Лето.Падел Спорт», «Лето.Падел РА» + 2 дополнительные.

### Модули
- `TrialsModule` → `TrialsController` (`GET /api/trials`, `GET /api/trials/:id`), `TrialsService`, `TrialTrainingSchema`.
- `SeedModule`/`SeedService` → `npm run seed` через `NestFactory.createApplicationContext`. Генерирует **14 дней от сегодня × ~3-5 тренировок/день ≈ 50-70 документов**, случайные тренеры/уровни/станции, реалистичная занятость мест. Очищает коллекцию перед вставкой (idempotent).

### API
- `GET /api/trials?date=YYYY-MM-DD&stationId=&type=&level=` — список с фильтрами, по умолчанию ближайшие 14 дней, сортировка по дате+времени.
- `GET /api/trials/:id` — карточка деталей.
- CORS для `http://localhost:5173`.

### Запуск
- `docker-compose.yml` (корень) поднимает `mongo:7` на `:27017` + volume.
- `.env`: `MONGO_URI=mongodb://localhost:27017/padlhub_trials`, `PORT=3001`.
- Скрипты: `start:dev`, `seed`, `build`.
- ⚠️ Docker не установлен на машине — бэкенд не подключится к БД до `docker compose up -d` (или локальной/Atlas MongoDB). Это зафиксировано в README.

---

## Frontend (React 19 + TS + Vite)

### Стек
Vite 6, React 19, TypeScript 5, CSS Modules, прокси `/api` → `localhost:3001`.

### Типы и API-слой
`src/types.ts` (`TrialCard`) + `src/api/trials.ts` (`fetchTrials(filters)`, `fetchTrialById(id)`).

### Компоненты (`src/components/`)
1. **`ScheduleWidget`** — корень: состояние дня, фильтров, открытой карточки, загрузки/ошибки.
2. **`DayStrip`** — горизонтальная лента дней-плиток (день недели / месяц / число), активный подсвечен, скролл по переполнению.
3. **`FilterBar`** — 3 дропдауна: Станция / Тип / Уровень («Все станции»…) + «Обновить».
4. **`TrialCard`** — **социальная карточка-пост** (точная имитация турниров): шапка с аватаром тренера (инициалы если нет URL) + имя + handle + «…»; бейдж типа; дата-плитка; заголовок; мета-строки с иконками (время, станция·корт, уровень, М/Ж); снизу индикатор участников (аватары/«+N», «Стань первым участником» при 0), цена, кнопка **«Записаться»**.
5. **`TrialList`** — список карточек дня. Пустые состояния: «На выбранную дату тренировок нет» / «По выбранным фильтрам тренировок нет».
6. **`TrialDetailsModal`** — модалка деталей (клик по карточке): описание, тренер, что взять с собой, регламент, индикатор мест. Кнопка «Записаться» → no-op тост.
7. **`Toast`** — подтверждение no-op.
8. **`Spinner`/`ErrorState`** — лоадеры и ошибка с «Повторить».
9. **Иконки** (`src/components/icons/`) — inline SVG (календарь, локация, участники, часы, мячик, уровень).

### Стили (`*.module.css`)
CSS-переменные брендинга (из конфига Viva): `--accent:#7744FF`, `--accent-2:#F8873D`, `--font:#1F1E20`, фон `#ffffff`, шрифт `Onest`/`Source Code Pro` (Google Fonts). Адаптив: лента дней скроллится на мобиле, карточки в одну колонку.

### Встраиваемый виджет
- `src/main.tsx` — дев-точка входа (рендер в `#root`).
- `src/lib/mount.ts` — `mount({targetId})`/`unmount()` (аналог `window.LKWidgetTournamentSignup`), IIFE-обёртка `widget-entry.ts` для standalone-бандла.
- Vite: 2 билда — `app` (dev) и `lib` (standalone `dist/trial-schedule.js`, inline CSS).

---

## Порядок реализации
1. Скелет монорепо: `.gitignore`, `README.md`, `docker-compose.yml`.
2. Backend: NestJS-инициализация, схема, модули, сидер, CORS, эндпоинты, `npm run seed`.
3. Frontend: Vite+React+TS, типы, API-слой, все компоненты, стили, модалка, тост.
4. Standalone-сборка виджета.
5. README с инструкциями запуска и заметкой про Docker.

## Не входит в объём (по условию)
Оплата, SMS-авторизация, реальная запись в VivaCRM, отмена/возврат. Кнопка «Записаться» — no-op заглушка.

## Проверка результата
- `docker compose up -d` → `cd backend && npm i && npm run seed && npm run start:dev`.
- `cd frontend && npm i && npm run dev` → http://localhost:5173.
- Лента дней + фильтры, карточки в формате турниров, клик → модалка, кнопка → тост.
- `npm run build:widget` → `frontend/dist/trial-schedule.js`.