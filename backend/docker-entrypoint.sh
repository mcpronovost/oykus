#!/bin/sh
set -e
npx prisma migrate deploy
exec node --max-old-space-size=512 src/index.js
