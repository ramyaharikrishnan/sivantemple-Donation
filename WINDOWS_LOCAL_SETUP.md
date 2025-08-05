# Windows Local Setup - Complete Guide

## 🚨 DATABASE_URL Error Fix

The error shows you need to create a .env file with database connection details.

## 📝 Step 1: Create .env File

### Option A: PowerShell Command
```powershell
Copy-Item .env.example .env
```

### Option B: Manual Creation
1. Open Notepad
2. Create new file
3. Add the content below
4. Save as `.env` (not .env.txt)

## 🔗 Step 2: Get Your Neon Database URL

### From Your Replit Project:
1. Go to your Replit project
2. Click on "Secrets" tab (lock icon)
3. Copy the `DATABASE_URL` value
4. It looks like: `postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`

### Or Create New Neon Database:
1. Go to https://neon.tech
2. Sign up/Login
3. Create new project
4. Copy connection string

## 📄 Step 3: Add to .env File

Create `.env` file with this content:
```
DATABASE_URL=postgresql://your-username:your-password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst7890uvwx
NODE_ENV=development
PORT=5000
```

**Replace the DATABASE_URL with your actual Neon connection string!**

## 🚀 Step 4: Complete Windows Setup

```cmd
# 1. Create .env file (manual or copy from .env.example)

# 2. Install dependencies
npm install

# 3. Push database schema
npm run db:push

# 4. Start development server
npm run dev

# 5. Open browser: http://localhost:5000
```

## 🔧 Alternative: Use Development Database

If you don't have Neon database, you can use a local PostgreSQL:

### Install PostgreSQL on Windows:
1. Download from: https://www.postgresql.org/download/windows/
2. Install with default settings
3. Remember the password you set
4. Use this in .env:
```
DATABASE_URL=postgresql://postgres:your-password@localhost:5432/temple_donations
```

## 🎯 Quick Fix Commands (Windows)

```cmd
# Navigate to project
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation

# Copy environment template
copy .env.example .env

# Edit .env file with your database URL
notepad .env

# Install and run
npm install
npm run db:push
npm run dev
```

## ✅ Expected Results

After fixing .env file:
- `npm run db:push` succeeds
- `npm run dev` starts without errors
- Browser shows: "serving on localhost:5000"
- http://localhost:5000 loads the login page

## 🔍 Verify Setup

```cmd
# Check if .env exists
dir .env

# Check database connection
npm run db:push

# Should show: "Everything is in sync"
```

## 🚨 Common Issues

### Issue 1: .env.txt instead of .env
- Make sure file is saved as `.env` not `.env.txt`
- In Notepad: File Type → "All Files"

### Issue 2: Wrong DATABASE_URL format
- Must start with `postgresql://`
- Must include username, password, host, database name
- Must end with `?sslmode=require` for Neon

### Issue 3: Permission errors
- Run Command Prompt as Administrator
- Or use PowerShell as Administrator

## 📞 Need Database URL?

If you need a new database:
1. **Neon (Recommended)**: https://neon.tech - Free PostgreSQL
2. **Supabase**: https://supabase.com - Free PostgreSQL 
3. **Local PostgreSQL**: Install on Windows

The app needs PostgreSQL database to work. Get the connection string and add to .env file.