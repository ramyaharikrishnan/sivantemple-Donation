import { donations, receiptSequences, type Donation, type InsertDonation, type ReceiptSequence } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, and, sql, count, sum, or, like } from "drizzle-orm";

export interface IStorage {
  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  updateDonation(id: number, donation: Partial<InsertDonation>): Promise<Donation | undefined>; // ⭐ NEW
  getAllDonations(): Promise<Donation[]>;
  getDonationById(id: number): Promise<Donation | undefined>;
  getDonationsByPhone(phone: string): Promise<Donation[]>;
  getDonationsByDateRange(startDate: Date, endDate: Date): Promise<Donation[]>;
  getDonationsByReceiptNo(receiptNo: string): Promise<Donation | undefined>;
  getDonationsByFilters(filters: {
    dateRange?: string;
    paymentMode?: string;
    startDate?: string;
    endDate?: string;
    phone?: string;
    receiptNo?: string;
  }): Promise<Donation[]>;
  deleteDonation(id: number): Promise<boolean>;
  deleteAllDonations(): Promise<void>;

  // Receipt sequences
  getNextReceiptNumber(year: number): Promise<string>;
  getCurrentReceiptSequence(year: number): Promise<ReceiptSequence | undefined>;

  // Analytics
  getTotalDonations(): Promise<number>;
  getTotalAmount(): Promise<number>;
  getUniqueDonorCount(): Promise<number>;
  getPaymentModeDistribution(startDate?: Date, endDate?: Date): Promise<Array<{ paymentMode: string; count: number; amount: number }>>;
  getRecentDonations(limit: number, startDate?: Date, endDate?: Date): Promise<Donation[]>;
  getDashboardStats(startDate?: Date, endDate?: Date): Promise<{
    totalCollection: number;
    totalDonors: number;
    totalDonations: number;
    averageDonation: number;
  }>;

  // Donor search
  searchDonors(query: string, community?: string): Promise<DonorSummary[]>;
  getDonorByPhone(phone: string): Promise<DonorSummary | undefined>;
}

export interface DonorSummary {
  name: string;
  phone: string;
  location: string;
  community: string;
  totalAmount: number;
  donationCount: number;
  lastDonation: string;
  donations: Donation[];
}

export class DatabaseStorage implements IStorage {
  async createDonation(donation: InsertDonation): Promise<Donation> {
    const [result] = await db.insert(donations).values(donation).returning();
    return result;
  }
  // ✅ REQUIRED FIX
  async updateDonation(
    id: number,
    donation: Partial<InsertDonation>
  ): Promise<Donation | undefined> {
    const [updated] = await db
      .update(donations)
      .set(donation) // ❌ NO updatedAt here
      .where(eq(donations.id, id))
      .returning();

    return updated;
  }

  async getAllDonations(): Promise<Donation[]> {
    return await db.select().from(donations).orderBy(desc(donations.donationDate));
  }

  async getDonationById(id: number): Promise<Donation | undefined> {
    const [result] = await db.select().from(donations).where(eq(donations.id, id));
    return result;
  }

  async getDonationsByPhone(phone: string): Promise<Donation[]> {
    return await db.select().from(donations)
      .where(eq(donations.phone, phone))
      .orderBy(desc(donations.donationDate));
  }

  async getDonationsByDateRange(startDate: Date, endDate: Date): Promise<Donation[]> {
    return await db.select().from(donations)
      .where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      ))
      .orderBy(desc(donations.donationDate));
  }

  async getDonationsByReceiptNo(receiptNo: string): Promise<Donation | undefined> {
    const [result] = await db.select().from(donations).where(eq(donations.receiptNo, receiptNo));
    return result;
  }

  async deleteDonation(id: number): Promise<boolean> {
    const result = await db.delete(donations).where(eq(donations.id, id));
    return (result.rowCount || 0) > 0;
  }

  async deleteAllDonations(): Promise<void> {
    await db.delete(donations);
    await db.delete(receiptSequences);
  }

  async getNextReceiptNumber(year: number): Promise<string> {
  return await db.transaction(async (tx) => {
    // Try to get the sequence
    const [sequence] = await tx.select().from(receiptSequences).where(eq(receiptSequences.year, year));

    let nextNumber: number;

    if (!sequence) {
      // Create new sequence
      const [newSeq] = await tx.insert(receiptSequences)
        .values({ year, lastReceiptNumber: 1 })
        .returning();
      nextNumber = 1;
    } else {
      // Increment and update atomically
      const [updated] = await tx.update(receiptSequences)
        .set({ lastReceiptNumber: sequence.lastReceiptNumber + 1 })
        .where(eq(receiptSequences.year, year))
        .returning();
      nextNumber = updated.lastReceiptNumber;
    }

    return nextNumber.toString().padStart(4, "0");
  });
}

  async getCurrentReceiptSequence(year: number): Promise<ReceiptSequence | undefined> {
    const [result] = await db.select().from(receiptSequences).where(eq(receiptSequences.year, year));
    return result;
  }

  async getTotalDonations(): Promise<number> {
    const [result] = await db.select({ count: count() }).from(donations);
    return result.count;
  }

  async getTotalAmount(): Promise<number> {
    const [result] = await db.select({ total: sum(donations.amount) }).from(donations);
    return Number(result.total) || 0;
  }

  async getUniqueDonorCount(): Promise<number> {
    const [result] = await db.select({ count: sql<number>`COUNT(DISTINCT ${donations.phone})` }).from(donations);
    return result.count;
  }

  async getPaymentModeDistribution(startDate?: Date, endDate?: Date): Promise<Array<{ paymentMode: string; count: number; amount: number }>> {
    let query = db.select({
      paymentMode: donations.paymentMode,
      count: count(),
      amount: sum(donations.amount)
    }).from(donations);

    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      )) as any;
    }

    const results = await query.groupBy(donations.paymentMode);
    return results.map(r => ({
      paymentMode: r.paymentMode,
      count: r.count,
      amount: Number(r.amount) || 0
    }));
  }

  async getRecentDonations(limit: number = 10, startDate?: Date, endDate?: Date): Promise<Donation[]> {
    let query = db.select().from(donations);
    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      )) as any;
    }

    return await query
      .orderBy(desc(donations.donationDate))
      .limit(limit);
  }

  async getDonationsByFilters(filters: {
    dateRange?: string;
    paymentMode?: string;
    startDate?: string;
    endDate?: string;
    phone?: string;
    receiptNo?: string;
  }): Promise<Donation[]> {
    const conditions: any[] = [];

    // Date filters
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
          conditions.push(gte(donations.donationDate, startDate), lte(donations.donationDate, endDate));
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          conditions.push(gte(donations.donationDate, startDate));
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          conditions.push(gte(donations.donationDate, startDate));
          break;
        case 'custom':
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

    // Payment mode
    if (filters.paymentMode && filters.paymentMode !== 'all') {
      let pm = filters.paymentMode;
      if (pm === 'bankTransfer' || pm === 'bank-transfer') pm = 'bank_transfer';
      conditions.push(eq(donations.paymentMode, pm));
    }

    // Phone & receipt partial match
    if (filters.phone) conditions.push(like(donations.phone, `%${filters.phone}%`));
    if (filters.receiptNo) conditions.push(like(donations.receiptNo, `%${filters.receiptNo}%`));

    if (conditions.length > 0) {
      return await db.select().from(donations)
        .where(and(...conditions))
        .orderBy(desc(donations.donationDate));
    }

    return await db.select().from(donations)
      .orderBy(desc(donations.donationDate));
  }

  async getDashboardStats(startDate?: Date, endDate?: Date): Promise<{
    totalCollection: number;
    totalDonors: number;
    totalDonations: number;
    averageDonation: number;
  }> {
    let query = db.select({
      totalCollection: sum(donations.amount),
      totalDonations: count(),
      uniqueDonors: sql<number>`COUNT(DISTINCT ${donations.phone})`
    }).from(donations);

    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      )) as any;
    }

    const [result] = await query;
    const totalCollection = Number(result.totalCollection) || 0;
    const totalDonations = result.totalDonations;
    const totalDonors = result.uniqueDonors;
    const averageDonation = totalDonations > 0 ? totalCollection / totalDonations : 0;

    return { totalCollection, totalDonors, totalDonations, averageDonation };
  }

  async searchDonors(query: string, community?: string): Promise<DonorSummary[]> {
    const conditions: any[] = [or(
      like(donations.name, `%${query}%`),
      like(donations.phone, `%${query}%`)
    )];
    if (community && community !== 'all') conditions.push(eq(donations.community, community));

    const allDonations = await db.select().from(donations)
      .where(and(...conditions))
      .orderBy(desc(donations.donationDate));

    const donorMap = new Map<string, DonorSummary>();

    // Group donations by phone
    const grouped: Record<string, Donation[]> = {};
    for (const d of allDonations) {
      grouped[d.phone] = grouped[d.phone] || [];
      grouped[d.phone].push(d);
    }

    for (const [phone, donationsList] of Object.entries(grouped)) {
      const lastDonation = donationsList[0];
      const totalAmount = donationsList.reduce((sum, d) => sum + Number(d.amount), 0);

      donorMap.set(phone, {
        name: lastDonation.name,
        phone,
        location: lastDonation.location || '',
        community: lastDonation.community || '',
        totalAmount,
        donationCount: donationsList.length,
        lastDonation: (lastDonation.donationDate || lastDonation.createdAt).toISOString(),
        donations: donationsList
      });
    }

    return Array.from(donorMap.values());
  }

  async getDonorByPhone(phone: string): Promise<DonorSummary | undefined> {
    const donorDonations = await db.select().from(donations)
      .where(eq(donations.phone, phone))
      .orderBy(desc(donations.donationDate));

    if (!donorDonations.length) return undefined;

    const firstDonation = donorDonations[0];
    const totalAmount = donorDonations.reduce((sum, d) => sum + Number(d.amount), 0);

    return {
      name: firstDonation.name,
      phone: firstDonation.phone,
      location: firstDonation.location || '',
      community: firstDonation.community || '',
      totalAmount,
      donationCount: donorDonations.length,
      lastDonation: (firstDonation.donationDate || firstDonation.createdAt).toISOString(),
      donations: donorDonations
    };
  }
}

export const storage = new DatabaseStorage();
