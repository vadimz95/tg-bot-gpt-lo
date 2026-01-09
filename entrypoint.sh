#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."

until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  sleep 2
done

echo "✅ PostgreSQL is ready"

echo "⏳ Running SQL migrations..."
psql "$DATABASE_URL" -f /app/migrations/001_init.sql
echo "✅ Migrations applied"

echo "🚀 Starting bot..."
node dist/bot.js
