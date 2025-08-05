# Windows Commands for Temple Donation System

## 🪟 Windows PowerShell Commands

### Clean Installation (Windows):
```powershell
# Remove node_modules folder
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue

# Remove package-lock.json
Remove-Item package-lock.json -ErrorAction SilentlyContinue

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install
```

### Alternative Windows Commands:
```cmd
# Using Command Prompt (cmd):
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
```

### Or Simple PowerShell:
```powershell
# Delete folders/files if they exist
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item package-lock.json }
npm cache clean --force
npm install
```

## 🔧 Step-by-Step Windows Setup:

### Step 1: Clean Project
```powershell
# Navigate to project folder
cd C:\path\to\your\temple-donation-system

# Clean installation
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
```

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Create Environment File
```powershell
# Copy template
Copy-Item .env.example .env

# Edit .env file manually or use:
notepad .env
```

### Step 4: Add Environment Variables
```
DATABASE_URL=your-neon-connection-string
SESSION_SECRET=your-32-character-secret-key
NODE_ENV=development
PORT=5000
```

### Step 5: Start Development Server
```powershell
npm run dev
```

## 🚨 Windows Common Issues:

### Issue 1: PowerShell Execution Policy
```powershell
# Fix execution policy error:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 2: Node.js Not Found
```powershell
# Check if Node.js installed:
node --version
npm --version

# If not found, download from: https://nodejs.org/
```

### Issue 3: Permission Errors
```powershell
# Run PowerShell as Administrator
# Right-click PowerShell → Run as Administrator
```

### Issue 4: Path Issues
```powershell
# Check current directory:
Get-Location

# Navigate to project:
cd "C:\Users\YourName\Downloads\temple-donation-system"
```

## 🎯 Quick Windows Setup Commands:

```powershell
# Complete setup in PowerShell:
if (Test-Path node_modules) { Remove-Item -Recurse -Force node_modules }
if (Test-Path package-lock.json) { Remove-Item package-lock.json }
npm cache clean --force
npm install
Copy-Item .env.example .env -ErrorAction SilentlyContinue
npm run dev
```

## ⚡ Alternative: Use Command Prompt (cmd)

### Open Command Prompt and run:
```cmd
cd C:\path\to\your\project
rmdir /s /q node_modules
del package-lock.json
npm cache clean --force
npm install
copy .env.example .env
npm run dev
```

## 📝 Windows Environment File Setup:

### Create .env file manually:
1. Open Notepad
2. Add these lines:
```
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
SESSION_SECRET=abcd1234efgh5678ijkl9012mnop3456qrst7890
NODE_ENV=development
PORT=5000
```
3. Save as `.env` (not .env.txt)
4. Make sure "All Files" is selected in save dialog

## 🔧 Windows-Specific Troubleshooting:

### Fix Long Path Issues:
```powershell
# Enable long paths in Windows:
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```

### Fix npm permissions:
```powershell
# Set npm prefix to user directory:
npm config set prefix "%USERPROFILE%\npm-global"
```

### Check Windows Version:
```powershell
# Check Windows version (should be Windows 10/11):
systeminfo | findstr "OS Name"
```