#!/bin/bash
set -e

echo "Starting EasyAssign Server..."

# Generate Prisma Client (always needed)
echo "Generating Prisma Client..."
npx prisma generate

# Push schema to database (only if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
  echo "Pushing database schema..."
  npx prisma db push --skip-generate || echo "Warning: Database push failed, continuing anyway..."
else
  echo "Warning: DATABASE_URL not set, skipping database push"
fi

# Start the server
echo "Starting Node.js server..."
exec node server.js

