# Local Setup Error Troubleshooting Guide

## 🚨 Common Local Development Errors & Solutions

## Error 1: Missing Dependencies

### Symptoms:
```
Error: Cannot find module 'express'
Error: Cannot find module 'react'
Module not found errors
```

### Solution:
```bash
# Complete clean install
rm -rf node_modules
rm package-lock.json
npm cache clear --force
npm install

# If still failing, install individually:
npm install express react react-dom
npm install --save-dev vite typescript tsx
```

## Error 2: Node.js Version Issues

### Symptoms:
```
Error: Unsupported engine
Node version compatibility issues
```

### Solution:
```bash
# Check Node.js version
node --version

# Should be 18.0.0 or higher
# Download latest from: https://nodejs.org/
# Or use nvm:
nvm install 18
nvm use 18
```

## Error 3: Environment Variables Missing

### Symptoms:
```
Error: DATABASE_URL must be set
Environment variable undefined
```

### Solution:
```bash
# Create .env file in project root
touch .env

# Add these variables:
DATABASE_URL=postgresql://your-neon-connection-string
SESSION_SECRET=your-32-character-secret-key
NODE_ENV=development
PORT=5000
```

## Error 4: Database Connection Failed

### Symptoms:
```
Error: Connection timeout
Error: Authentication failed
Database connection refused
```

### Solution:
```bash
# Verify Neon database connection string
# Format should be:
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require

# Test connection:
npm run db:push
```

## Error 5: Port Already in Use

### Symptoms:
```
Error: EADDRINUSE :::5000
Port 5000 already in use
```

### Solution:
```bash
# Find and kill process using port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:5000 | xargs kill -9

# Or change port in .env:
PORT=3000
```

## Error 6: TypeScript Compilation Errors

### Symptoms:
```
TSError: Cannot find module
Type checking errors
```

### Solution:
```bash
# Install TypeScript properly
npm install --save-dev typescript @types/node @types/react @types/react-dom

# Skip type checking for development:
npm run dev --skipTypeCheck
```

## Error 7: Vite Build Errors

### Symptoms:
```
Vite build failed
Module resolution errors
```

### Solution:
```bash
# Install Vite and plugins
npm install --save-dev vite @vitejs/plugin-react

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Error 8: Permission Errors

### Symptoms:
```
EACCES: permission denied
Cannot write to directory
```

### Solution:
```bash
# Fix npm permissions (Mac/Linux):
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Windows: Run terminal as Administrator
```

## Error 9: SSL/Certificate Errors

### Symptoms:
```
SSL certificate problem
CERT_UNTRUSTED errors
```

### Solution:
```bash
# Disable SSL verification (temporary):
npm config set strict-ssl false

# Or update npm certificates:
npm install --update-ca-certificates
```

## Error 10: React/Frontend Errors

### Symptoms:
```
React is not defined
JSX transform errors
```

### Solution:
```bash
# Install React properly
npm install react react-dom
npm install --save-dev @types/react @types/react-dom

# Verify vite.config.ts has React plugin
```

## 🔧 Universal Fix Commands

### Complete Reset (Try First):
```bash
# Navigate to project directory
cd your-project-folder

# Complete clean installation
rm -rf node_modules
rm package-lock.json
rm -rf dist
rm -rf .next
npm cache clear --force

# Fresh install
npm install

# Try development mode
npm run dev
```

### Minimal Working Setup:
```bash
# Essential files check
ls -la package.json  # Should exist
ls -la .env          # Should exist with DATABASE_URL

# Essential dependencies
npm install express react react-dom
npm install --save-dev vite tsx typescript

# Start development
npm run dev
```

## 🎯 Step-by-Step Troubleshooting

### Step 1: Environment Check
```bash
# Check Node.js version
node --version  # Should be 18+

# Check npm version  
npm --version   # Should be 8+

# Check project structure
ls -la          # Should see package.json, client/, server/
```

### Step 2: Dependencies Verification
```bash
# Check if package.json exists
cat package.json

# Install all dependencies
npm install

# Check installation success
npm list --depth=0
```

### Step 3: Environment Variables
```bash
# Check .env file
cat .env

# Should contain:
# DATABASE_URL=postgresql://...
# SESSION_SECRET=...
# NODE_ENV=development
```

### Step 4: Database Test
```bash
# Test database connection
npm run db:push

# Should see: "Everything is in sync"
```

### Step 5: Start Application
```bash
# Development mode
npm run dev

# Should see: "serving on localhost:5000"
# Open: http://localhost:5000
```

## 🚨 Emergency Fallback

### If Everything Fails:

#### Option 1: Simplified Development
```bash
# Skip complex setup, use basic Node.js
node server/index-simple.js

# Or create basic server:
const express = require('express');
const app = express();
app.listen(3000, () => console.log('Server running on 3000'));
```

#### Option 2: Use Replit Development
```bash
# Continue development in Replit
# Export when ready for deployment
# Skip local development entirely
```

#### Option 3: Online IDE
```bash
# Use CodeSandbox, StackBlitz, or Gitpod
# Import project directly
# Develop in browser environment
```

## 📞 Getting Specific Help

### Provide These Details:
1. **Error Message**: Exact error text
2. **Operating System**: Windows/Mac/Linux
3. **Node.js Version**: `node --version`
4. **NPM Version**: `npm --version`
5. **Command Executed**: What command failed
6. **Project Structure**: `ls -la` output

### Common Error Patterns:

#### Module Not Found:
```bash
Solution: npm install <missing-module>
```

#### Permission Denied:
```bash
Solution: Check file permissions, run as admin
```

#### Port in Use:
```bash
Solution: Change port or kill existing process
```

#### Database Connection:
```bash
Solution: Verify connection string format
```

## ✅ Success Indicators

### When Everything Works:
```bash
✅ npm install completes without errors
✅ npm run dev starts successfully  
✅ "serving on localhost:5000" message appears
✅ Browser loads http://localhost:5000
✅ Login page displays correctly
✅ No console errors in browser
✅ Database connection successful
```

**If you're still getting errors, share the specific error message and I'll provide targeted solution!**