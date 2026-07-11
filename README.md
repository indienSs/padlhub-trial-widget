# Виджет расписания пробных тренировок — ПадлхАБ

Расписание **первых пробных тренировок** в формате [турнирного расписания](https://padlhub.ru/tournaments) (карточка как «социальный пост»): аватар тренера, бейдж типа, дата-плитка, мета-строки, индикатор участников и кнопка **«Записаться»**. Источник тренировок — [group_and_game](https://padlhub.ru/group_and_game).

> По условию задачи **оплата и запись не реализованы**. Кнопка «Записаться» — заглушка: показывает тост «Демо-режим».

## Стек

React 19, TypeScript, Vite 6 · NestJS 10, Mongoose 8 · MongoDB 7 · Docker

## Запуск (весь стек в Docker)

```bash
docker compose up --build -d
```

| Сервис   | URL                    |
| -------- | ---------------------- |
| Frontend | http://localhost:8080  |
| Backend  | http://localhost:3001  |
| MongoDB  | localhost:27017        |

БД наполняется тестовыми данными автоматически при первом старте. Остановить: `docker compose down` (с базой: `down -v`).

Порты можно переопределить через корневой `.env` (см. `.env.example`).

## Локальная разработка

Нужна локальная MongoDB (её URI задаётся в `backend/.env`).

```bash
cd backend && npm install && npm run seed && npm run start:dev   # :3001
cd frontend && npm install && npm run dev                         # :5173
```

## API

| Метод | Путь              | Описание                       |
| ----- | ----------------- | ------------------------------ |
| GET   | `/api/trials`     | Список тренировок (с фильтрами)|
| GET   | `/api/trials/:id` | Детали тренировки              |

Параметры `/api/trials`: `date` (`YYYY-MM-DD`, по умолчанию 14 дней), `stationId`, `type`, `level`.

## Standalone-виджет

```bash
cd frontend && npm run build:widget   # → dist/trial-schedule.js (с инлайн-CSS)
```

Встраивание:

```html
<div id="trial-schedule-root"></div>
<script src="/trial-schedule.js"></script>
<script>
  window.PadlhubTrialScheduleWidget.mount({ targetId: 'trial-schedule-root', apiBaseUrl: 'https://api.host' });
</script>
```

## Скрипты

**Backend** (`cd backend`): `start:dev` · `seed` · `seed:prod` · `build`
**Frontend** (`cd frontend`): `dev` · `build` · `build:widget` · `preview`

## Переменные

`backend/.env` — `MONGO_URI`, `PORT` (3001), `CORS_ORIGIN`.
В Docker: backend ждёт Mongo (`depends_on` + healthcheck), сидит при `SEED_ON_START=true`, nginx проксирует `/api/` → `backend:3001`.
