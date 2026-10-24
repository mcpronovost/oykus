FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN if [ -f "package-lock.json" ]; then npm ci; else npm install; fi

FROM node:24-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN --mount=type=secret,id=dotenv,target=/app/.env npm run build
