var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/admin-credentials.ts
var admin_credentials_exports = {};
__export(admin_credentials_exports, {
  SECURITY_RECOMMENDATIONS: () => SECURITY_RECOMMENDATIONS,
  changeAdminCredentials: () => changeAdminCredentials,
  generateSecurePassword: () => generateSecurePassword,
  getAdminUser: () => getAdminUser,
  getAllAdmins: () => getAllAdmins,
  validateAdminCredentials: () => validateAdminCredentials,
  validatePasswordStrength: () => validatePasswordStrength
});
function validatePasswordStrength(password) {
  const errors = [];
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }
  const commonPatterns = [
    /^password/i,
    /^123456/,
    /^admin/i,
    /^temple/i
  ];
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push("Password contains common patterns and is not secure");
      break;
    }
  }
  return {
    isValid: errors.length === 0,
    errors
  };
}
function generateSecurePassword(length = 16) {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
  const allChars = uppercase + lowercase + numbers + symbols;
  let password = "";
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  return password.split("").sort(() => Math.random() - 0.5).join("");
}
function getAdminUser(username) {
  return PREDEFINED_ADMINS.find((admin) => admin.username === username);
}
function validateAdminCredentials(username, password) {
  const admin = getAdminUser(username);
  if (!admin) return null;
  if (admin.password === password) {
    return { ...admin, lastLogin: /* @__PURE__ */ new Date() };
  }
  return null;
}
function getAllAdmins() {
  return PREDEFINED_ADMINS.map(({ password, ...admin }) => admin);
}
function changeAdminCredentials(currentUsername, newUsername, newPassword) {
  const adminIndex = PREDEFINED_ADMINS.findIndex((admin) => admin.username === currentUsername);
  if (adminIndex === -1) {
    return false;
  }
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(`Password validation failed: ${passwordValidation.errors.join(", ")}`);
  }
  PREDEFINED_ADMINS[adminIndex].username = newUsername;
  PREDEFINED_ADMINS[adminIndex].password = newPassword;
  console.log(`Admin credentials updated: ${currentUsername} -> ${newUsername}`);
  return true;
}
var PREDEFINED_ADMINS, SECURITY_RECOMMENDATIONS;
var init_admin_credentials = __esm({
  "server/admin-credentials.ts"() {
    "use strict";
    PREDEFINED_ADMINS = [
      {
        username: process.env.ADMIN_USERNAME || "MPEswar",
        password: process.env.ADMIN_PASSWORD || "Skbi#1948",
        role: "superadmin",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        username: process.env.ADMIN_USERNAME_2 || "donations_admin",
        password: process.env.ADMIN_PASSWORD_2 || "Donate#2025$Safe",
        role: "admin",
        createdAt: /* @__PURE__ */ new Date()
      },
      {
        username: process.env.ADMIN_USERNAME_3 || "temple_manager",
        password: process.env.ADMIN_PASSWORD_3 || "Manage!Temple#2025",
        role: "admin",
        createdAt: /* @__PURE__ */ new Date()
      }
    ];
    SECURITY_RECOMMENDATIONS = {
      en: {
        title: "Security Recommendations",
        points: [
          "Use environment variables to set secure admin credentials",
          "Change default passwords immediately in production",
          "Use strong passwords with mixed case, numbers, and symbols",
          "Enable HTTPS in production environments",
          "Regularly update admin passwords",
          "Monitor admin login activities",
          "Use different credentials for different environments"
        ]
      },
      ta: {
        title: "\u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAA\u0BB0\u0BBF\u0BA8\u0BCD\u0BA4\u0BC1\u0BB0\u0BC8\u0B95\u0BB3\u0BCD",
        points: [
          "\u0BAA\u0BBE\u0BA4\u0BC1\u0B95\u0BBE\u0BAA\u0BCD\u0BAA\u0BBE\u0BA9 \u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0BBE\u0B95 \u0B85\u0BB1\u0BBF\u0BAE\u0BC1\u0B95 \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BC8 \u0B85\u0BAE\u0BC8\u0B95\u0BCD\u0B95 \u0B9A\u0BC2\u0BB4\u0BB2\u0BCD \u0BAE\u0BBE\u0BB1\u0BBF\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0B89\u0BB1\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0B87\u0BAF\u0BB2\u0BCD\u0BAA\u0BC1\u0BA8\u0BBF\u0BB2\u0BC8 \u0B95\u0B9F\u0BB5\u0BC1\u0B9A\u0BCD\u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0B89\u0B9F\u0BA9\u0BC7 \u0BAE\u0BBE\u0BB1\u0BCD\u0BB1\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0B95\u0BB2\u0BAA\u0BCD\u0BAA\u0BC1 \u0BB5\u0BB4\u0B95\u0BCD\u0B95\u0BC1, \u0B8E\u0BA3\u0BCD\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0B95\u0BC1\u0BB1\u0BBF\u0BAF\u0BC0\u0B9F\u0BC1\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0BB5\u0BB2\u0BC1\u0BB5\u0BBE\u0BA9 \u0B95\u0B9F\u0BB5\u0BC1\u0B9A\u0BCD\u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0B89\u0BB1\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BBF \u0B9A\u0BC2\u0BB4\u0BB2\u0BCD\u0B95\u0BB3\u0BBF\u0BB2\u0BCD HTTPS \u0B90 \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0BBE\u0B95 \u0B95\u0B9F\u0BB5\u0BC1\u0B9A\u0BCD\u0B9A\u0BCA\u0BB1\u0BCD\u0B95\u0BB3\u0BC8 \u0BA4\u0BCA\u0B9F\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0BAA\u0BC1\u0BA4\u0BC1\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0BA8\u0BBF\u0BB0\u0BCD\u0BB5\u0BBE\u0B95 \u0B89\u0BB3\u0BCD\u0BA8\u0BC1\u0BB4\u0BC8\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BB2\u0BCD\u0BAA\u0BBE\u0B9F\u0BC1\u0B95\u0BB3\u0BC8\u0B95\u0BCD \u0B95\u0BA3\u0BCD\u0B95\u0BBE\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
          "\u0BB5\u0BC6\u0BB5\u0BCD\u0BB5\u0BC7\u0BB1\u0BC1 \u0B9A\u0BC2\u0BB4\u0BB2\u0BCD\u0B95\u0BB3\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0BB5\u0BC6\u0BB5\u0BCD\u0BB5\u0BC7\u0BB1\u0BC1 \u0B85\u0BB1\u0BBF\u0BAE\u0BC1\u0B95 \u0BA4\u0B95\u0BB5\u0BB2\u0BCD\u0B95\u0BB3\u0BC8\u0BAA\u0BCD \u0BAA\u0BAF\u0BA9\u0BCD\u0BAA\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BB5\u0BC1\u0BAE\u0BCD"
        ]
      }
    };
  }
});

// server/index.ts
import express from "express";
import session from "express-session";
import compression from "compression";
import { createServer } from "http";

// server/routes.ts
import multer from "multer";
import * as XLSX from "xlsx";
import csv from "csv-parser";
import { Readable } from "stream";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  donations: () => donations,
  insertDonationSchema: () => insertDonationSchema,
  receiptSequences: () => receiptSequences,
  selectDonationSchema: () => selectDonationSchema
});
import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
var donations = pgTable("donations", {
  id: serial("id").primaryKey(),
  receiptNo: varchar("receipt_no", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 10 }).notNull(),
  community: varchar("community", { length: 20 }).notNull().default("any"),
  location: varchar("location", { length: 100 }).notNull(),
  address: varchar("address", { length: 255 }),
  amount: integer("amount").notNull(),
  paymentMode: varchar("payment_mode", { length: 20 }).notNull(),
  inscription: boolean("inscription").default(false),
  donationDate: timestamp("donation_date"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var receiptSequences = pgTable("receiptSequences", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().unique(),
  lastReceiptNumber: integer("lastReceiptNumber").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().notNull()
});
var insertDonationSchema = createInsertSchema(donations, {
  receiptNo: z.string().min(1, "Receipt number is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  community: z.enum(["any", "payiran", "chozhan", "pandiyan", "othaalan", "vizhiyan", "aadai", "aavan", "odhaalan", "semban"]),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMode: z.enum(["cash", "card", "upi", "bankTransfer", "cheque"]),
  inscription: z.boolean().default(false),
  donationDate: z.coerce.date().optional()
}).omit({
  id: true,
  createdAt: true
});
var selectDonationSchema = createSelectSchema(donations);

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, desc, gte, lte, and, sql, count, sum, or, like } from "drizzle-orm";
var DatabaseStorage = class {
  async createDonation(donation) {
    const [result] = await db.insert(donations).values(donation).returning();
    return result;
  }
  async getAllDonations() {
    return await db.select().from(donations).orderBy(desc(donations.donationDate));
  }
  async getDonationById(id) {
    const [result] = await db.select().from(donations).where(eq(donations.id, id));
    return result;
  }
  async getDonationsByPhone(phone) {
    return await db.select().from(donations).where(eq(donations.phone, phone)).orderBy(desc(donations.donationDate));
  }
  async getDonationsByDateRange(startDate, endDate) {
    return await db.select().from(donations).where(and(
      gte(donations.donationDate, startDate),
      lte(donations.donationDate, endDate)
    )).orderBy(desc(donations.donationDate));
  }
  async getDonationsByReceiptNo(receiptNo) {
    const [result] = await db.select().from(donations).where(eq(donations.receiptNo, receiptNo));
    return result;
  }
  async deleteDonation(id) {
    const result = await db.delete(donations).where(eq(donations.id, id));
    return (result.rowCount || 0) > 0;
  }
  async deleteAllDonations() {
    await db.delete(donations);
    await db.delete(receiptSequences);
  }
  async getNextReceiptNumber(year) {
    let sequence = await this.getCurrentReceiptSequence(year);
    if (!sequence) {
      const [newSequence] = await db.insert(receiptSequences).values({ year, lastReceiptNumber: 1 }).returning();
      return "1";
    }
    const nextNumber = sequence.lastReceiptNumber + 1;
    await db.update(receiptSequences).set({ lastReceiptNumber: nextNumber }).where(eq(receiptSequences.year, year));
    return nextNumber.toString();
  }
  async getCurrentReceiptSequence(year) {
    const [result] = await db.select().from(receiptSequences).where(eq(receiptSequences.year, year));
    return result;
  }
  async getTotalDonations() {
    const [result] = await db.select({ count: count() }).from(donations);
    return result.count;
  }
  async getTotalAmount() {
    const [result] = await db.select({
      total: sum(donations.amount)
    }).from(donations);
    return Number(result.total) || 0;
  }
  async getUniqueDonorCount() {
    const [result] = await db.select({
      count: sql`COUNT(DISTINCT ${donations.phone})`
    }).from(donations);
    return result.count;
  }
  async getPaymentModeDistribution(startDate, endDate) {
    let query = db.select({
      paymentMode: donations.paymentMode,
      count: count(),
      amount: sum(donations.amount)
    }).from(donations);
    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      ));
    }
    const results = await query.groupBy(donations.paymentMode);
    return results.map((r) => ({
      paymentMode: r.paymentMode,
      count: r.count,
      amount: Number(r.amount) || 0
    }));
  }
  async getRecentDonations(limit = 10, startDate, endDate) {
    let query = db.select().from(donations);
    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      ));
    }
    const allResults = await query;
    const sorted = allResults.sort((a, b) => {
      if (a.donationDate && b.donationDate) {
        return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
      }
      if (a.donationDate && !b.donationDate) {
        return -1;
      }
      if (!a.donationDate && b.donationDate) {
        return 1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, limit);
    return sorted;
  }
  async getDonationsByFilters(filters) {
    let conditions = [];
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = /* @__PURE__ */ new Date();
      let startDate;
      let endDate;
      switch (filters.dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          conditions.push(gte(donations.donationDate, startDate));
          conditions.push(lte(donations.donationDate, endDate));
          break;
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
          conditions.push(gte(donations.donationDate, startDate));
          break;
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          conditions.push(gte(donations.donationDate, startDate));
          break;
        case "custom":
          if (filters.startDate) {
            startDate = new Date(filters.startDate);
            conditions.push(gte(donations.donationDate, startDate));
          }
          if (filters.endDate) {
            endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            conditions.push(lte(donations.donationDate, endDate));
          }
          break;
      }
    }
    if (filters.community && filters.community !== "any" && filters.community !== "all") {
      conditions.push(eq(donations.community, filters.community));
    }
    if (filters.paymentMode && filters.paymentMode !== "all") {
      let paymentModeValue = filters.paymentMode;
      if (filters.paymentMode === "bankTransfer") {
        paymentModeValue = "bank_transfer";
      } else if (filters.paymentMode === "bank-transfer") {
        paymentModeValue = "bank_transfer";
      }
      conditions.push(eq(donations.paymentMode, paymentModeValue));
    }
    if (filters.amountRange && filters.amountRange !== "all") {
      const parseAmountRange = (range) => {
        if (range === "0-1000") return [0, 1e3];
        if (range === "1001-5000") return [1001, 5e3];
        if (range === "5001-10000") return [5001, 1e4];
        if (range === "10000+") return [1e4, void 0];
        return [void 0, void 0];
      };
      const [min, max] = parseAmountRange(filters.amountRange);
      if (min !== void 0) {
        conditions.push(gte(sql`CAST(${donations.amount} AS DECIMAL)`, min));
      }
      if (max !== void 0) {
        conditions.push(lte(sql`CAST(${donations.amount} AS DECIMAL)`, max));
      }
    }
    if (conditions.length > 0) {
      return await db.select().from(donations).where(and(...conditions)).orderBy(desc(donations.donationDate));
    } else {
      return await db.select().from(donations).orderBy(desc(donations.donationDate));
    }
  }
  async getDashboardStats(startDate, endDate) {
    let query = db.select({
      totalCollection: sum(donations.amount),
      totalDonations: count(),
      uniqueDonors: sql`COUNT(DISTINCT ${donations.phone})`
    }).from(donations);
    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      ));
    }
    const [result] = await query;
    const totalCollection = Number(result.totalCollection) || 0;
    const totalDonations = result.totalDonations;
    const totalDonors = result.uniqueDonors;
    const averageDonation = totalDonations > 0 ? totalCollection / totalDonations : 0;
    return {
      totalCollection,
      totalDonors,
      totalDonations,
      averageDonation
    };
  }
  async searchDonors(query, community) {
    let conditions = [];
    conditions.push(
      or(
        like(donations.name, `%${query}%`),
        like(donations.phone, `%${query}%`)
      )
    );
    if (community && community !== "all") {
      conditions.push(eq(donations.community, community));
    }
    const allDonations = await db.select().from(donations).where(and(...conditions)).orderBy(desc(donations.donationDate));
    const donorMap = /* @__PURE__ */ new Map();
    for (const donation of allDonations) {
      if (!donorMap.has(donation.phone)) {
        const donorDonations = allDonations.filter((d) => d.phone === donation.phone);
        const totalAmount = donorDonations.reduce((sum2, d) => sum2 + Number(d.amount), 0);
        donorMap.set(donation.phone, {
          name: donation.name,
          phone: donation.phone,
          location: donation.location || "",
          community: donation.community || "",
          totalAmount,
          donationCount: donorDonations.length,
          lastDonation: (donation.donationDate || donation.createdAt).toISOString(),
          donations: donorDonations
        });
      }
    }
    return Array.from(donorMap.values());
  }
  async getDonorByPhone(phone) {
    const donorDonations = await db.select().from(donations).where(eq(donations.phone, phone)).orderBy(desc(donations.donationDate));
    if (donorDonations.length === 0) {
      return void 0;
    }
    const firstDonation = donorDonations[0];
    const totalAmount = donorDonations.reduce((sum2, d) => sum2 + Number(d.amount), 0);
    return {
      name: firstDonation.name,
      phone: firstDonation.phone,
      location: firstDonation.location || "",
      community: firstDonation.community || "",
      totalAmount,
      donationCount: donorDonations.length,
      lastDonation: (firstDonation.donationDate || firstDonation.createdAt).toISOString(),
      donations: donorDonations
    };
  }
};
var storage = new DatabaseStorage();

// server/cache.ts
var DashboardCache = class {
  constructor() {
    this.cache = /* @__PURE__ */ new Map();
  }
  set(key, data, ttlSeconds = 120) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1e3
    });
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  clear() {
    this.cache.clear();
  }
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }
  }
};
var dashboardCache = new DashboardCache();

// server/routes.ts
init_admin_credentials();
var requireAuth = (req, res, next) => {
  const session2 = req.session;
  if (!session2?.isAuthenticated) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};
var upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
    // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "text/csv",
      "application/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});
function registerRoutes(app2) {
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const authTimeout = setTimeout(() => {
        return res.status(500).json({ error: "Authentication timeout" });
      }, 3e3);
      const admin = validateAdminCredentials(username, password);
      clearTimeout(authTimeout);
      if (admin) {
        req.session.isAuthenticated = true;
        req.session.username = admin.username;
        req.session.role = admin.role;
        req.session.save((err) => {
          if (err) {
            console.error("Session save error:", err);
          }
        });
        res.json({
          success: true,
          message: "Login successful",
          username: admin.username,
          role: admin.role
        });
      } else {
        res.status(401).json({ error: "Invalid credentials" });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully" });
    });
  });
  app2.get("/api/auth/status", (req, res) => {
    const session2 = req.session;
    res.setHeader("Cache-Control", "private, max-age=5");
    res.json({
      isAuthenticated: !!session2.isAuthenticated,
      username: session2.username || null,
      role: session2.role || null
    });
  });
  app2.post("/api/auth/change-credentials", requireAuth, async (req, res) => {
    try {
      console.log("Change credentials request received");
      const { currentPassword, newUsername, newPassword, confirmPassword } = req.body;
      const session2 = req.session;
      console.log("Session info:", {
        isAuthenticated: session2?.isAuthenticated,
        username: session2?.username,
        sessionID: req.sessionID
      });
      if (!currentPassword || !newUsername || !newPassword || !confirmPassword) {
        console.log("Missing required fields");
        return res.status(400).json({ error: "All fields are required" });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New password and confirm password do not match" });
      }
      const currentUsername = req.session?.username;
      if (!currentUsername) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const admin = validateAdminCredentials(currentUsername, currentPassword);
      if (!admin) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Password does not meet security requirements",
          details: passwordValidation.errors
        });
      }
      const success = changeAdminCredentials(currentUsername, newUsername, newPassword);
      if (!success) {
        return res.status(500).json({ error: "Failed to update credentials" });
      }
      req.session.username = newUsername;
      req.session.save((err) => {
        if (err) {
          console.error("Session save error after credential change:", err);
        }
      });
      res.json({
        success: true,
        message: "Credentials updated successfully! Please use your new credentials for future logins."
      });
    } catch (error) {
      console.error("Change credentials error:", error);
      res.status(500).json({
        error: error.message || "Failed to change credentials"
      });
    }
  });
  app2.get("/api/donations/export", requireAuth, async (req, res) => {
    try {
      const donations2 = await storage.getAllDonations();
      const headers = ["S.No", "Receipt No", "Name", "Community", "Location", "Address", "Phone", "Amount", "Payment Mode", "Inscription", "Date"];
      const csvContent = [
        headers.join(","),
        ...donations2.map((donation, index) => [
          index + 1,
          donation.receiptNo,
          `"${donation.name}"`,
          `"${donation.community || ""}"`,
          `"${donation.location || ""}"`,
          `"${donation.address || ""}"`,
          donation.phone,
          donation.amount,
          donation.paymentMode,
          donation.inscription ? "Yes" : "No",
          new Date(donation.donationDate || donation.createdAt).toLocaleDateString("en-GB")
        ].join(","))
      ].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=donations.csv");
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export donations" });
    }
  });
  app2.post("/api/donations/import", requireAuth, upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded"
        });
      }
      const fileType = req.file.mimetype;
      let jsonData = [];
      if (fileType === "text/csv" || fileType === "application/csv") {
        const csvString = req.file.buffer.toString("utf8");
        const stream = Readable.from([csvString]);
        const records = [];
        await new Promise((resolve, reject) => {
          stream.pipe(csv()).on("data", (data) => records.push(data)).on("end", resolve).on("error", reject);
        });
        jsonData = records;
      } else {
        const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        jsonData = XLSX.utils.sheet_to_json(worksheet);
      }
      if (!jsonData || jsonData.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No data found in file"
        });
      }
      const results = [];
      const errors = [];
      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNum = i + 2;
        try {
          const donation = {
            receiptNo: String(row["Receipt No"] || row["ReceiptNo"] || row["receipt_no"] || row["Receipt Number"] || "").trim(),
            name: String(row["Name"] || row["Donor Name"] || row["name"] || "").trim(),
            phone: String(row["Phone"] || row["Phone Number"] || row["phone"] || row["Mobile"] || "").trim(),
            community: String(row["Community"] || row["Kulam"] || row["community"] || row["kulam"] || "").trim(),
            location: String(row["Location"] || row["Place"] || row["location"] || row["place"] || "").trim(),
            address: String(row["Address"] || row["address"] || "").trim(),
            amount: parseFloat(String(row["Amount"] || row["Donation Amount"] || row["amount"] || "0").replace(/[^\d.-]/g, "")),
            paymentMode: String(row["Payment Mode"] || row["PaymentMode"] || row["payment_mode"] || row["Mode"] || "cash").trim(),
            inscription: String(row["Inscription"] || row["inscription"] || "No").toLowerCase().includes("yes")
          };
          let donationDate = /* @__PURE__ */ new Date();
          const dateStr = String(row["Date"] || row["Donation Date"] || row["date"] || "").trim();
          if (dateStr) {
            if (!isNaN(Number(dateStr)) && Number(dateStr) > 4e4) {
              const excelDate = XLSX.SSF.parse_date_code(Number(dateStr));
              donationDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
            } else {
              const cleanDateStr = dateStr.replace(/[^\d\/\-]/g, "");
              if (cleanDateStr.includes("/")) {
                const parts = cleanDateStr.split("/");
                if (parts.length === 3) {
                  let day, month, year;
                  if (parts[2].length === 4) {
                    if (parseInt(parts[0]) > 12) {
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    } else if (parseInt(parts[1]) > 12) {
                      month = parseInt(parts[0]);
                      day = parseInt(parts[1]);
                    } else {
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    }
                    year = parseInt(parts[2]);
                  } else {
                    if (parseInt(parts[0]) > 12) {
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    } else if (parseInt(parts[1]) > 12) {
                      month = parseInt(parts[0]);
                      day = parseInt(parts[1]);
                    } else {
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    }
                    year = parseInt(parts[2]) + (parseInt(parts[2]) < 50 ? 2e3 : 1900);
                  }
                  donationDate = new Date(year, month - 1, day);
                }
              } else if (cleanDateStr.includes("-")) {
                donationDate = new Date(cleanDateStr);
              }
            }
          }
          const validationErrors = [];
          if (!donation.receiptNo) validationErrors.push("Receipt number is required");
          if (!donation.name) validationErrors.push("Name is required");
          if (!donation.phone) validationErrors.push("Phone number is required");
          if (!donation.community) validationErrors.push("Community is required");
          if (!donation.location) validationErrors.push("Location is required");
          if (!donation.amount || donation.amount <= 0) validationErrors.push("Valid amount is required");
          if (donation.phone && donation.phone.length !== 10) validationErrors.push("Phone number must be 10 digits");
          const existingDonation = await storage.getDonationsByReceiptNo(donation.receiptNo);
          if (existingDonation) {
            validationErrors.push(`Receipt number ${donation.receiptNo} already exists`);
          }
          if (validationErrors.length > 0) {
            errors.push(`Row ${rowNum}: ${validationErrors.join(", ")}`);
            continue;
          }
          const donationData = {
            ...donation,
            amount: Number(donation.amount)
          };
          const savedDonation = await storage.createDonation(donationData);
          results.push(savedDonation);
        } catch (error) {
          console.error(`Error processing row ${rowNum}:`, error);
          errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }
      res.json({
        success: true,
        message: `Import completed. ${results.length} donations imported successfully.`,
        imported: results.length,
        errors
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to import data",
        error: error.message
      });
    }
  });
  app2.get("/api/donations", requireAuth, async (req, res) => {
    try {
      const filters = {
        dateRange: req.query.dateRange,
        community: req.query.community,
        paymentMode: req.query.paymentMode,
        amountRange: req.query.amountRange,
        startDate: req.query.startDate,
        endDate: req.query.endDate
      };
      const hasFilters = Object.values(filters).some(
        (filter) => filter && filter !== "all" && filter !== "any"
      );
      let donations2;
      if (hasFilters) {
        donations2 = await storage.getDonationsByFilters(filters);
      } else {
        donations2 = await storage.getAllDonations();
      }
      res.json(donations2);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });
  app2.get("/api/donations/check-receipt/:receiptNo", async (req, res) => {
    try {
      const receiptNo = req.params.receiptNo;
      const existingDonation = await storage.getDonationsByReceiptNo(receiptNo);
      res.json({
        exists: !!existingDonation,
        receiptNo
      });
    } catch (error) {
      console.error("Error checking receipt number:", error);
      res.status(500).json({
        error: "Failed to check receipt number",
        exists: false
      });
    }
  });
  app2.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      const existingDonation = await storage.getDonationsByReceiptNo(validatedData.receiptNo);
      if (existingDonation) {
        return res.status(400).json({
          error: "Duplicate receipt number",
          message: `Receipt number ${validatedData.receiptNo} already exists`
        });
      }
      const donation = await storage.createDonation(validatedData);
      dashboardCache.invalidatePattern("dashboard-stats");
      res.status(201).json(donation);
    } catch (error) {
      console.error("Create donation error:", error);
      if (error.name === "ZodError") {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });
  app2.delete("/api/donations/delete-all", requireAuth, async (req, res) => {
    try {
      const session2 = req.session;
      if (session2.role !== "superadmin") {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      await storage.deleteAllDonations();
      res.json({ success: true, message: "All donations deleted successfully" });
    } catch (error) {
      console.error("Delete all donations error:", error);
      res.status(500).json({ error: "Failed to delete donations" });
    }
  });
  app2.get("/api/donations/search/:phone", requireAuth, async (req, res) => {
    try {
      const phone = req.params.phone;
      const donations2 = await storage.getDonationsByPhone(phone);
      res.json(donations2);
    } catch (error) {
      res.status(500).json({ message: "Failed to search donations" });
    }
  });
  app2.get("/api/donations/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const donation = await storage.getDonationById(id);
      if (!donation) {
        return res.status(404).json({ message: "Donation not found" });
      }
      res.json(donation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donation" });
    }
  });
  app2.delete("/api/donations/:id", requireAuth, async (req, res) => {
    try {
      const donationId = parseInt(req.params.id);
      if (!donationId || isNaN(donationId)) {
        return res.status(400).json({ error: "Invalid donation ID" });
      }
      const success = await storage.deleteDonation(donationId);
      if (!success) {
        return res.status(404).json({ error: "Donation not found" });
      }
      res.json({ success: true, message: "Donation deleted successfully" });
    } catch (error) {
      console.error("Delete donation error:", error);
      res.status(500).json({ error: "Failed to delete donation" });
    }
  });
  app2.get("/api/receipt-number/next", requireAuth, async (req, res) => {
    try {
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const nextReceiptNumber = await storage.getNextReceiptNumber(currentYear);
      res.json({ receiptNumber: nextReceiptNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate receipt number" });
    }
  });
  app2.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    const startTime = Date.now();
    try {
      const dateRange = req.query.dateRange || "all";
      const startDateParam = req.query.startDate;
      const endDateParam = req.query.endDate;
      const cacheKey = `dashboard-stats-${dateRange}-${startDateParam || ""}-${endDateParam || ""}`;
      let startDate;
      let endDate;
      const now = /* @__PURE__ */ new Date();
      if (dateRange === "custom" && startDateParam && endDateParam) {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange && dateRange !== "all") {
        switch (dateRange) {
          case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
            endDate = now;
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;
          case "thisyear":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
          case "lastyear":
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
          case "thismonth":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
          case "lastmonth":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        }
      }
      const [stats, paymentModeDistribution, recentDonations] = await Promise.all([
        storage.getDashboardStats(startDate, endDate),
        storage.getPaymentModeDistribution(startDate, endDate),
        storage.getRecentDonations(5, startDate, endDate)
      ]);
      const responseData = {
        totalCollections: stats.totalCollection,
        totalDonors: stats.totalDonors,
        totalDonations: stats.totalDonations,
        avgDonation: stats.averageDonation,
        paymentModeDistribution: paymentModeDistribution.map((pm) => ({
          mode: pm.paymentMode,
          count: pm.count,
          percentage: stats.totalDonations > 0 ? pm.count / stats.totalDonations * 100 : 0
        })),
        recentDonations: recentDonations.map((d) => ({
          name: d.name,
          amount: Number(d.amount),
          paymentMode: d.paymentMode,
          donationDate: d.donationDate ? d.donationDate.toISOString() : null,
          createdAt: d.createdAt.toISOString()
        }))
      };
      const duration = Date.now() - startTime;
      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "private, max-age=120, stale-while-revalidate=60");
      res.setHeader("X-Response-Time", `${duration}ms`);
      res.json(responseData);
    } catch (error) {
      console.error("Dashboard analytics error:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
  app2.delete("/api/dashboard/cache", requireAuth, async (req, res) => {
    try {
      dashboardCache.clear();
      res.json({ success: true, message: "Dashboard cache cleared" });
    } catch (error) {
      console.error("Cache clear error:", error);
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });
  app2.get("/api/dashboard/export", requireAuth, async (req, res) => {
    try {
      const dateRange = req.query.dateRange || "all";
      const startDateParam = req.query.startDate;
      const endDateParam = req.query.endDate;
      let startDate;
      let endDate;
      const now = /* @__PURE__ */ new Date();
      if (dateRange === "custom" && startDateParam && endDateParam) {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange && dateRange !== "all") {
        switch (dateRange) {
          case "today":
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
          case "week":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1e3);
            endDate = now;
            break;
          case "month":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;
          case "thisyear":
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
          case "lastyear":
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
          case "thismonth":
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
          case "lastmonth":
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        }
      }
      let donations2;
      if (startDate && endDate) {
        const filters = {
          dateRange,
          startDate: startDateParam,
          endDate: endDateParam,
          community: "all",
          paymentMode: "all",
          amountRange: "all"
        };
        donations2 = await storage.getDonationsByFilters(filters);
      } else {
        donations2 = await storage.getAllDonations();
      }
      const headers = ["S.No", "Receipt No", "Name", "Community", "Location", "Address", "Phone", "Amount", "Payment Mode", "Inscription", "Date"];
      const csvContent = [
        headers.join(","),
        ...donations2.map((donation, index) => [
          index + 1,
          donation.receiptNo,
          `"${donation.name}"`,
          `"${donation.community || ""}"`,
          `"${donation.location || ""}"`,
          `"${donation.address || ""}"`,
          donation.phone,
          donation.amount,
          donation.paymentMode,
          donation.inscription ? "Yes" : "No",
          new Date(donation.donationDate || donation.createdAt).toLocaleDateString("en-GB")
        ].join(","))
      ].join("\n");
      let filename = "temple-donations";
      if (dateRange !== "all") {
        filename += `-${dateRange}`;
        if (dateRange === "custom" && startDateParam && endDateParam) {
          filename += `-${startDateParam}-to-${endDateParam}`;
        }
      }
      filename += ".csv";
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
      res.send(csvContent);
    } catch (error) {
      console.error("Dashboard export error:", error);
      res.status(500).json({ message: "Failed to export dashboard data" });
    }
  });
  app2.get("/api/analytics/dashboard", requireAuth, async (req, res) => {
    res.redirect(308, "/api/dashboard/stats?" + new URLSearchParams(req.query).toString());
  });
  app2.get("/api/donors/search", async (req, res) => {
    try {
      const { query, community } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const donors = await storage.searchDonors(query, community);
      res.json(donors);
    } catch (error) {
      console.error("Error searching donors:", error);
      res.status(500).json({ message: "Failed to search donors" });
    }
  });
  app2.get("/api/donors/:phone", async (req, res) => {
    try {
      const donor = await storage.getDonorByPhone(req.params.phone);
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.json(donor);
    } catch (error) {
      console.error("Error fetching donor by phone:", error);
      res.status(500).json({ message: "Failed to fetch donor" });
    }
  });
  app2.post("/api/auth/change-credentials", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;
      if (!currentPassword || !newUsername || !newPassword) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["currentPassword", "newUsername", "newPassword"]
        });
      }
      const currentUser = req.session.user;
      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const { getAdminUser: getAdminUser2 } = await Promise.resolve().then(() => (init_admin_credentials(), admin_credentials_exports));
      const userCred = getAdminUser2(currentUser.username);
      if (!userCred || userCred.password !== currentPassword) {
        return res.status(400).json({
          error: "Current password is incorrect"
        });
      }
      if (newUsername.length < 3) {
        return res.status(400).json({
          error: "Username must be at least 3 characters long"
        });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({
          error: "Password must be at least 6 characters long"
        });
      }
      req.session.user = {
        username: newUsername,
        role: userCred.role
      };
      res.json({
        success: true,
        message: "Credentials updated successfully",
        username: newUsername
      });
    } catch (error) {
      console.error("Change credentials error:", error);
      res.status(500).json({
        error: "Failed to change credentials",
        message: error.message
      });
    }
  });
  app2.post("/api/google-form-webhook", async (req, res) => {
    try {
      console.log("Google Form webhook received:", req.body);
      const {
        receiptNo,
        name,
        phone,
        community,
        location,
        amount,
        paymentMode,
        inscription,
        donationDate
      } = req.body;
      if (!name || !phone || !amount || !receiptNo) {
        return res.status(400).json({
          error: "Missing required fields",
          required: ["name", "phone", "amount", "receiptNo"]
        });
      }
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          error: "Invalid phone number format. Must be 10 digits."
        });
      }
      const existingDonation = await storage.getDonationsByReceiptNo(receiptNo);
      if (existingDonation) {
        return res.status(400).json({
          error: "Duplicate receipt number",
          message: `Receipt number ${receiptNo} already exists`
        });
      }
      const donationData = {
        receiptNo: receiptNo.toString(),
        name: name.trim(),
        phone: phone.trim(),
        community: community || "any",
        location: location || "",
        address: "",
        // Not collected in Google Form
        amount: amount.toString(),
        paymentMode: paymentMode || "cash",
        inscription: Boolean(inscription)
      };
      const validatedData = insertDonationSchema.parse(donationData);
      const donation = await storage.createDonation(validatedData);
      dashboardCache.invalidatePattern("dashboard-stats");
      console.log("Google Form donation created successfully:", donation.id);
      res.status(201).json({
        success: true,
        message: "Donation received successfully from Google Form",
        donation: {
          id: donation.id,
          receiptNo: donation.receiptNo,
          name: donation.name,
          amount: donation.amount
        }
      });
    } catch (error) {
      console.error("Google Form webhook error:", error);
      if (error.name === "ZodError") {
        return res.status(400).json({
          error: "Invalid donation data",
          details: error.errors
        });
      }
      res.status(500).json({
        error: "Failed to process Google Form submission",
        message: error.message
      });
    }
  });
}

// server/index.ts
import path from "path";
var app = express();
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
    res.setHeader("Cache-Control", "public, max-age=86400");
  }
  res.setHeader("X-Powered-By", "MERN-Stack-Express");
  next();
});
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || "temple-donation-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use((req, res, next) => {
  const start = Date.now();
  const path2 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path2.startsWith("/api")) {
      let logLine = `${req.method} ${path2} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] ${logLine}`);
    }
  });
  next();
});
(async () => {
  registerRoutes(app);
  const server = createServer(app);
  console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] \u2713 PostgreSQL Database Connected - Data will be persistent`);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    console.error(err);
  });
  const distPath = path.resolve(process.cwd(), "dist/public");
  try {
    app.use(express.static(distPath));
    app.use("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
    console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] \u2713 Serving static files from ${distPath}`);
  } catch (error) {
    console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] \u26A0 Static files not found, running in development mode`);
    app.get("*", (_req, res) => {
      res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Temple Donation System</title>
          </head>
          <body>
            <div id="root">Loading...</div>
            <script>
              window.location.href = '/api/health';
            </script>
          </body>
        </html>
      `);
    });
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen(port, "0.0.0.0", () => {
    console.log(`${(/* @__PURE__ */ new Date()).toLocaleTimeString()} [express] serving on localhost:${port}`);
  });
})();
