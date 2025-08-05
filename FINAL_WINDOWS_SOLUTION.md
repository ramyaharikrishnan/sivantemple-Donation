# Final Windows Solution - Temple Donation System

## 🚨 tsx Command Not Found

The tsx package needs to be run with npx. Here's the corrected approach:

## 🔧 Working Solutions for Windows

### Solution 1: dotenv-cli with npx
```cmd
dotenv -e .env npx tsx server/index.ts
```

### Solution 2: PowerShell environment variables (Simplest)
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SESSION_SECRET="temple-donation-secret-key-12345678901234567890abcdefghijk"
$env:NODE_ENV="development"
$env:PORT="5000"
npx tsx server/index.ts
```

### Solution 3: Command Prompt with set commands
```cmd
set "DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
set "SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk"
set "NODE_ENV=development"
set "PORT=5000"
npx tsx server/index.ts
```

### Solution 4: All-in-one PowerShell command
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"; $env:SESSION_SECRET="temple-donation-secret-key-12345678901234567890abcdefghijk"; $env:NODE_ENV="development"; $env:PORT="5000"; npx tsx server/index.ts
```

## ⚡ Recommended Quick Fix

**Use PowerShell** (copy-paste this entire block):
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SESSION_SECRET="temple-donation-secret-key-12345678901234567890abcdefghijk"
$env:NODE_ENV="development"
$env:PORT="5000"
npx tsx server/index.ts
```

## ✅ Expected Success Output
```
PostgreSQL Database Connected - Data will be persistent
Serving static files from dist/public
serving on localhost:5000
```

## 🌐 Access Application
Open browser: **http://localhost:5000**

## 🔑 Login Credentials
- Username: admin
- Password: admin123

## 📱 Features Available
- Bilingual interface (English/Tamil)
- Dashboard analytics
- Donation form with receipts
- Donor lookup
- Data import (CSV/Excel)
- Admin settings

Your temple donation management system will be fully functional once started with any of these methods.