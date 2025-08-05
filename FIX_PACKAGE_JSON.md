# Fix Missing Scripts in package.json

## 🚨 Missing "start" Script Error

The downloaded package.json is missing essential scripts. Here's how to fix it:

## 🔧 Solution 1: Add Missing Scripts

### Using npm commands (Windows):
```cmd
npm pkg set scripts.dev="NODE_ENV=development tsx server/index.ts"
npm pkg set scripts.start="NODE_ENV=production node dist/index.js"
npm pkg set scripts.build="vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
npm pkg set scripts.check="tsc"
npm pkg set scripts.db:push="drizzle-kit push"
```

### Verify scripts added:
```cmd
npm run
```

## 🔧 Solution 2: Manual package.json Edit

### Open package.json in Notepad and add scripts section:

```json
{
  "name": "temple-donation-system",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "start": "NODE_ENV=production node dist/index.js", 
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

## 🔧 Solution 3: Use Development Mode Instead

### Skip start script, use development mode:
```cmd
npm run dev
```

This starts the application in development mode - fully functional for local testing.

## 🎯 Recommended Commands for Windows:

### Step 1: Fix Scripts
```cmd
npm pkg set scripts.dev="NODE_ENV=development tsx server/index.ts"
npm pkg set scripts.start="NODE_ENV=production node dist/index.js"
npm pkg set scripts.build="vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

### Step 2: Install Dependencies
```cmd
npm install
```

### Step 3: Start Application
```cmd
npm run dev
```

### Step 4: Access Application
Open browser: http://localhost:5000

## ✅ Success Indicators:
- npm run shows all scripts
- npm run dev starts without errors
- Application loads at localhost:5000
- Login page displays correctly