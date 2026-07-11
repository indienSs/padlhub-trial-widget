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

| Слой        | Технологии                                        |
| ----------- | ------------------------------------------------- |
| Frontend    | React 19, TypeScript, Vite 6, CSS Modules, nginx  |
| Backend     | NestJS 10, Mongoose 8 (`@nestjs/mongoose`)         |
| База данных | MongoDB 7                                          |
| Контейнер   | Docker + docker compose (3 сервиса в одной сети)   |

## Структура монорепозитория

```
padlhub-trial-widget/
├─ backend/              # NestJS + MongoDB (API + сидер)
│  ├─ Dockerfile
│  ├─ docker-entrypoint.sh   # wait-for-mongo + опциональный сид + запуск
│  └─ .dockerignore
├─ frontend/             # React 19 + Vite (виджет)
│  ├─ Dockerfile
│  ├─ nginx.conf          # SPA + прокси /api → backend
│  └─ .dockerignore
├─ docker-compose.yml    # mongo + backend + frontend
├─ .env.example          # переменные портов (опционально)
└─ README.md
```

---

## Быстрый старт (Docker — весь стек одной командой)

Поднимает **MongoDB + backend + frontend** в одной docker-сети:

```bash
docker compose up --build -d
```

После старта:

| Сервис    | URL                                    |
| --------- | -------------------------------------- |
| Frontend  | http://localhost:8080                  |
| Backend   | http://localhost:3001                  |
| MongoDB   | localhost:27017                        |

По умолчанию backend **сам наполняет БД** тестовыми данными при первом старте
(`SEED_ON_START=true`) — сидер идемпотентный, его можно безопасно запускать повторно.

Проверка:

```bash
curl "http://localhost:3001/api/trials" | head -c 300
```

Остановить и удалить:

```bash
docker compose down              # контейнеры (данные MongoDB сохранятся в volume)
docker compose down -v           # вместе с volume базы (полный сброс)
```

Логи:

```bash
docker compose logs -f backend   # логи API
docker compose logs -f frontend  # логи nginx
```

### Переменные окружения (корневой `.env`)

Опционально — создайте `.env` рядом с `docker-compose.yml` (см. `.env.example`),
чтобы переопределить порты на хосте:

```env
FRONTEND_PORT=8080
BACKEND_PORT=3001
MONGO_PORT=27017
```

### Управление сидом

- При старте контейнера backend выполняет сид автоматически (`SEED_ON_START=true`).
- Перезапустить сид вручную:
  ```bash
  docker compose exec backend node dist/seed.js
  ```
- Отключить автосид — задайте `SEED_ON_START=false` для сервиса `backend`.

---

## Локальная разработка (без Docker)

Удобно для разработки с hot-reload. Нужна локальная MongoDB.

### 1. MongoDB

Любым способом (локальная установка, Atlas и т.д.) — главное прописать `MONGO_URI`.

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env            # отредактируйте MONGO_URI при необходимости
npm run seed                    # наполнить БД тестовыми тренировками (14 дней от сегодня)
npm run start:dev               # http://localhost:3001 (hot-reload)
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173 (прокси /api → :3001)
```

---

## API

| Метод | Путь             | Описание                            |
| ----- | ---------------- | ----------------------------------- |
| GET   | `/api/trials`    | Список тренировок (с фильтрами)     |
| GET   | `/api/trials/:id`| Карточка деталей тренировки         |

### Параметры `/api/trials`

| Параметр    | Тип    | Описание                                                |
| ----------- | ------ | ------------------------------------------------------- |
| `date`      | string | Дата `YYYY-MM-DD`. Без параметра — ближайшие 14 дней.   |
| `stationId` | string | UUID станции (см. `backend/src/seed/stations.ts`).      |
| `type`      | string | `Открытая игра` \| `Групповая тренировка`               |
| `level`     | string | `Начальный` \| `Средний` \| `Продвинутый` \| `Любой`    |

---

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
  window.PadlhubTrialScheduleWidget.mount({
    targetId: 'trial-schedule-root',
    apiBaseUrl: 'https://api.padlhub.ru', // необязательно
  });
</script>
```

API: `window.PadlhubTrialScheduleWidget.mount(opts)` /
`window.PadlhubTrialScheduleWidget.unmount(targetId)`.

---

## Архитектура контейнеров

```
                 ┌──────────────────────────────────────────┐
   браузер  ──►  │ frontend (nginx:80)                       │  :8080 → 80
                 │   /         → SPA (Vite static)            │
                 │   /api/     → proxy → backend:3001         │
                 └───────────────────┬──────────────────────┘
                                     │
                 ┌───────────────────▼──────────────────────┐
                 │ backend (node:20, NestJS:3001)            │  :3001 → 3001
                 │   docker-entrypoint.sh:                   │
                 │     wait-for-mongo → seed(optional) → main│
                 └───────────────────┬──────────────────────┘
                                     │
                 ┌───────────────────▼──────────────────────┐
                 │ mongo (mongo:7)                           │  :27017 → 27017
                 │   volume: mongo-data                      │
                 └──────────────────────────────────────────┘
```

- `mongo` имеет healthcheck (`mongosh ping`), backend ждёт его готовности через
  `depends_on: condition: service_healthy` + цикл `nc -z` в entrypoint.
- Все три сервиса в дефолтной сети compose; backend обращается к Mongo как `mongo:27017`,
  nginx проксирует на backend как `backend:3001`.

---

## Данные сида

`npm run seed` / автосид в Docker генерирует реалистичные тестовые тренировки:

- **14 дней от текущей даты** (окно `bookingDays` из исходного виджета)
- 3–5 тренировок в день (в воскресенье меньше)
- 6 станций сети ПадлхАБ (идентификаторы из конфига VivaCRM)
- Случайные тренеры, уровни, типы, направления, занятость мест
- Цена «Бесплатно» (пробная тренировка)

Сидер **идемпотентный**: очищает коллекцию перед вставкой.

---

## Скрипты

### Backend (`cd backend`)

| Скрипт          | Описание                              |
| --------------- | ------------------------------------- |
| `npm run start:dev` | Запуск в watch-режиме             |
| `npm run seed`  | Наполнить БД тестовыми данными (TS)   |
| `npm run seed:prod` | То же из production-сборки (`dist`) |
| `npm run build` | Production-сборка (`dist/`)           |

### Frontend (`cd frontend`)

| Скрипt           | Описание                              |
| ---------------- | ------------------------------------- |
| `npm run dev`    | Dev-сервер Vite (http://localhost:5173) |
| `npm run build`  | Сборка SPA-приложения                 |
| `npm run build:widget` | Standalone-бандл виджета         |
| `npm run preview`| Предпросмотр production-сборки        |

---

## Что НЕ реализовано (по условию)

- Процедура оплаты
- SMS-авторизация / вход
- Реальная запись в VivaCRM
- Отмена записи / возврат средств

Кнопка «Записаться» во всех интерфейсах — заглушка с тостом-уведомлением.

---

## Переменные окружения

### `backend/.env` (для локальной разработки)

| Переменная    | По умолчанию                              | Описание                |
| ------------- | ----------------------------------------- | ----------------------- |
| `MONGO_URI`   | `mongodb://localhost:27017/padlhub_trials`| Строка подключения Mongo|
| `PORT`        | `3001`                                    | Порт API                |
| `CORS_ORIGIN` | `http://localhost:5173`                   | Разрешённый CORS-origin |

### Переменные backend в Docker compose

| Переменная      | Описание                                          |
| --------------- | ------------------------------------------------- |
| `MONGO_URI`     | `mongodb://mongo:27017/padlhub_trials` (внутри сети) |
| `MONGO_HOST` / `MONGO_PORT` | Для wait-цикла в entrypoint (`nc -z`)   |
| `SEED_ON_START` | `true` — выполнить сид при старте контейнера       |

### Корневой `.env` (порты хоста)

| Переменная      | По умолчанию | Описание                |
| --------------- | ------------ | ----------------------- |
| `FRONTEND_PORT` | `8080`       | Порт frontend на хосте  |
| `BACKEND_PORT`  | `3001`       | Порт backend на хосте   |
| `MONGO_PORT`    | `27017`      | Порт MongoDB на хосте   |
