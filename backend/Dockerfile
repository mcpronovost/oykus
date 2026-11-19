FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY prisma ./prisma
COPY prisma.config.js ./
RUN DATABASE_URL="postgresql://oykus:oykus@localhost:5432/oykus" ./node_modules/.bin/prisma generate

FROM deps AS migrate
USER node
CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

FROM deps AS development
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
CMD ["sh", "docker-entrypoint.dev.sh"]

FROM node:24-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
# The Prisma Client declares the CLI as an optional peer.
RUN npm ci --omit=dev --omit=optional

FROM node:24-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY package.json ./
COPY --from=deps /app/prisma/db ./prisma/db
COPY src ./src
RUN mkdir -p /app/uploads && chown node:node /app/uploads
USER node
EXPOSE 3000
CMD ["node", "--max-old-space-size=512", "src/index.js"]
