FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.js ./
RUN if [ -f "package-lock.json" ]; then npm ci; else npm install; fi
RUN DATABASE_URL="postgresql://oykus:oykus@localhost:5432/oykus" npx prisma generate

FROM node:24-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["sh", "docker-entrypoint.dev.sh"]

FROM node:24-alpine AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN if [ -f "package-lock.json" ]; then npm ci --omit=dev; else npm install --omit=dev; fi

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json prisma.config.js docker-entrypoint.sh ./
COPY prisma ./prisma
COPY --from=deps /app/prisma/db ./prisma/db
COPY src ./src
RUN mkdir -p /app/uploads && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["sh", "docker-entrypoint.sh"]
