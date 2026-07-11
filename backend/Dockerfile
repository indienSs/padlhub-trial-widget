# ---- этап 1: сборка TypeScript ----
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Кэшируем установку зависимостей.
COPY package.json package-lock.json* ./
RUN npm ci

# Копируем исходники и собираем.
COPY tsconfig.json nest-cli.json ./
COPY src ./src

RUN npm run build

# Продукционные зависимости (без devDependencies).
RUN npm prune --omit=dev

# ---- этап 2: production-образ ----
FROM node:20-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production

# netcat для проверки доступности MongoDB в entrypoint.
RUN apt-get update \
 && apt-get install -y --no-install-recommends netcat-openbsd \
 && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package.json ./
COPY docker-entrypoint.sh ./

RUN chmod +x docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["./docker-entrypoint.sh"]
