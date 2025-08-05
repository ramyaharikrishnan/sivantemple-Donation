# Build Script Missing Error - Complete Fix

## 🚨 Error: Missing script: "build"

This error occurs when the downloaded package.json doesn't have the build script. Here's the complete fix:

## 🔧 Solution 1: Fix package.json Scripts

Add this to your package.json file in the "scripts" section:

```json
{
  "name": "rest-express",
  "version": "1.0.0", 
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

## 🔧 Solution 2: Quick Fix Commands

### If package.json is corrupted or incomplete:

```bash
# Navigate to project directory
cd your-project-folder

# Create/fix package.json scripts section
npm pkg set scripts.dev="NODE_ENV=development tsx server/index.ts"
npm pkg set scripts.build="vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
npm pkg set scripts.start="NODE_ENV=production node dist/index.js"
npm pkg set scripts.check="tsc"
npm pkg set scripts.db:push="drizzle-kit push"

# Verify scripts added
npm run
```

## 🔧 Solution 3: Manual Build Without Script

### Run build commands directly:

```bash
# Install required build tools
npm install --save-dev vite esbuild tsx typescript

# Build frontend
npx vite build

# Build backend  
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Verify build
ls -la dist/
```

## 🔧 Solution 4: Skip Build - Use Development Mode

### Best approach for local testing:

```bash
# Install dependencies
npm install

# Run development mode (no build needed)
npm run dev

# Access application
# Open: http://localhost:5000
```

## 🔧 Solution 5: Complete package.json Template

### If package.json is completely missing or broken:

Create new package.json file:

```json
{
  "name": "temple-donation-system",
  "version": "1.0.0",
  "type": "module",
  "license": "MIT",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@neondatabase/serverless": "^0.10.4",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@tanstack/react-query": "^5.60.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "compression": "^1.8.1",
    "csv-parser": "^3.2.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.39.3",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "express-session": "^1.18.1",
    "framer-motion": "^11.13.1",
    "lucide-react": "^0.453.0",
    "multer": "^2.0.1",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.55.0",
    "recharts": "^2.15.2",
    "tailwind-merge": "^2.6.0",
    "wouter": "^3.3.5",
    "xlsx": "^0.18.5",
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "@types/express": "4.17.21",
    "@types/node": "20.16.11",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.2",
    "drizzle-kit": "^0.30.4",
    "esbuild": "^0.25.0",
    "tailwindcss": "^3.4.17",
    "tsx": "^4.19.1",
    "typescript": "5.6.3",
    "vite": "^5.4.14"
  }
}
```

## 🎯 Recommended Steps:

### Step 1: Quick Check
```bash
# Check if package.json exists and has scripts
cat package.json | grep -A 10 '"scripts"'
```

### Step 2: Add Missing Build Script
```bash
# Add build script to existing package.json
npm pkg set scripts.build="vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Test Build
```bash
npm run build
```

### Step 5: Alternative (Development Mode)
```bash
# If build still fails, use development mode
npm run dev
# Access: http://localhost:5000
```

## 🔍 Verification Commands:

```bash
# Check all available scripts
npm run

# Should show:
# dev, build, start, check, db:push

# Test each command
npm run dev    # Development server
npm run build  # Build production files
npm run start  # Start production server
```

## 💡 Important Notes:

1. **Development Mode Works Without Build**: `npm run dev` is fully functional
2. **Build Only Needed for Production**: Local testing doesn't require build
3. **Platform Auto-Build**: Most hosting platforms run build automatically
4. **Manual Build Commands**: Can build without npm script if needed

## 🚨 If Nothing Works:

### Use development mode for local testing:
```bash
npm install
npm run dev
# Fully functional at http://localhost:5000
```

### Deploy source code directly:
- Upload to Railway/Vercel without building
- Platform handles build process automatically
- No need for local build

**Development mode is the best solution for local testing!**