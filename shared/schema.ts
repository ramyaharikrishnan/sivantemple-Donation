import { pgTable, serial, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Donations table
export const donations = pgTable("donations", {
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
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Receipt sequences table
export const receiptSequences = pgTable("receiptSequences", {
  id: serial("id").primaryKey(),
  year: integer("year").notNull().unique(),
  lastReceiptNumber: integer("lastReceiptNumber").notNull().default(0),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// Types
export type Donation = typeof donations.$inferSelect;
export type InsertDonation = typeof donations.$inferInsert;
export type ReceiptSequence = typeof receiptSequences.$inferSelect;

// Schemas
export const insertDonationSchema = createInsertSchema(donations, {
  receiptNo: z.string().min(1, "Receipt number is required"),
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  community: z.enum(["any", "payiran", "chozhan", "pandiyan", "othaalan", "vizhiyan", "aadai", "aavan", "odhaalan", "semban"]),
  location: z.string().min(1, "Location is required"),
  address: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  paymentMode: z.enum(["cash", "card", "upi", "bankTransfer", "cheque"]),
  inscription: z.boolean().default(false),
  donationDate: z.coerce.date().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const selectDonationSchema = createSelectSchema(donations);