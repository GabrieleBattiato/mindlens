#!/bin/bash

# MindLens — dev server
# Starts api (FastAPI) + web (Next.js) in parallel

cleanup() {
  echo ""
  echo "Shutting down..."
  kill $API_PID $WEB_PID 2>/dev/null
  wait $API_PID $WEB_PID 2>/dev/null
  echo "Done."
  exit 0
}

trap cleanup SIGINT SIGTERM

DIR="$(cd "$(dirname "$0")" && pwd)"

# API
cd "$DIR/apps/api"
source .venv/bin/activate
uvicorn app.main:app --reload --port 4000 &
API_PID=$!

# Web
cd "$DIR/apps/web"
npm run dev -- --port 4001 &
WEB_PID=$!

echo ""
echo "  API:  http://localhost:4000"
echo "  Web:  http://localhost:4001"
echo ""
echo "  Ctrl+C to stop both"
echo ""

wait
