#!/bin/sh
set -e

if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

echo "⏳ Waiting for PostgreSQL..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" >/dev/null 2>&1; do
  sleep 1
done
echo "✅ PostgreSQL is ready"

export PGHOST="$DB_HOST"
export PGPORT="$DB_PORT"
export PGUSER="$DB_USER"
export PGPASSWORD="$DB_PASSWORD"
export PGDATABASE="$DB_NAME"

# 🔹 Міграції TS напряму через ts-node
echo "⏳ Running migrations..."
npx ts-node ./node_modules/.bin/node-pg-migrate up -m /app/migrations --verbose

echo "✅ Migrations applied"
echo "🚀 Starting bot..."
node dist/bot.js
