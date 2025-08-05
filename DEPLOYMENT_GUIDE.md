# Temple Donation Management System - Deployment Guide

## இந்த Application ஐ வேறு Platform ல் Host பண்ணுவது

### 1. Code Download பண்ணுவது

#### Replit இல் இருந்து:
1. Replit dashboard ல் போங்க
2. "Export as ZIP" option click பண்ணவும்
3. ZIP file download ஆகும்

#### GitHub Repository ஆக:
```bash
git clone [your-repository-url]
cd temple-donation-system
```

### 2. Local Setup (Testing கற்காக)

```bash
# Dependencies install பண்ணவும்
npm install

# Environment file create பண்ணவும்
cp .env.example .env

# Database setup பண்ணவும்
npm run db:push

# Development server start பண்ணவும்
npm run dev
```

### 3. Environment Variables Setup

`.env` file create பண்ணி இதை add பண்ணவும்:

```env
# Database Connection (Required)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Session Secret (Required)
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-long

# Node Environment
NODE_ENV=production

# Port (Optional - Platform assigns automatically)
PORT=5000
```

### 4. Database Options

#### A. Neon Database (Recommended - Free Tier Available)
1. https://neon.tech ல் போய் account create பண்ணவும்
2. New project create பண்ணவும்
3. Connection string copy பண்ணவும்
```
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
```

#### B. Supabase (Free PostgreSQL)
1. https://supabase.com ல் account create பண்ணவும்
2. New project create பண்ணவும்
3. Settings > Database ல் connection string எடுங்க
```
DATABASE_URL=postgresql://postgres.xyz:password@aws-0-region.pooler.supabase.com:5432/postgres
```

#### C. Railway (Database + Hosting Together)
1. https://railway.app ல் account create பண்ணவும்
2. PostgreSQL service add பண்ணவும்
3. Variables tab ல் DATABASE_URL கிடைக்கும்

### 5. Popular Hosting Platforms

#### A. Vercel (Recommended for Beginners)

**Steps:**
1. GitHub repository ல் code push பண்ணவும்
2. https://vercel.com ல் போய் account create பண்ணவும்
3. "Import Git Repository" click பண்ணவும்
4. Environment Variables add பண்ணவும்:
   - `DATABASE_URL`
   - `SESSION_SECRET`
   - `NODE_ENV=production`
5. Deploy button click பண்ணவும்

**Build Settings:**
- Build Command: `npm run build`
- Output Directory: `dist/public`
- Install Command: `npm install`

#### B. Railway (Database + Hosting)

**Steps:**
1. https://railway.app ல் account create பண்ணவும்
2. "New Project" > "Deploy from GitHub repo"
3. Repository select பண்ணவும்
4. PostgreSQL service add பண்ணவும்
5. Environment variables automatically set ஆகும்
6. Deploy ஆகும்

**Advantages:**
- Database included
- Very simple setup
- Good free tier

#### C. Render (Simple Deployment)

**Steps:**
1. https://render.com ல் account create பண்ணவும்
2. "New Web Service" create பண்ணவும்
3. GitHub repository connect பண்ணவும்
4. Build Command: `npm run build`
5. Start Command: `npm run start`
6. Environment variables add பண்ணவும்

#### D. DigitalOcean App Platform

**Steps:**
1. DigitalOcean account create பண்ணவும்
2. "Apps" section ல் போங்க
3. GitHub repository import பண்ணவும்
4. Database component add பண்ணவும்
5. Environment variables configure பண்ணவும்

### 6. Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Database migration
npm run db:push
```

### 7. Database Tables

Application start ஆகும்போது இந்த tables automatically create ஆகும்:

- `donations` - All donation records
- `receiptSequences` - Receipt number tracking

### 8. Post-Deployment Steps

1. **Database Migration:**
   ```bash
   npm run db:push
   ```

2. **Test the Application:**
   - Login page working ஆகுதா check பண்ணவும்
   - Donation form submit ஆகுதா test பண்ணவும்
   - Dashboard loading ஆகுதா verify பண்ணவும்

3. **Admin Setup:**
   - Default admin credentials: `admin / admin123`
   - First login பண்ணின பிறகு password change பண்ணவும்

### 9. Domain Setup (Optional)

Most platforms free subdomain கொடுக்கும்:
- Vercel: `your-app.vercel.app`
- Railway: `your-app.railway.app`
- Render: `your-app.onrender.com`

Custom domain add பண்ண platforms ல் settings ல் option இருக்கும்.

### 10. Troubleshooting

#### Common Issues:

**Database Connection Error:**
- DATABASE_URL correct ஆ இருக்கா check பண்ணவும்
- Database accessible ஆ இருக்கா test பண்ணவும்

**Build Failures:**
- Node.js version compatibility check பண்ணவும் (18+ required)
- Dependencies properly installed ஆ இருக்கா verify பண்ணவும்

**Environment Variables:**
- All required variables set ஆகி இருக்கா confirm பண்ணவும்
- Values properly escaped ஆ இருக்கா check பண்ணவும்

### 11. Recommended Platform For You

**Beginners:** Railway - Database included, simple setup
**Advanced:** Vercel + Neon Database - Best performance
**Enterprise:** DigitalOcean/AWS - Full control

எந்த platform select பண்ணினாலும் இந்த guide follow பண்ணா successfully deploy பண்ணலாம்!

### Support

Issues இருந்தா:
1. Platform specific documentation check பண்ணவும்
2. Database connection test பண்ணவும்
3. Build logs check பண்ணவும்
4. Environment variables verify பண்ணவும்