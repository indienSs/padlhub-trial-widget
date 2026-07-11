#!/bin/sh
set -e

# Ждём готовности MongoDB (mongoose тоже ретраит, но это ускоряет осмысленный старт).
echo "[entrypoint] ожидание MongoDB по $MONGO_HOST:$MONGO_PORT ..."
until nc -z "$MONGO_HOST" "$MONGO_PORT" 2>/dev/null; do
  echo "[entrypoint] MongoDB пока недоступен — повтор через 2с"
  sleep 2
done
echo "[entrypoint] MongoDB доступен"

# Опциональный сид при старте (идемпотентный: очищает коллекцию и вставляет заново).
if [ "$SEED_ON_START" = "true" ]; then
  echo "[entrypoint] SEED_ON_START=true — наполняем БД тестовыми данными"
  node dist/seed.js
fi

echo "[entrypoint] запуск сервера"
exec node dist/main.js
