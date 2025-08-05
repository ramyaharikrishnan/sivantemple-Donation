# Database Setup Guide - Temple Donation System

## 📊 Database Requirements

இந்த Temple Donation System க்கு **PostgreSQL database** தேவை. Code download பண்ணின பிறகு database setup பண்ண வேண்டும்.

## 🎯 Database Setup Options:

### **Option 1: Railway.app (Easiest)**
```bash
✅ Database Included - Extra setup தேவையில்லை
✅ Automatic Connection - Environment variables auto-set
✅ Free Tier - Monthly $5 credit
✅ Backup Included - Automatic backups

Process:
1. Railway.app ல் project deploy பண்ணவும்
2. "Add PostgreSQL" service click பண்ணவும்
3. DATABASE_URL automatically set ஆகும்
4. Tables automatically create ஆகும்
```

### **Option 2: Neon Database (Free)**
```bash
✅ Free Forever Plan - 0.5GB storage
✅ Serverless PostgreSQL 
✅ Easy Setup
✅ Good Performance

Steps:
1. https://neon.tech ல் account create பண்ணவும்
2. New project create பண்ணவும்
3. Connection string copy பண்ணவும்
4. .env file ல் add பண்ணவும்

Connection String Format:
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### **Option 3: Supabase (Free)**
```bash
✅ Free Tier - 500MB storage
✅ PostgreSQL + Dashboard
✅ Real-time features
✅ Easy Management

Steps:
1. https://supabase.com ல் account create பண்ணவும்
2. New project create பண்ணவும்
3. Settings > Database ல் connection string எடுங்க
4. .env file ல் add பண்ணவும்

Connection String Format:
DATABASE_URL=postgresql://postgres.xyz:password@aws-0-region.pooler.supabase.com:5432/postgres
```

### **Option 4: Render Database**
```bash
✅ Free PostgreSQL service
✅ Good for small projects
✅ Easy integration

Steps:
1. https://render.com ல் account create பண்ணவும்
2. New PostgreSQL service create பண்ணவும்
3. Connection details copy பண்ணவும்
4. Web service ல் connect பண்ணவும்
```

## 📋 Database Tables

இந்த application ல் **2 main tables** இருக்கு:

### **1. Donations Table**
```sql
- id (Primary Key)
- receiptNo (Unique Receipt Number)
- name (Donor Name)
- phone (10-digit Phone Number)
- community (Kulam/Community)
- location (Location)
- address (Address - Optional)
- amount (Donation Amount)
- paymentMode (cash/card/upi/bankTransfer/cheque)
- inscription (Boolean - Inscription Required)
- donationDate (Donation Date)
- createdAt (Timestamp)
```

### **2. Receipt Sequences Table**
```sql
- id (Primary Key)
- year (Year)
- lastReceiptNumber (Last Receipt Number for Year)
- updatedAt (Timestamp)
```

## 🔧 Code Download பின்பு Database Setup:

### **Step 1: Environment Variables**
```bash
# .env file create பண்ணவும்
cp .env.example .env

# Edit .env file:
DATABASE_URL=your-database-connection-string
SESSION_SECRET=your-32-character-secret-key
NODE_ENV=production
```

### **Step 2: Database Connection Test**
```bash
# Dependencies install பண்ணவும்
npm install

# Database connection test பண்ணவும்
npm run db:push
```

### **Step 3: Tables Creation**
```bash
# Application first run ல் tables automatically create ஆகும்
# Or manually run:
npm run db:push

# Success message:
✓ PostgreSQL Database Connected - Data will be persistent
```

## 🚀 Deployment Platform Specific:

### **Railway.app**
```bash
DATABASE_URL: Automatically set when PostgreSQL service added
SESSION_SECRET: Manual ஆ add பண்ண வேண்டும்
Tables: Auto-create on first API call
```

### **Vercel + External Database**
```bash
DATABASE_URL: Neon/Supabase connection string
SESSION_SECRET: Add in environment variables
Tables: Run npm run db:push after deployment
```

### **Render.com**
```bash
DATABASE_URL: Render PostgreSQL connection string
SESSION_SECRET: Add in environment variables
Tables: Auto-create during build process
```

## 🔍 Database Verification:

### **After Setup Check:**
```bash
1. Application successfully starts
2. Login page loads
3. Donation form works
4. Dashboard displays data
5. No database connection errors in logs
```

### **Common Connection Strings:**
```bash
# Local PostgreSQL
DATABASE_URL=postgresql://username:password@localhost:5432/temple_donations

# Neon (Cloud)
DATABASE_URL=postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require

# Supabase (Cloud)
DATABASE_URL=postgresql://postgres.xyz:password@aws-0-region.pooler.supabase.com:5432/postgres

# Railway (Auto-generated)
DATABASE_URL=postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway
```

## 📊 Data Migration (Optional):

### **Existing Data Import:**
```bash
1. Current database ல் CSV export பண்ணவும்
2. New database setup பண்ணவும்
3. Application ل் CSV import feature use பண்ணவும்
4. Data verify பண்ணவும்
```

## 💰 Cost Comparison:

| Platform | Storage | Price | Features |
|----------|---------|-------|----------|
| Railway | 1GB | Free $5/month | Database + Hosting |
| Neon | 0.5GB | Free Forever | Serverless PostgreSQL |
| Supabase | 500MB | Free Tier | PostgreSQL + Dashboard |
| Render | 1GB | Free Tier | PostgreSQL Service |

## 🎯 Recommended Approach:

### **For Beginners:**
**Railway.app** - Database + hosting included, single setup

### **For Free Usage:**
**Vercel + Neon** - Completely free, good performance

### **For Advanced Users:**
**Render + Dedicated Database** - More control, scaling options

## 🚨 Important Notes:

1. **Connection String Security:** Never commit DATABASE_URL to git
2. **SSL Required:** Most cloud databases require SSL connections
3. **Connection Limits:** Free tiers have connection limits
4. **Backup Strategy:** Regular backups recommended for production
5. **Data Persistence:** All data stored permanently in PostgreSQL

## 📞 Troubleshooting:

### **Connection Errors:**
```bash
Error: DATABASE_URL must be set
Solution: Check environment variables

Error: Connection timeout
Solution: Verify database server running

Error: Authentication failed
Solution: Check username/password in connection string
```

### **Table Creation Issues:**
```bash
Error: relation "donations" does not exist
Solution: Run npm run db:push to create tables

Error: permission denied
Solution: Check database user permissions
```

**Database setup simple ஆ இருக்கு! Platform choose பண்ணி connection string add பண்ணினால் போதும்.**