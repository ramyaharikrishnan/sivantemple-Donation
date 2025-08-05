# Quick Deployment Guide - Tamil Temple Donation System

## விரைவான Deployment Guide

### 🚀 Railway.app (மிக எளிது - Database Included)

#### Setup Steps:
1. **Railway Account:** https://railway.app ல் போய் GitHub account உபயோகித்து login பண்ணவும்
2. **New Project:** "Deploy from GitHub repo" select பண்ணவும்
3. **Repository Connect:** உங்கள் GitHub repository select பண்ணவும்
4. **Database Add:** "Add PostgreSQL" button click பண்ணவும்
5. **Auto Deploy:** Railway automatically deploy பண்ணும்

#### Environment Variables (Auto-set):
- `DATABASE_URL` - Railway automatically set பண்ணும்
- `SESSION_SECRET` - Manual ஆ add பண்ண வேண்டும்

**Session Secret Generate பண்ணுவது:**
```bash
# Linux/Mac
openssl rand -base64 32

# Online generator
# https://generate-secret.now.sh/32
```

#### Cost: **Free tier - Monthly $5 credit**

---

### 🌟 Vercel (Frontend) + Neon (Database)

#### Neon Database Setup:
1. https://neon.tech ல் account create பண்ணவும்
2. New project create பண்ணவும்
3. Connection string copy பண்ணவும்

#### Vercel Deployment:
1. https://vercel.com ல் GitHub account உபயோகித்து login பண்ணவும்
2. "Import Git Repository" click பண்ணவும்
3. Repository select பண்ணவும்
4. Environment Variables add பண்ணவும்:
   ```
   DATABASE_URL=postgresql://...neon.tech/...
   SESSION_SECRET=your-32-character-secret
   NODE_ENV=production
   ```
5. Deploy button click பண்ணவும்

#### Cost: **Completely Free**

---

### 🐳 Render.com

#### Setup Steps:
1. https://render.com ল் account create பண்ணவும்
2. "New Web Service" create பண்ணவும்
3. GitHub repository connect பண்ணவும்
4. Settings:
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
5. PostgreSQL service add பண்ணவும் (separate)
6. Environment variables add பண்ணவும்

#### Cost: **Free tier available**

---

## ⚡ எந்த Platform Best?

### **Beginners க்கு:** Railway
- Database included
- Automatic setup
- Simple deployment

### **Free கற்காக:** Vercel + Neon
- Completely free
- Good performance
- Reliable

### **Advanced Users:** Render/DigitalOcean
- More control
- Scaling options

---

## 🔧 After Deployment

### 1. Database Tables Create:
```bash
npm run db:push
```

### 2. Test Application:
- Login page: `admin / admin123`
- Donation form working
- Dashboard loading

### 3. Change Admin Password:
First login பண்ணின பிறகு Admin Panel ல் password change பண்ணவும்

---

## 📱 URLs After Deployment:

- **Railway:** `https://your-app-name.railway.app`
- **Vercel:** `https://your-app-name.vercel.app`
- **Render:** `https://your-app-name.onrender.com`

---

## 🆘 Common Issues:

### Database Connection Error:
```
Error: DATABASE_URL must be set
```
**Solution:** Environment variables ல் DATABASE_URL add பண்ணவும்

### Build Failure:
```
npm ERR! missing script: build
```
**Solution:** package.json ல் scripts section check பண்ணவும்

### Session Error:
```
Session secret required
```
**Solution:** SESSION_SECRET environment variable add பண்ணவும்

---

## 📞 Need Help?
1. Platform documentation check பண்ணவும்
2. Environment variables verify பண்ணவும்
3. Database connection test பண்ணவும்
4. Build logs check பண்ணவும்

**Most recommended:** Railway.app - One-click deployment with database included!