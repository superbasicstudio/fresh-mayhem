#!/bin/bash
# Enable maintenance mode on Fresh Mayhem
# Adds a rewrite rule to vercel.json that sends all traffic to maintenance.html
# Then pushes to trigger a Vercel deploy

set -e
cd "$(dirname "$0")/.."

echo "Enabling maintenance mode..."

python3 -c "
import json
with open('vercel.json', 'r') as f:
    config = json.load(f)

config['rewrites'] = [
    { 'source': '/((?!maintenance.html|favicon.svg|robots.txt).*)', 'destination': '/maintenance.html' }
]

with open('vercel.json', 'w') as f:
    json.dump(config, f, indent=2)

print('vercel.json updated with maintenance rewrite')
"

git add vercel.json
git commit -m "Enable maintenance mode"
git push origin main

echo ""
echo "Maintenance mode ENABLED"
echo "Site will show maintenance page after Vercel deploys (1-2 min)"
echo ""
echo "Run scripts/maintenance-off.sh when done"
