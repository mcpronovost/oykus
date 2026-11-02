#!/bin/sh
set -e

if [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  if [ -f package-lock.json ]; then
    npm ci
  else
    npm install
  fi
fi

npx prisma generate
npx prisma migrate deploy
exec node --watch src/index.js
