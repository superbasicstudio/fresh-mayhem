#!/bin/bash
# Disable maintenance mode on Fresh Mayhem
# Removes the rewrite rule from vercel.json
# Then pushes to trigger a Vercel deploy

set -e
cd "$(dirname "$0")/.."

echo "Disabling maintenance mode..."

python3 -c "
import json
with open('vercel.json', 'r') as f:
    config = json.load(f)

if 'rewrites' in config:
    del config['rewrites']

with open('vercel.json', 'w') as f:
    json.dump(config, f, indent=2)

print('vercel.json updated, maintenance rewrite removed')
"

git add vercel.json
git commit -m "Disable maintenance mode"
git push origin main

echo ""
echo "Maintenance mode DISABLED"
echo "Site will be back to normal after Vercel deploys (1-2 min)"
