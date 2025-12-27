import { Express } from "express";
import multer from "multer";
import * as XLSX from 'xlsx';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { storage } from "./storage";
import { dashboardCache } from "./cache";
import { validateAdminCredentials, changeAdminCredentials, validatePasswordStrength } from "./admin-credentials";
import { insertDonationSchema } from "@shared/schema";

const requireAuth = (req: any, res: any, next: any) => {
  const session = req.session as any;
  if (!session?.isAuthenticated) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv', 
      'application/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  }
});

export function registerRoutes(app: Express) {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Fast authentication with 3-second timeout
      const authTimeout = setTimeout(() => {
        return res.status(500).json({ error: "Authentication timeout" });
      }, 3000);

      const admin = validateAdminCredentials(username, password);
      clearTimeout(authTimeout);
      
      if (admin) {
        (req.session as any).isAuthenticated = true;
        (req.session as any).username = admin.username;
        (req.session as any).role = admin.role;
        
        // Immediate session save for fast login
        req.session.save((err: any) => {
          if (err) {
            console.error('Session save error:', err);
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
      console.error('Login error:', error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.clearCookie('connect.sid');
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/status", (req, res) => {
    const session = req.session as any;
    
    // Fast auth status with caching for better performance
    res.setHeader('Cache-Control', 'private, max-age=5'); // 5 second cache
    res.json({
      isAuthenticated: !!session.isAuthenticated,
      username: session.username || null,
      role: session.role || null
    });
  });

  // Change admin credentials
  app.post("/api/auth/change-credentials", requireAuth, async (req, res) => {
    try {
      console.log('Change credentials request received');
      const { currentPassword, newUsername, newPassword, confirmPassword } = req.body;
      
      // Debug session info
      const session = req.session as any;
      console.log('Session info:', { 
        isAuthenticated: session?.isAuthenticated, 
        username: session?.username,
        sessionID: req.sessionID 
      });
      
      // Validate input
      if (!currentPassword || !newUsername || !newPassword || !confirmPassword) {
        console.log('Missing required fields');
        return res.status(400).json({ error: "All fields are required" });
      }
      
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New password and confirm password do not match" });
      }
      
      // Validate current password
      const currentUsername = (req.session as any)?.username;
      if (!currentUsername) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const admin = validateAdminCredentials(currentUsername, currentPassword);
      if (!admin) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }
      
      // Validate new password strength
      const passwordValidation = validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: "Password does not meet security requirements",
          details: passwordValidation.errors
        });
      }
      
      // Change credentials
      const success = changeAdminCredentials(currentUsername, newUsername, newPassword);
      if (!success) {
        return res.status(500).json({ error: "Failed to update credentials" });
      }
      
      // Update session with new username
      (req.session as any).username = newUsername;
      req.session.save((err: any) => {
        if (err) {
          console.error('Session save error after credential change:', err);
        }
      });
      
      res.json({ 
        success: true, 
        message: "Credentials updated successfully! Please use your new credentials for future logins."
      });
    } catch (error: any) {
      console.error('Change credentials error:', error);
      res.status(500).json({ 
        error: error.message || "Failed to change credentials"
      });
    }
  });

  // Export donations as CSV (must be before /:id route)
  app.get("/api/donations/export", requireAuth, async (req, res) => {
    try {
      const donations = await storage.getAllDonations();
      
      // Create CSV content
      const headers = ['S.No', 'Receipt No', 'Name', 'Community', 'Location', 'Address', 'Phone', 'Amount', 'Payment Mode', 'Inscription', 'Date'];
      const csvContent = [
        headers.join(','),
        ...donations.map((donation, index) => [
          index + 1,
          donation.receiptNo,
          `"${donation.name}"`,
          `"${donation.community || ''}"`,
          `"${donation.location || ''}"`,
          `"${(donation as any).address || ''}"`,
          donation.phone,
          donation.amount,
          donation.paymentMode,
          donation.inscription ? 'Yes' : 'No',
          new Date(donation.donationDate || donation.createdAt).toLocaleDateString('en-GB')
        ].join(','))
      ].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=donations.csv');
      res.send(csvContent);
    } catch (error) {
      res.status(500).json({ message: "Failed to export donations" });
    }
  });

  // Import donations from CSV or Excel (protected admin route)
  app.post("/api/donations/import", requireAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "No file uploaded" 
        });
      }

      const fileType = req.file.mimetype;
      let jsonData: any[] = [];

      if (fileType === 'text/csv' || fileType === 'application/csv') {
        // Handle CSV files
        const csvString = req.file.buffer.toString('utf8');
        const stream = Readable.from([csvString]);
        
        const records: any[] = [];
        await new Promise((resolve, reject) => {
          stream
            .pipe(csv())
            .on('data', (data) => records.push(data))
            .on('end', resolve)
            .on('error', reject);
        });
        
        jsonData = records;
      } else {
        // Handle Excel files (.xlsx, .xls)
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
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

      // Process and validate data
      const results = [];
      const errors = [];

      for (let i = 0; i < jsonData.length; i++) {
        const row = jsonData[i];
        const rowNum = i + 2; // Adding 2 because of 0-based index + header row

        try {
          // Map flexible headers to our expected format
          const donation = {
            receiptNo: String(row['Receipt No'] || row['ReceiptNo'] || row['receipt_no'] || row['Receipt Number'] || '').trim(),
            name: String(row['Name'] || row['Donor Name'] || row['name'] || '').trim(),
            phone: String(row['Phone'] || row['Phone Number'] || row['phone'] || row['Mobile'] || '').trim(),
            community: String(row['Community'] || row['Kulam'] || row['community'] || row['kulam'] || '').trim(),
            location: String(row['Location'] || row['Place'] || row['location'] || row['place'] || '').trim(),
            address: String(row['Address'] || row['address'] || '').trim(),
            amount: parseFloat(String(row['Amount'] || row['Donation Amount'] || row['amount'] || '0').replace(/[^\d.-]/g, '')),
            paymentMode: String(row['Payment Mode'] || row['PaymentMode'] || row['payment_mode'] || row['Mode'] || 'cash').trim(),
            inscription: String(row['Inscription'] || row['inscription'] || 'No').toLowerCase().includes('yes')
          };

          // Enhanced date parsing with multiple format support
          let donationDate = new Date();
          const dateStr = String(row['Date'] || row['Donation Date'] || row['date'] || '').trim();
          
          if (dateStr) {
            // Handle Excel serial dates
            if (!isNaN(Number(dateStr)) && Number(dateStr) > 40000) {
              try {
                // Try using XLSX.SSF.parse_date_code if available
                if (XLSX.SSF && XLSX.SSF.parse_date_code) {
                  const excelDate = XLSX.SSF.parse_date_code(Number(dateStr));
                  donationDate = new Date(excelDate.y, excelDate.m - 1, excelDate.d);
                } else {
                  // Fallback: Convert Excel serial date manually
                  // Excel epoch is 1900-01-01, but Excel incorrectly treats 1900 as leap year
                  const excelEpoch = new Date(1900, 0, 1);
                  const days = Number(dateStr) - 1; // Excel serial date starts from 1
                  donationDate = new Date(excelEpoch.getTime() + (days * 24 * 60 * 60 * 1000));
                }
              } catch (error) {
                console.warn('Excel date parsing failed, using current date:', error);
                donationDate = new Date();
              }
            } else {
              // Parse various date formats with DD/MM/YYYY priority
              const cleanDateStr = dateStr.replace(/[^\d\/\-]/g, '');
              
              if (cleanDateStr.includes('/')) {
                const parts = cleanDateStr.split('/');
                if (parts.length === 3) {
                  // Intelligent date parsing - prioritize DD/MM/YYYY format
                  let day, month, year;
                  
                  if (parts[2].length === 4) {
                    // Format: DD/MM/YYYY or MM/DD/YYYY
                    if (parseInt(parts[0]) > 12) {
                      // Must be DD/MM/YYYY since first part > 12
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    } else if (parseInt(parts[1]) > 12) {
                      // Must be MM/DD/YYYY since second part > 12
                      month = parseInt(parts[0]);
                      day = parseInt(parts[1]);
                    } else {
                      // Ambiguous - use DD/MM/YYYY (Indian standard)
                      day = parseInt(parts[0]);
                      month = parseInt(parts[1]);
                    }
                    year = parseInt(parts[2]);
                  } else {
                    // Format: DD/MM/YY or MM/DD/YY
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
                    year = parseInt(parts[2]) + (parseInt(parts[2]) < 50 ? 2000 : 1900);
                  }
                  
                  donationDate = new Date(year, month - 1, day);
                }
              } else if (cleanDateStr.includes('-')) {
                // Handle YYYY-MM-DD format
                donationDate = new Date(cleanDateStr);
              }
            }
          }

          // Validation
          const validationErrors = [];
          
          if (!donation.receiptNo) validationErrors.push('Receipt number is required');
          if (!donation.name) validationErrors.push('Name is required');
          if (!donation.phone) validationErrors.push('Phone number is required');
          if (!donation.community) validationErrors.push('Community is required');
          if (!donation.location) validationErrors.push('Location is required');
          if (!donation.amount || donation.amount <= 0) validationErrors.push('Valid amount is required');
          if (donation.phone && donation.phone.length !== 10) validationErrors.push('Phone number must be 10 digits');

          // Check for duplicate receipt number
          const existingDonation = await storage.getDonationsByReceiptNo(donation.receiptNo);
          if (existingDonation) {
            validationErrors.push(`Receipt number ${donation.receiptNo} already exists`);
          }

          if (validationErrors.length > 0) {
            errors.push(`Row ${rowNum}: ${validationErrors.join(', ')}`);
            continue;
          }

          // Create donation with parsed date
          const donationData = {
            ...donation,
            amount: Number(donation.amount)
          };

          const savedDonation = await storage.createDonation(donationData);
          results.push(savedDonation);

        } catch (error: any) {
          console.error(`Error processing row ${rowNum}:`, error);
          errors.push(`Row ${rowNum}: ${error.message}`);
        }
      }

      res.json({
        success: true,
        message: `Import completed. ${results.length} donations imported successfully.`,
        imported: results.length,
        errors: errors
      });

    } catch (error: any) {
      console.error('Import error:', error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to import data",
        error: error.message 
      });
    }
  });

  // Get all donations with optional filters (protected)
  app.get("/api/donations", requireAuth, async (req, res) => {
    try {
      const filters = {
        dateRange: req.query.dateRange as string,
        paymentMode: req.query.paymentMode as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        phone: req.query.phone as string,
  receiptNo: req.query.receiptNo as string,
      };

      // Check if any filters are applied
      const hasFilters =
  !!filters.phone ||
  !!filters.receiptNo ||
  !!filters.paymentMode ||
  !!filters.dateRange ||
  (!!filters.startDate && !!filters.endDate);


      let donations;
      if (hasFilters) {
        donations = await storage.getDonationsByFilters(filters);
      } else {
        donations = await storage.getAllDonations();
      }

      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // Check receipt number for duplicates (public - for donation form validation)
  app.get("/api/donations/check-receipt/:receiptNo", async (req, res) => {
    try {
      const receiptNo = req.params.receiptNo;
      const existingDonation = await storage.getDonationsByReceiptNo(receiptNo);
      
      res.json({ 
        exists: !!existingDonation,
        receiptNo: receiptNo 
      });
    } catch (error) {
      console.error('Error checking receipt number:', error);
      res.status(500).json({ 
        error: "Failed to check receipt number",
        exists: false
      });
    }
  });

  // Create new donation (public - no auth required for donation form)
  app.post("/api/donations", async (req, res) => {
    try {
      const validatedData = insertDonationSchema.parse(req.body);
      
      // Check for duplicate receipt number
      const existingDonation = await storage.getDonationsByReceiptNo(validatedData.receiptNo);
      if (existingDonation) {
        return res.status(400).json({ 
          error: "Duplicate receipt number", 
          message: `Receipt number ${validatedData.receiptNo} already exists` 
        });
      }
      
      const donation = await storage.createDonation(validatedData);
      
      // Invalidate dashboard cache when new donation is created
      dashboardCache.invalidatePattern('dashboard-stats');
      
      res.status(201).json(donation);
    } catch (error: any) {
      console.error('Create donation error:', error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });

  // Delete all donations (protected superadmin only) - MUST be before parameterized routes
  app.delete("/api/donations/delete-all", requireAuth, async (req, res) => {
    try {
      const session = req.session as any;
      if (session.role !== 'superadmin') {
        return res.status(403).json({ error: "Insufficient permissions" });
      }
      
      await storage.deleteAllDonations();
      res.json({ success: true, message: "All donations deleted successfully" });
    } catch (error) {
      console.error('Delete all donations error:', error);
      res.status(500).json({ error: "Failed to delete donations" });
    }
  });

  // Search donations by phone (protected) - MUST be before parameterized routes
  app.get("/api/donations/search/:phone", requireAuth, async (req, res) => {
    try {
      const phone = req.params.phone;
      const donations = await storage.getDonationsByPhone(phone);
      res.json(donations);
    } catch (error) {
      res.status(500).json({ message: "Failed to search donations" });
    }
  });

  // Get donation by ID (protected)
  app.get("/api/donations/:id", requireAuth, async (req, res) => {
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
// Update donation (protected)
app.put("/api/donations/:id", requireAuth, async (req, res) => {
  try {
    const donationId = parseInt(req.params.id);

    if (!donationId || isNaN(donationId)) {
      return res.status(400).json({ message: "Invalid donation ID" });
    }

    // Validate incoming data
    const validatedData = insertDonationSchema.partial().parse(req.body);

    const updatedDonation = await storage.updateDonation(
      donationId,
      validatedData
    );

    if (!updatedDonation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Invalidate dashboard cache
    dashboardCache.invalidatePattern("dashboard-stats");

    res.json(updatedDonation);
  } catch (error: any) {
    console.error("Update donation error:", error);

    if (error.name === "ZodError") {
      return res.status(400).json({
        message: "Invalid donation data",
        errors: error.errors,
      });
    }

    res.status(500).json({ message: "Failed to update donation" });
  }
});

  // Delete individual donation (protected admin route)
  app.delete("/api/donations/:id", requireAuth, async (req, res) => {
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
      console.error('Delete donation error:', error);
      res.status(500).json({ error: "Failed to delete donation" });
    }
  });

  // Get next receipt number
  app.get("/api/receipt-number/next", requireAuth, async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();
      const nextReceiptNumber = await storage.getNextReceiptNumber(currentYear);
      res.json({ receiptNumber: nextReceiptNumber });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate receipt number" });
    }
  });

  // Dashboard analytics (protected) - optimized with caching
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    const startTime = Date.now();
    
    try {
      const dateRange = req.query.dateRange as string || 'all';
      const startDateParam = req.query.startDate as string;
      const endDateParam = req.query.endDate as string;
      
      // Generate cache key
      const cacheKey = `dashboard-stats-${dateRange}-${startDateParam || ''}-${endDateParam || ''}`;
      
      // Check cache first (disabled for debugging)
      // const cached = dashboardCache.get(cacheKey);
      // if (cached) {
      //   res.setHeader('X-Cache', 'HIT');
      //   res.setHeader('Cache-Control', 'private, max-age=120');
      //   return res.json(cached);
      // }

      // Parse date range from query parameters
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      const now = new Date();

      // Handle different date ranges efficiently
      if (dateRange === "custom" && startDateParam && endDateParam) {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange && dateRange !== "all") {
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;
          case 'thisyear':
            startDate = new Date(now.getFullYear(), 0, 1); // January 1st of current year
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st of current year
            break;
          case 'lastyear':
            startDate = new Date(now.getFullYear() - 1, 0, 1); // January 1st of last year
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999); // December 31st of last year
            break;
          case 'thismonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // First day of current month
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of current month
            break;
          case 'lastmonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1); // First day of last month
            endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999); // Last day of last month
            break;
        }
      }

      // Parallel execution for better performance
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
        paymentModeDistribution: paymentModeDistribution.map(pm => ({
          mode: pm.paymentMode,
          count: pm.count,
          percentage: stats.totalDonations > 0 ? (pm.count / stats.totalDonations) * 100 : 0
        })),
        recentDonations: recentDonations.map(d => ({
          name: d.name,
          amount: Number(d.amount),
          paymentMode: d.paymentMode,
          donationDate: d.donationDate ? d.donationDate.toISOString() : null,
          createdAt: d.createdAt.toISOString()
        }))
      };

      // Cache the response for 2 minutes (disable for debugging)
      // dashboardCache.set(cacheKey, responseData, 120);
      
      const duration = Date.now() - startTime;
      
      // Set caching headers
      res.setHeader('X-Cache', 'MISS');
      res.setHeader('Cache-Control', 'private, max-age=120, stale-while-revalidate=60');
      res.setHeader('X-Response-Time', `${duration}ms`);
      
      res.json(responseData);
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Clear dashboard cache (protected)
  app.delete("/api/dashboard/cache", requireAuth, async (req, res) => {
    try {
      dashboardCache.clear();
      res.json({ success: true, message: "Dashboard cache cleared" });
    } catch (error) {
      console.error('Cache clear error:', error);
      res.status(500).json({ error: "Failed to clear cache" });
    }
  });

  // Dashboard export (protected)
  app.get("/api/dashboard/export", requireAuth, async (req, res) => {
    try {
      const dateRange = req.query.dateRange as string || 'all';
      const startDateParam = req.query.startDate as string;
      const endDateParam = req.query.endDate as string;
      
      // Parse date range (same logic as dashboard stats)
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      const now = new Date();

      if (dateRange === "custom" && startDateParam && endDateParam) {
        startDate = new Date(startDateParam);
        endDate = new Date(endDateParam);
        endDate.setHours(23, 59, 59, 999);
      } else if (dateRange && dateRange !== "all") {
        switch (dateRange) {
          case 'today':
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
            break;
          case 'week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            endDate = now;
            break;
          case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = now;
            break;
          case 'thisyear':
            startDate = new Date(now.getFullYear(), 0, 1);
            endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
            break;
          case 'lastyear':
            startDate = new Date(now.getFullYear() - 1, 0, 1);
            endDate = new Date(now.getFullYear() - 1, 11, 31, 23, 59, 59, 999);
            break;
          case 'thismonth':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
          case 'lastmonth':
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            startDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1);
            endDate = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0, 23, 59, 59, 999);
            break;
        }
      }

      // Get filtered donations
      let donations;
      if (startDate && endDate) {
        const filters = {
          dateRange: dateRange,
          startDate: startDateParam,
          endDate: endDateParam,
          phone:"",
          receiptNo:"",
          paymentMode: 'all',
          
        };
        donations = await storage.getDonationsByFilters(filters);
      } else {
        donations = await storage.getAllDonations();
      }
      
      // Create CSV content
      const headers = ['S.No', 'Receipt No', 'Name', 'Community', 'Location', 'Address', 'Phone', 'Amount', 'Payment Mode', 'Inscription', 'Date'];
      const csvContent = [
        headers.join(','),
        ...donations.map((donation, index) => [
          index + 1,
          donation.receiptNo,
          `"${donation.name}"`,
          `"${donation.community || ''}"`,
          `"${donation.location || ''}"`,
          `"${(donation as any).address || ''}"`,
          donation.phone,
          donation.amount,
          donation.paymentMode,
          donation.inscription ? 'Yes' : 'No',
          new Date(donation.donationDate || donation.createdAt).toLocaleDateString('en-GB')
        ].join(','))
      ].join('\n');
      
      // Generate filename with date range
      let filename = 'temple-donations';
      if (dateRange !== 'all') {
        filename += `-${dateRange}`;
        if (dateRange === 'custom' && startDateParam && endDateParam) {
          filename += `-${startDateParam}-to-${endDateParam}`;
        }
      }
      filename += '.csv';
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(csvContent);
    } catch (error) {
      console.error('Dashboard export error:', error);
      res.status(500).json({ message: "Failed to export dashboard data" });
    }
  });

  // Legacy endpoint for backward compatibility
  app.get("/api/analytics/dashboard", requireAuth, async (req, res) => {
    res.redirect(308, '/api/dashboard/stats?' + new URLSearchParams(req.query as any).toString());
  });

  // Donor search routes
  app.get("/api/donors/search", async (req, res) => {
    try {
      const { query, community } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const donors = await storage.searchDonors(query, community as string);
      res.json(donors);
    } catch (error) {
      console.error('Error searching donors:', error);
      res.status(500).json({ message: "Failed to search donors" });
    }
  });

  app.get("/api/donors/:phone", async (req, res) => {
    try {
      const donor = await storage.getDonorByPhone(req.params.phone);
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.json(donor);
    } catch (error) {
      console.error('Error fetching donor by phone:', error);
      res.status(500).json({ message: "Failed to fetch donor" });
    }
  });

  // Change admin credentials (protected)
  app.post("/api/auth/change-credentials", requireAuth, async (req, res) => {
    try {
      const { currentPassword, newUsername, newPassword } = req.body;
      
      // Validate input
      if (!currentPassword || !newUsername || !newPassword) {
        return res.status(400).json({ 
          error: "Missing required fields",
          required: ["currentPassword", "newUsername", "newPassword"]
        });
      }

      // Get current session user
      const currentUser = (req.session as any).user;
      if (!currentUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      // Verify current password
      const { getAdminUser } = await import("./admin-credentials");
      const userCred = getAdminUser(currentUser.username);
      
      if (!userCred || userCred.password !== currentPassword) {
        return res.status(400).json({ 
          error: "Current password is incorrect" 
        });
      }

      // Basic validation for new credentials
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

      // Update session with new username
      (req.session as any).user = {
        username: newUsername,
        role: userCred.role
      };

      res.json({ 
        success: true,
        message: "Credentials updated successfully",
        username: newUsername
      });

    } catch (error: any) {
      console.error('Change credentials error:', error);
      res.status(500).json({ 
        error: "Failed to change credentials",
        message: error.message 
      });
    }
  });

  // Google Form webhook endpoint (public - no auth required)
  app.post("/api/google-form-webhook", async (req, res) => {
    try {
      console.log('Google Form webhook received:', req.body);
      
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

      // Basic validation
      if (!name || !phone || !amount || !receiptNo) {
        return res.status(400).json({ 
          error: "Missing required fields",
          required: ["name", "phone", "amount", "receiptNo"]
        });
      }

      // Validate phone number format
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ 
          error: "Invalid phone number format. Must be 10 digits." 
        });
      }

      // Check for duplicate receipt number
      const existingDonation = await storage.getDonationsByReceiptNo(receiptNo);
      if (existingDonation) {
        return res.status(400).json({ 
          error: "Duplicate receipt number", 
          message: `Receipt number ${receiptNo} already exists` 
        });
      }

      // Prepare donation data
      const donationData = {
        receiptNo: receiptNo.toString(),
        name: name.trim(),
        phone: phone.trim(),
        community: community || 'any',
        location: location || '',
        address: '', // Not collected in Google Form
        amount: amount.toString(),
        paymentMode: paymentMode || 'cash',
        inscription: Boolean(inscription)
      };

      // Validate data against schema
      const validatedData = insertDonationSchema.parse(donationData);
      
      // Create the donation
      const donation = await storage.createDonation(validatedData);
      
      // Invalidate dashboard cache
      dashboardCache.invalidatePattern('dashboard-stats');
      
      console.log('Google Form donation created successfully:', donation.id);
      
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

    } catch (error: any) {
      console.error('Google Form webhook error:', error);
      
      if (error.name === 'ZodError') {
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