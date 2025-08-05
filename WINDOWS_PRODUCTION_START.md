# Windows Production Startup Guide

## Problem
The `npm start` command fails on Windows because it uses Unix-style environment variable syntax:
```
'NODE_ENV' is not recognized as an internal or external command
```

## Quick Start (Recommended)

### Step 1: Build the Project
```bash
npm run build
```

### Step 2: Start Production Server
**Option A: Using JavaScript Startup Script**
```bash
node start-production.js
```

**Option B: Using Batch File**
```bash
start-production.bat
```

## Alternative Solutions

### Option 3: Use cross-env
```bash
npx cross-env NODE_ENV=production node dist/index.js
```

### Option 4: Command Prompt
```bash
set NODE_ENV=production && node dist/index.js
```

### Option 5: PowerShell
```powershell
$env:NODE_ENV="production"; node dist/index.js
```

## Verification
Once started successfully, you'll see:
```
✓ PostgreSQL Database Connected - Data will be persistent
✓ Serving static files from /path/to/dist/public
serving on localhost:5000
```

Access the application at: **http://localhost:5000**

## Build Output
- **Frontend**: `dist/public/` (69KB CSS, 883KB JS)
- **Backend**: `dist/index.js` (50KB bundled server)
- **Static Assets**: Served with proper caching headers

## Production Features
- ✅ Optimized static file serving
- ✅ Database connection with environment variables
- ✅ Session management and authentication
- ✅ All API endpoints functional
- ✅ Date range filtering working
- ✅ CSV export functionality

## Troubleshooting
- Ensure `.env` file exists with DATABASE_URL
- Verify Node.js version is compatible
- Check that port 5000 is available
- Confirm PostgreSQL database is accessible