#!/bin/sh
set -e

echo "🚀 Starting Sherlocker API..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h postgres -p 5432 -U ${POSTGRES_USER:-postgres}; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run Prisma migrations
echo "🔄 Running database migrations..."
pnpm prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
pnpm prisma generate

# Check if database needs seeding
echo "🌱 Checking if database needs seeding..."

# Try to query the database to check if it has data
# This checks if any table has records (adjust based on your schema)
RECORD_COUNT=$(psql ${DATABASE_URL} -t -c "SELECT COUNT(*) FROM auth;" 2>/dev/null || echo "0")

if [ "$RECORD_COUNT" -eq "0" ]; then
  echo "📦 Database is empty. Running seeds..."
  pnpm prisma:seed || echo "⚠️  Seed script not found or failed. Skipping..."
else
  echo "✅ Database already has data. Skipping seeds."
fi

# Start the application
echo "🎯 Starting application..."
exec npm run start
