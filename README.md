# Виджет расписания «Первых пробных тренировок» — ПадлхАБ

Виджет расписания **первых пробных тренировок** в формате **турнирного расписания**
(по образцу [padlhub.ru/tournaments](https://padlhub.ru/tournaments)) для тренировок,
ранее доступных в виджете [padlhub.ru/group_and_game](https://padlhub.ru/group_and_game).

Карточка тренировки оформлена как «социальный пост»: аватар тренера, бейдж типа,
дата-плитка, мета-строки (время / станция · корт / уровень / направление), индикатор
участников, цена и кнопка **«Записаться»**. Реализована лента дней, фильтры и модалка
деталей.

> ⚠️ По условию задачи **процедуры оплаты и записи не реализуются**. Кнопка
> «Записаться» — это заглушка (no-op): при клике показывается тост
> «Демо-режим: запись недоступна».

## Стек

| Слой       | Технологии                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | React 19, TypeScript, Vite 6, CSS Modules      |
| Backend    | NestJS 10, Mongoose 8 (`@nestjs/mongoose`)     |
| База данных| MongoDB 7 (в Docker)                           |
| Контейнер  | docker-compose (только MongoDB)                |

## Структура монорепозитория

```
padlhub-trial-widget/
├─ backend/        # NestJS + MongoDB (API + сидер)
├─ frontend/       # React 19 + Vite (виджет)
├─ docker-compose.yml
└─ README.md
```

## Быстрый старт

### 1. Запуск MongoDB (Docker)

```bash
docker compose up -d
```

Поднимает `mongo:7` на `localhost:27017` с постоянным volume `mongo-data`.

> **Docker не установлен?** См. раздел [«Без Docker»](#без-docker-альтернативы) ниже.

### 2. Backend (API + сидер)

```bash
cd backend
npm install
cp .env.example .env   # при необходимости отредактируйте
npm run seed           # заполнить БД тестовыми тренировками (14 дней от сегодня)
npm run start:dev      # http://localhost:3001
```

Проверка:

```bash
curl "http://localhost:3001/api/trials"
```

### 3. Frontend (виджет)

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

Vite проксирует запросы `/api/*` → `http://localhost:3001`.

## API

| Метод | Путь                              | Описание                                   |
| ----- | --------------------------------- | ------------------------------------------ |
| GET   | `/api/trials`                     | Список тренировок (с фильтрами)            |
| GET   | `/api/trials/:id`                 | Карточка деталей тренировки                |

### Параметры `/api/trials`

| Параметр    | Тип    | Описание                                                |
| ----------- | ------ | ------------------------------------------------------- |
| `date`      | string | Дата `YYYY-MM-DD`. Без параметра — ближайшие 14 дней.   |
| `stationId` | string | UUID станции (см. `backend/src/seed/stations.ts`).      |
| `type`      | string | `Открытая игра` \| `Групповая тренировка`               |
| `level`     | string | `Начальный` \| `Средний` \| `Продвинутый` \| `Любой`    |

## Сборка встраиваемого виджета

Standalone-бандл — **один самодостаточный JS-файл** с инлайн-CSS:

```bash
cd frontend
npm run build:widget
# → frontend/dist/trial-schedule.js
```

Встраивание (аналог `LKWidgetTournamentSignup`):

```html
<div id="trial-schedule-root"></div>
<script src="/path/to/trial-schedule.js"></script>
<script>
  // apiBaseUrl обязателен, если бэкенд на другом хосте
  window.PadlhubTrialScheduleWidget.mount({
    targetId: 'trial-schedule-root',
    apiBaseUrl: 'https://api.padlhub.ru', // необязательно
  });
</script>
```

API: `window.PadlhubTrialScheduleWidget.mount(opts)` /
`window.PadlhubTrialScheduleWidget.unmount(targetId)`.

## Без Docker (альтернативы)

Docker используется только для MongoDB. Если он не установлен, поднимите MongoDB
любыым способом и пропишите URI в `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/padlhub_trials
```

Варианты:

- **Локальная установка MongoDB Community Server** —
  [mongodb.com/try/downloads](https://www.mongodb.com/try/downloads)
- **MongoDB Atlas** (облако) — вставьте строку подключения Atlas в `MONGO_URI`
- **`mongodb-memory-server`** — для локальных тестов без персистентности:
  ```bash
  cd backend && npm i -D mongodb-memory-server
  ```

## Данные сида

`npm run seed` генерирует реалистичные тестовые тренировки:

- **14 дней от текущей даты** (окно `bookingDays` из исходного виджета)
- 3–5 тренировок в день (в воскресенье меньше)
- 6 станций сети ПадлхАБ (идентификаторы из конфига VivaCRM)
- Случайные тренеры, уровни, типы, направления, занятость мест
- Цена «Бесплатно» (пробная тренировка)

Сидер **идемпотентный**: очищает коллекцию перед вставкой.

## Скрипты

### Backend (`cd backend`)

| Скрипт          | Описание                              |
| --------------- | ------------------------------------- |
| `npm run dev`   | Запуск в watch-режиме                 |
| `npm run seed`  | Наполнить БД тестовыми данными        |
| `npm run build` | Production-сборка                     |

### Frontend (`cd frontend`)

| Скрипт                | Описание                              |
| --------------------- | ------------------------------------- |
| `npm run dev`         | Dev-сервер Vite (http://localhost:5173) |
| `npm run build`       | Сборка SPA-приложения                 |
| `npm run build:widget`| Standalone-бандл виджета              |
| `npm run preview`     | Предпросмотр production-сборки        |

## Что НЕ реализовано (по условию)

- Процедура оплаты
- SMS-авторизация / вход
- Реальная запись в VivaCRM
- Отмена записи / возврат средств

Кнопка «Записаться» во всех интерфейсах — заглушка с тостом-уведомлением.

## Переменные окружения (`backend/.env`)

| Переменная     | По умолчанию                              | Описание                |
| -------------- | ----------------------------------------- | ----------------------- |
| `MONGO_URI`    | `mongodb://localhost:27017/padlhub_trials`| Строка подключения Mongo|
| `PORT`         | `3001`                                    | Порт API                |
| `CORS_ORIGIN`  | `http://localhost:5173`                   | Разрешённый CORS-origin |
