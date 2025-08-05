@echo off
echo Starting Temple Donation System...
set NODE_ENV=development
set DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
set SESSION_SECRET=temple-donation-secret-key-change-in-production
set PORT=5000
echo Environment variables set successfully...
echo Starting server...
tsx server/index.ts
pause