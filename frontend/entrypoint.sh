#!/bin/sh

# Install dependencies if node_modules is empty (useful for dev volume mounting)
if [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules)" ]; then
  npm ci
fi

sleep 5

echo "Running seed script..."
npm run seed || echo "Seed script returned an error."

if [ "$NODE_ENV" = "production" ]; then
  echo "Starting in PRODUCTION mode..."
  # Only build if .next doesn't exist or is empty to speed up restarts
  if [ ! -d ".next" ] || [ -z "$(ls -A .next)" ]; then
    npm run build
  fi
  exec npm start
else
  echo "Starting in DEVELOPMENT mode..."
  exec npm run dev
fi
