import { donations, receiptSequences, type Donation, type InsertDonation, type ReceiptSequence } from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, lte, and, sql, count, sum, or, like } from "drizzle-orm";

export interface IStorage {
  // Donations
  createDonation(donation: InsertDonation): Promise<Donation>;
  getAllDonations(): Promise<Donation[]>;
  getDonationById(id: number): Promise<Donation | undefined>;
  getDonationsByPhone(phone: string): Promise<Donation[]>;
  getDonationsByDateRange(startDate: Date, endDate: Date): Promise<Donation[]>;
  getDonationsByReceiptNo(receiptNo: string): Promise<Donation | undefined>;
  getDonationsByFilters(filters: {
    dateRange?: string;
    community?: string;
    paymentMode?: string;
    amountRange?: string;
    startDate?: string;
    endDate?: string;
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
  getPaymentModeDistribution(): Promise<Array<{ paymentMode: string; count: number; amount: number }>>;
  getRecentDonations(limit: number): Promise<Donation[]>;
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
    let sequence = await this.getCurrentReceiptSequence(year);
    
    if (!sequence) {
      // Create new sequence for the year
      const [newSequence] = await db.insert(receiptSequences)
        .values({ year, lastReceiptNumber: 1 })
        .returning();
      return "1";
    }

    // Increment and update
    const nextNumber = sequence.lastReceiptNumber + 1;
    await db.update(receiptSequences)
      .set({ lastReceiptNumber: nextNumber })
      .where(eq(receiptSequences.year, year));

    return nextNumber.toString();
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
    const [result] = await db.select({ 
      total: sum(donations.amount)
    }).from(donations);
    return Number(result.total) || 0;
  }

  async getUniqueDonorCount(): Promise<number> {
    const [result] = await db.select({ 
      count: sql<number>`COUNT(DISTINCT ${donations.phone})`
    }).from(donations);
    return result.count;
  }

  async getPaymentModeDistribution(startDate?: Date, endDate?: Date): Promise<Array<{ paymentMode: string; count: number; amount: number }>> {
    let query = db.select({
      paymentMode: donations.paymentMode,
      count: count(),
      amount: sum(donations.amount)
    })
    .from(donations);

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
    // Get all donations first, then sort properly
    let query = db.select().from(donations);

    if (startDate && endDate) {
      query = query.where(and(
        gte(donations.donationDate, startDate),
        lte(donations.donationDate, endDate)
      )) as any;
    }

    const allResults = await query;
    
    // Sort properly: donations with dates first (by donation date desc), then null dates (by created_at desc)
    const sorted = allResults.sort((a, b) => {
      // If both have donation dates, sort by donation date desc
      if (a.donationDate && b.donationDate) {
        return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
      }
      // If only a has donation date, a comes first
      if (a.donationDate && !b.donationDate) {
        return -1;
      }
      // If only b has donation date, b comes first
      if (!a.donationDate && b.donationDate) {
        return 1;
      }
      // If both are null, sort by created_at desc
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }).slice(0, limit);
    
    return sorted;
  }

  async getDonationsByFilters(filters: {
    dateRange?: string;
    community?: string;
    paymentMode?: string;
    amountRange?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<Donation[]> {
    let conditions: any[] = [];

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      let startDate: Date;
      let endDate: Date | undefined;

      switch (filters.dateRange) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
          conditions.push(gte(donations.donationDate, startDate));
          conditions.push(lte(donations.donationDate, endDate));
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
            endDate.setHours(23, 59, 59, 999); // End of day
            conditions.push(lte(donations.donationDate, endDate));
          }
          break;
      }
    }

    // Community filter
    if (filters.community && filters.community !== 'any' && filters.community !== 'all') {
      conditions.push(eq(donations.community, filters.community));
    }

    // Payment mode filter
    if (filters.paymentMode && filters.paymentMode !== 'all') {
      // Handle both frontend values and database values
      let paymentModeValue = filters.paymentMode;
      if (filters.paymentMode === 'bankTransfer') {
        paymentModeValue = 'bank_transfer';
      } else if (filters.paymentMode === 'bank-transfer') {
        paymentModeValue = 'bank_transfer';
      }
      conditions.push(eq(donations.paymentMode, paymentModeValue));
    }

    // Amount range filter
    if (filters.amountRange && filters.amountRange !== 'all') {
      const parseAmountRange = (range: string): [number?, number?] => {
        if (range === '0-1000') return [0, 1000];
        if (range === '1001-5000') return [1001, 5000];
        if (range === '5001-10000') return [5001, 10000];
        if (range === '10000+') return [10000, undefined];
        return [undefined, undefined];
      };

      const [min, max] = parseAmountRange(filters.amountRange);
      if (min !== undefined) {
        conditions.push(gte(sql`CAST(${donations.amount} AS DECIMAL)`, min));
      }
      if (max !== undefined) {
        conditions.push(lte(sql`CAST(${donations.amount} AS DECIMAL)`, max));
      }
    }

    // Build the query
    if (conditions.length > 0) {
      return await db.select().from(donations)
        .where(and(...conditions))
        .orderBy(desc(donations.donationDate));
    } else {
      return await db.select().from(donations)
        .orderBy(desc(donations.donationDate));
    }
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

    return {
      totalCollection,
      totalDonors,
      totalDonations,
      averageDonation
    };
  }

  async searchDonors(query: string, community?: string): Promise<DonorSummary[]> {
    let conditions: any[] = [];

    // Search by name or phone
    conditions.push(
      or(
        like(donations.name, `%${query}%`),
        like(donations.phone, `%${query}%`)
      )
    );

    // Filter by community if specified
    if (community && community !== 'all') {
      conditions.push(eq(donations.community, community));
    }

    const allDonations = await db.select().from(donations)
      .where(and(...conditions))
      .orderBy(desc(donations.donationDate));

    // Group by phone number to get unique donors
    const donorMap = new Map<string, DonorSummary>();

    for (const donation of allDonations) {
      if (!donorMap.has(donation.phone)) {
        const donorDonations = allDonations.filter(d => d.phone === donation.phone);
        const totalAmount = donorDonations.reduce((sum, d) => sum + Number(d.amount), 0);

        donorMap.set(donation.phone, {
          name: donation.name,
          phone: donation.phone,
          location: donation.location || '',
          community: donation.community || '',
          totalAmount,
          donationCount: donorDonations.length,
          lastDonation: (donation.donationDate || donation.createdAt).toISOString(),
          donations: donorDonations
        });
      }
    }

    return Array.from(donorMap.values());
  }

  async getDonorByPhone(phone: string): Promise<DonorSummary | undefined> {
    const donorDonations = await db.select().from(donations)
      .where(eq(donations.phone, phone))
      .orderBy(desc(donations.donationDate));

    if (donorDonations.length === 0) {
      return undefined;
    }

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