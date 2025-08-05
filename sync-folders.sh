#!/bin/bash
# Sync script to maintain organized folder structure
# Run this after making changes to keep frontend/ and backend/ in sync

echo "🔄 Syncing organized folders..."

# Sync backend to root level (for server compatibility)
echo "Syncing backend/server -> server/"
cp -r backend/server/* server/ 2>/dev/null || true
cp -r backend/shared/* shared/ 2>/dev/null || true

# Sync frontend to root level (for build compatibility)  
echo "Syncing frontend/client -> client/"
cp -r frontend/client/* client/ 2>/dev/null || true
cp -r frontend/public/* public/ 2>/dev/null || true
cp frontend/client/index.html index.html 2>/dev/null || true

echo "✅ Sync complete! Organized structure maintained."