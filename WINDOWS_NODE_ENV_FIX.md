# Windows NODE_ENV Fix

## 🚨 Problem: Windows PowerShell NODE_ENV Error

Windows doesn't recognize `NODE_ENV=development` syntax from Linux/Mac.

## 🔧 Solution 1: Use Command Prompt (cmd) Instead

### Close PowerShell and open Command Prompt:
1. Press **Windows + R**
2. Type `cmd` and press Enter
3. Navigate to project:

```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
npm run dev
```

## 🔧 Solution 2: Use cross-env (Already Installed)

The project has `cross-env` package. Update package.json scripts manually:

### Open package.json in Notepad:
```cmd
notepad package.json
```

### Find the scripts section and change:
```json
"scripts": {
  "dev": "cross-env NODE_ENV=development tsx server/index.ts",
  "start": "cross-env NODE_ENV=production node dist/index.js",
  "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
  "check": "tsc",
  "db:push": "drizzle-kit push"
}
```

### Then run:
```cmd
npm run dev
```

## 🔧 Solution 3: Run Direct Command

Skip npm script, run tsx directly:

```cmd
npx tsx server/index.ts
```

## 🔧 Solution 4: Set Environment Variable First

```cmd
# Set environment variable in Windows
set NODE_ENV=development

# Then run
npx tsx server/index.ts
```

## 🔧 Solution 5: PowerShell Environment Variable

```powershell
# In PowerShell
$env:NODE_ENV="development"
npx tsx server/index.ts
```

## ⚡ Quick Commands (Try These):

### Option A: Command Prompt (Recommended)
```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
npm run dev
```

### Option B: Direct tsx command
```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
npx tsx server/index.ts
```

### Option C: PowerShell with environment variable
```powershell
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
$env:NODE_ENV="development"
npx tsx server/index.ts
```

## ✅ Expected Success Output:

```
PostgreSQL Database Connected - Data will be persistent
Serving static files from dist/public
serving on localhost:5000
```

## 🌐 Access Application:

Open browser: **http://localhost:5000**

## 📝 Notes:

- Command Prompt (cmd) works better than PowerShell for Node.js projects
- cross-env package handles environment variables across platforms
- Direct tsx command bypasses npm script issues
- The application will work regardless of NODE_ENV setting