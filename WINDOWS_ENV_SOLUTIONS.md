# Windows Environment Variable Solutions

## 🚨 Problem: .env File Not Loading

The .env file exists but Node.js isn't reading it automatically on Windows.

## 🔧 Solution 1: Use dotenv Package (Recommended)

```cmd
# Install dotenv
npm install dotenv

# Start with dotenv
npx dotenv-cli tsx server/index.ts
```

## 🔧 Solution 2: Set Environment Variables Manually

### PowerShell:
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
$env:SESSION_SECRET="temple-donation-secret-key-12345678901234567890abcdefghijk"
$env:NODE_ENV="development"
$env:PORT="5000"
npx tsx server/index.ts
```

### Command Prompt:
```cmd
set DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
set SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk
set NODE_ENV=development
set PORT=5000
npx tsx server/index.ts
```

## 🔧 Solution 3: Use Windows Startup Script

I created `start-windows.js` that loads .env file:

```cmd
node start-windows.js
```

## 🔧 Solution 4: Install dotenv-cli

```cmd
# Install dotenv-cli globally
npm install -g dotenv-cli

# Run with dotenv-cli
dotenv -e .env tsx server/index.ts
```

## 🔧 Solution 5: One-Line PowerShell Command

```powershell
Get-Content .env | ForEach-Object { if($_ -match '^([^=]+)=(.*)$'){ [Environment]::SetEnvironmentVariable($matches[1], $matches[2], 'Process') } }; npx tsx server/index.ts
```

## ⚡ Quick Fix Commands (Try in Order)

### Try 1: Install and use dotenv-cli
```cmd
npm install -g dotenv-cli
dotenv -e .env tsx server/index.ts
```

### Try 2: Manual environment variables (PowerShell)
```powershell
$env:DATABASE_URL="postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
npx tsx server/index.ts
```

### Try 3: Use Windows startup script
```cmd
node start-windows.js
```

### Try 4: Command Prompt with set commands
```cmd
set DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
npx tsx server/index.ts
```

## ✅ Expected Success Output

Any of these methods should produce:
```
✅ Environment variables loaded
✅ DATABASE_URL found
🚀 Starting Temple Donation System...
PostgreSQL Database Connected - Data will be persistent
serving on localhost:5000
```

## 🎯 Recommended Approach

**Use dotenv-cli** - it's the most reliable for Windows:

1. Install: `npm install -g dotenv-cli`
2. Run: `dotenv -e .env tsx server/index.ts`
3. Access: http://localhost:5000

This ensures .env file is properly loaded on Windows systems.