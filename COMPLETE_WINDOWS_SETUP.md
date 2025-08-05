# Complete Windows Setup Guide

## 🎯 Step-by-Step Windows Local Setup

The db:push script exists but dependencies need to be properly installed.

## 📝 Step 1: Create .env File First

```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
notepad .env
```

**Add this content to .env file:**
```
DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk
NODE_ENV=development
PORT=5000
```

Save as `.env` (select "All Files" in Notepad)

## 🔧 Step 2: Clean Install Dependencies

```cmd
# Remove existing installations
rmdir /s /q node_modules
del package-lock.json

# Clear npm cache
npm cache clean --force

# Fresh installation
npm install
```

## 🗄️ Step 3: Setup Database Schema

```cmd
# This should work now after npm install
npm run db:push
```

**Expected output:**
```
Everything is in sync ✓
```

## 🚀 Step 4: Start Application

```cmd
npm run dev
```

**Expected output:**
```
serving on localhost:5000
```

## 🌐 Step 5: Access Application

Open browser: **http://localhost:5000**

## 🔍 Troubleshooting Commands

### Check if dependencies installed:
```cmd
npm list drizzle-kit
npm list tsx
```

### Check if .env file is correct:
```cmd
type .env
```

### Verify project structure:
```cmd
dir /b
```

Should show: client, server, shared, package.json, .env

## ⚡ Quick Commands (Copy-Paste All):

```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
npm run db:push
npm run dev
```

## ✅ Success Indicators:

1. **npm install** completes without errors
2. **npm run db:push** shows "Everything is in sync"
3. **npm run dev** shows "serving on localhost:5000"
4. **http://localhost:5000** loads the temple donation system
5. Login page displays in English/Tamil

## 🚨 Common Issues:

### Issue 1: Still "Missing script db:push"
```cmd
# Check if package.json exists
type package.json | findstr "db:push"

# Should show: "db:push": "drizzle-kit push"
```

### Issue 2: drizzle-kit not found
```cmd
# Install drizzle-kit specifically
npm install --save-dev drizzle-kit
npm run db:push
```

### Issue 3: Node.js version
```cmd
# Check version (should be 18+)
node --version

# Update if needed from: https://nodejs.org/
```

### Issue 4: .env file issues
```cmd
# Check file exists
dir .env

# Check content
type .env

# Should show DATABASE_URL starting with postgresql://
```

## 🔧 Alternative: Skip Database Setup

If db:push keeps failing, you can still run the app:

```cmd
# Start app without db:push
npm run dev

# The app will create tables automatically on first run
```

## 📞 Need Help?

If any step fails, share the exact error message and which step it failed on.

The most common issue is .env file not created properly or dependencies not installed completely.