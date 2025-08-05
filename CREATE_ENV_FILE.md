# Create .env File for Windows

## 🚨 DATABASE_URL Error - .env File Missing or Incorrect

The application can't find the DATABASE_URL. The .env file either doesn't exist or isn't formatted correctly.

## 📝 Step-by-Step .env File Creation

### Method 1: Command Prompt (Recommended)
```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation

# Create .env file with content
echo DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require > .env
echo SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk >> .env
echo NODE_ENV=development >> .env
echo PORT=5000 >> .env

# Verify file created
type .env
```

### Method 2: Notepad (Manual)
```cmd
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
notepad .env
```

**Copy-paste this EXACT content:**
```
DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk
NODE_ENV=development
PORT=5000
```

**Important:** Save as `.env` (not .env.txt) - select "All Files" in save dialog.

### Method 3: PowerShell
```powershell
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation

# Create .env file
@"
DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk
NODE_ENV=development
PORT=5000
"@ | Out-File -FilePath .env -Encoding utf8

# Verify file
Get-Content .env
```

## 🔍 Verify .env File Created Correctly

```cmd
# Check if file exists
dir .env

# Check file content
type .env

# Should show:
# DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@...
# SESSION_SECRET=temple-donation-secret-key-...
# NODE_ENV=development
# PORT=5000
```

## 🚀 After Creating .env File

```cmd
# Start the application
npx tsx server/index.ts

# Or use npm script
npm run dev
```

## ✅ Expected Success Output

```
PostgreSQL Database Connected - Data will be persistent
Serving static files from dist/public
serving on localhost:5000
```

## 🚨 Common Issues

### Issue 1: File created as .env.txt
- In Notepad: File Type → "All Files"
- File name: `.env` (with the dot at beginning)

### Issue 2: Hidden file extensions
```cmd
# Show file extensions in Windows
dir /a

# Should show .env (not .env.txt)
```

### Issue 3: Wrong file location
```cmd
# Make sure you're in correct directory
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation
pwd
```

### Issue 4: Special characters in path
- Move project to simpler path like C:\temple-donation
- Avoid spaces and special characters in folder names

## 🎯 Complete Setup Commands

```cmd
# Navigate to project
cd C:\Users\harin\OneDrive\Desktop\sivanDonation\TempleDonation

# Create .env file
echo DATABASE_URL=postgresql://neondb_owner:npg_TPc37yNrkbZF@ep-fragrant-forest-adfudasj-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require > .env
echo SESSION_SECRET=temple-donation-secret-key-12345678901234567890abcdefghijk >> .env
echo NODE_ENV=development >> .env
echo PORT=5000 >> .env

# Verify content
type .env

# Install dependencies
npm install

# Start application
npx tsx server/index.ts
```

## 📱 Test Application

1. Application starts without DATABASE_URL error
2. Open browser: http://localhost:5000
3. Temple donation system loads
4. Login page displays in English/Tamil