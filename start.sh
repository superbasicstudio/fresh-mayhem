#!/bin/bash
# Launch Mayhem Dashboard dev server and open in browser
cd "$(dirname "$0")"
echo "Starting Mayhem Dashboard at http://localhost:3022/"
sleep 1 && xdg-open http://localhost:3022/ &
exec npx vite
