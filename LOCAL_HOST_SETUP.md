# Local Host Setup Guide - Temple Donation System

## 💻 Local Development Setup

Code download பண்ணி உங்கள் computer ل் run பண்ணுவதற்கான steps:

## 🔧 Prerequisites

### Required Software:
```bash
1. Node.js (Version 18 or higher)
   Download: https://nodejs.org/

2. Git (Optional - for version control)
   Download: https://git-scm.com/

3. Code Editor (VS Code recommended)
   Download: https://code.visualstudio.com/
```

## 📥 Setup Process

### Step 1: Code Download & Extract
```bash
# Replit ல் இருந்து ZIP download பண்ணவும்
# Extract to desired folder
unzip temple-donation-system.zip
cd temple-donation-system
```

### Step 2: Dependencies Installation
```bash
# Terminal/Command Prompt open பண்ணவும்
# Project folder ல் navigate பண்ணவும்
cd path/to/temple-donation-system

# Install all dependencies
npm install

# Wait for installation to complete
# Should see "added XXX packages" message
```

### Step 3: Environment Variables Setup
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your database details:
DATABASE_URL=your-neon-database-connection-string
SESSION_SECRET=your-32-character-secret-key
NODE_ENV=development
PORT=5000
```

### Step 4: Database Connection
```bash
# Using your Neon database connection string:
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require

# Test database connection
npm run db:push

# Should see: "✓ Everything is in sync"
```

### Step 5: Build Application
```bash
# Build frontend assets
npm run build

# Should create dist/public folder with compiled files
```

### Step 6: Start Local Server
```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start

# Server will start on http://localhost:5000
```

## 🌐 Access Application

### Open in Browser:
```bash
URL: http://localhost:5000
Default Login: admin / admin123

# Test pages:
- Login: http://localhost:5000
- Dashboard: http://localhost:5000/dashboard
- Donation Form: http://localhost:5000/
- Admin Panel: http://localhost:5000/admin
```

## 🔍 Verification Steps

### Check if Everything Works:
```bash
✅ Server starts without errors
✅ Database connection successful
✅ Login page loads
✅ Admin login works
✅ Donation form submission
✅ Dashboard shows data
✅ All pages responsive
```

## 📊 Development Commands

### Available Scripts:
```bash
# Development server (auto-reload)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database migration
npm run db:push
```

## 🛠️ Development Workflow

### Making Changes:
```bash
1. Edit files in client/src/ (Frontend)
2. Edit files in server/ (Backend)
3. Changes auto-reload in development mode
4. Test changes in browser
5. Build for production when ready
```

### File Structure:
```
temple-donation-system/
├── client/src/          # React frontend
├── server/              # Express backend
├── shared/              # Shared schemas
├── dist/                # Built files
├── package.json         # Dependencies
└── .env                 # Environment variables
```

## 🚨 Common Issues & Solutions

### Port Already in Use:
```bash
Error: EADDRINUSE: address already in use :::5000
Solution: 
- Close other applications using port 5000
- Or change PORT in .env file to 5000 or 8000
```

### Database Connection Error:
```bash
Error: DATABASE_URL must be set
Solution:
- Check .env file exists
- Verify DATABASE_URL is correct
- Test Neon database connection
```

### Build Errors:
```bash
Error: Module not found
Solution:
- Delete node_modules folder
- Run: npm install
- Try: npm run build again
```

### Dependencies Issues:
```bash
Error: Cannot resolve dependency
Solution:
- Clear cache: npm cache clean --force
- Delete package-lock.json
- Run: npm install
```

## 🔄 Hot Reload Development

### Development Mode Features:
```bash
- Automatic server restart on backend changes
- Frontend hot reload on React changes
- Error overlay for debugging
- Source maps for debugging
- TypeScript type checking
```

## 📱 Mobile Testing (Local)

### Test on Mobile Device:
```bash
1. Ensure computer and mobile on same WiFi
2. Find computer IP address:
   - Windows: ipconfig
   - Mac/Linux: ifconfig
3. Access from mobile: http://192.168.1.xxx:5000
4. Test touch interface and responsiveness
```

## 🔐 Local Database Options

### Option 1: Use Neon (Recommended)
```bash
# Continue using your Neon database
DATABASE_URL=postgresql://...neon.tech/...
# Data syncs between local and production
```

### Option 2: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create local database
# Use: DATABASE_URL=postgresql://localhost:5432/temple_donations
# Separate from production data
```

## 📊 Performance Monitoring

### Development Tools:
```bash
# Browser DevTools:
- Network tab for API calls
- Console for errors
- Application tab for storage

# Server Logs:
- API response times
- Database query logs
- Error tracking
```

## 🎯 Production vs Development

### Key Differences:
```bash
Development (npm run dev):
- Hot reload enabled
- Detailed error messages
- Source maps for debugging
- NODE_ENV=development

Production (npm start):
- Optimized builds
- Compressed assets
- Error logging only
- NODE_ENV=production
```

## 📞 Troubleshooting

### Common Commands:
```bash
# Clean installation
rm -rf node_modules package-lock.json
npm install

# Force rebuild
npm run build --force

# Check Node.js version
node --version  # Should be 18+

# Check npm version
npm --version

# View logs
npm run dev --verbose
```

### Getting Help:
```bash
1. Check terminal logs for specific errors
2. Verify .env file configuration
3. Test database connection separately
4. Check browser console for frontend errors
5. Ensure all dependencies installed correctly
```

## 🎉 Success Checklist

✅ Node.js installed (version 18+)  
✅ Project dependencies installed  
✅ Environment variables configured  
✅ Database connected successfully  
✅ Application builds without errors  
✅ Server starts on localhost:5000  
✅ Login page accessible  
✅ Admin functions working  
✅ Donation form submitting  
✅ Dashboard displaying data  

**Local development environment ready!**