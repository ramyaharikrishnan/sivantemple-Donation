import { memo, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { StatsCard } from "@/components/ui/stats-card";
import { DashboardSkeleton } from "@/components/ui/fast-loading";
import { 
  Calendar, 
  CalendarIcon, 
  Download, 
  Coins, 
  Users, 
  CreditCard, 
  TrendingUp 
} from "lucide-react";

interface DashboardStats {
  totalCollections: number;
  totalDonors: number;
  totalDonations: number;
  avgDonation: number;
  paymentModeDistribution: Array<{ mode: string; count: number; percentage: number }>;
  recentDonations: Array<{ name: string; amount: number; paymentMode: string; createdAt: string }>;
}

const Dashboard = memo(function Dashboard() {
  const { language } = useLanguage();
  const [dateRange, setDateRange] = useState<string>("all");
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);
  
  // Generate query parameters based on date range selection  
  const getDashboardQuery = () => {
    const now = new Date();
    
    if (dateRange === "custom") {
      if (customStartDate && customEndDate) {
        return `/api/dashboard/stats?dateRange=custom&startDate=${format(customStartDate, "yyyy-MM-dd")}&endDate=${format(customEndDate, "yyyy-MM-dd")}`;
      }
      return `/api/dashboard/stats?dateRange=all`;
    }
    
    return `/api/dashboard/stats?dateRange=${dateRange}`;
  };

  const { data: stats, isLoading, isError } = useQuery<DashboardStats>({
    queryKey: ['dashboard-stats', dateRange, customStartDate, customEndDate],
    queryFn: async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout
      
      try {
        const response = await fetch(getDashboardQuery(), {
          credentials: 'include',
          signal: controller.signal,
          headers: {
            'Cache-Control': 'max-age=120', // Request caching
          }
        });
        clearTimeout(timeoutId);
        
        if (!response.ok) throw new Error(`HTTP ${response.status}: Failed to fetch dashboard stats`);
        return response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: 1000,
  });

  const useTranslation = () => {
    return {
      totalCollection: language === "ta" ? "மொத்த சேகரிப்பு" : "Total Collection",
      totalDonors: language === "ta" ? "மொத்த நன்கொடையாளர்கள்" : "Total Donors",
      totalDonations: language === "ta" ? "மொத்த நன்கொடைகள்" : "Total Donations",
      avgDonation: language === "ta" ? "சராசரி நன்கொடை" : "Average Donation",
      paymentModeDistribution: language === "ta" ? "பணம் செலுத்தும் முறை விநியோகம்" : "Payment Mode Distribution",
      recentDonations: language === "ta" ? "சமீபத்திய நன்கொடைகள்" : "Recent Donations",
    };
  };

  const t = useTranslation();

  // Currency formatting functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyTamil = (amount: number) => {
    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `₹${formatted}`;
  };

  // Export functionality
  const handleExport = async () => {
    try {
      const queryUrl = getDashboardQuery().replace('/stats', '/export');
      const response = await fetch(queryUrl, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `donations_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (isLoading || !stats) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {language === "ta" ? "தரவு ஏற்றப்படவில்லை" : "Failed to Load Data"}
          </h3>
          <p className="text-red-600 mb-4">
            {language === "ta" 
              ? "டாஷ்போர்ட் தரவை ஏற்றுவதில் சிக்கல் ஏற்பட்டது. மீண்டும் முயற்சிக்கவும்." 
              : "There was a problem loading the dashboard data. Please try again."
            }
          </p>
          <Button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700">
            {language === "ta" ? "மீண்டும் ஏற்று" : "Reload"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Enhanced Date Filter */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-start lg:space-y-0">
        <h2 className="text-2xl font-semibold text-gray-900">
          {language === "ta" ? "சேகரிப்பு டாஷ்போர்டு" : "Collection Dashboard"}
        </h2>
        
        <div className="flex flex-col space-y-3 lg:flex-row lg:space-y-0 lg:space-x-4 lg:items-center">
          {/* Enhanced Date Filter Component */}
          <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200">
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 sm:items-center">
              <span className="text-sm font-medium text-gray-700">
                {language === "ta" ? "தேதி வரம்பு:" : "Date Range:"}
              </span>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-44 bg-white border-gray-300 hover:border-temple-primary focus:border-temple-primary">
                  <Calendar className="h-4 w-4 mr-2 text-temple-primary" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-50">
                  <SelectItem value="all" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "எல்லா நேரங்களிலும்" : "All Time"}
                  </SelectItem>
                  <SelectItem value="thisyear" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "இந்த ஆண்டு" : "This Year"}
                  </SelectItem>
                  <SelectItem value="lastyear" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "கடந்த ஆண்டு" : "Last Year"}
                  </SelectItem>
                  <SelectItem value="thismonth" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "இந்த மாதம்" : "This Month"}
                  </SelectItem>
                  <SelectItem value="lastmonth" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "கடந்த மாதம்" : "Last Month"}
                  </SelectItem>
                  <SelectItem value="custom" className="hover:bg-temple-accent/20">
                    {language === "ta" ? "குறிப்பிட்ட வரம்பு" : "Custom Range"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Custom Date Range Inputs */}
            {dateRange === "custom" && (
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 mt-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[160px] justify-start text-left font-normal",
                        !customStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customStartDate ? format(customStartDate, "dd/MM/yyyy") : (language === "ta" ? "தொடக்க தேதி" : "Start date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={customStartDate}
                      onSelect={(date: Date | undefined) => {
                        setCustomStartDate(date);
                        if (date && customEndDate && date > customEndDate) {
                          setCustomEndDate(undefined);
                        }
                      }}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full sm:w-[160px] justify-start text-left font-normal",
                        !customEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {customEndDate ? format(customEndDate, "dd/MM/yyyy") : (language === "ta" ? "முடிவு தேதி" : "End date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={customEndDate}
                      onSelect={(date: Date | undefined) => setCustomEndDate(date)}
                      disabled={(date) => {
                        if (date > new Date()) return true;
                        if (customStartDate && date < customStartDate) return true;
                        return false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          
          {/* Export Button */}
          <Button onClick={handleExport} className="bg-temple-primary hover:bg-temple-primary/90 shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            {language === "ta" ? "ஏற்றுமதி" : "Export"}
          </Button>
        </div>
      </div>
      
      {/* Filter Status Indicator */}
      {dateRange !== "all" && (
        <div className="bg-temple-accent/10 border border-temple-primary/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-temple-primary" />
            <span className="text-sm font-medium text-temple-primary">
              {language === "ta" ? "வடிகட்டப்பட்ட தரவு:" : "Filtered Data:"} 
              {" "}
              {dateRange === "thisyear" && (language === "ta" ? "இந்த ஆண்டு" : "This Year")}
              {dateRange === "lastyear" && (language === "ta" ? "கடந்த ஆண்டு" : "Last Year")}
              {dateRange === "thismonth" && (language === "ta" ? "இந்த மாதம்" : "This Month")}
              {dateRange === "lastmonth" && (language === "ta" ? "கடந்த மாதம்" : "Last Month")}
              {dateRange === "custom" && (language === "ta" ? "குறிப்பிட்ட வரம்பு" : "Custom Range")}
            </span>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setDateRange("all")}
              className="h-6 px-2 text-xs text-temple-primary hover:bg-temple-primary/10"
            >
              {language === "ta" ? "அழிக்க" : "Clear"}
            </Button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title={t.totalCollection}
          value={language === "ta" ? formatCurrencyTamil(stats.totalCollections || 0) : formatCurrency(stats.totalCollections || 0)}
          icon={<Coins className="h-6 w-6 text-temple-primary" />}
          iconBgColor="bg-temple-accent"
          change={{ value: language === "en" ? "12% from last month" : "கடந்த மாதத்திலிருந்து 12%", positive: true }}
        />

        <StatsCard
          title={t.totalDonors}
          value={(stats.totalDonors || 0).toString()}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          iconBgColor="bg-blue-100"
          change={{ value: language === "en" ? "8% from last month" : "கடந்த மாதத்திலிருந்து 8%", positive: true }}
        />

        <StatsCard
          title={t.totalDonations}
          value={(stats.totalDonations || 0).toString()}
          icon={<CreditCard className="h-6 w-6 text-green-600" />}
          iconBgColor="bg-green-100"
          change={{ value: language === "en" ? "15% from last month" : "கடந்த மாதத்திலிருந்து 15%", positive: true }}
        />

        <StatsCard
          title={t.avgDonation}
          value={language === "ta" ? formatCurrencyTamil(stats.avgDonation || 0) : formatCurrency(stats.avgDonation || 0)}
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          iconBgColor="bg-purple-100"
          change={{ value: language === "en" ? "5% from last month" : "கடந்த மாதத்திலிருந்து 5%", positive: true }}
        />
      </div>

      {/* Payment Mode Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.paymentModeDistribution}</h3>
            <div className="space-y-3">
              {stats.paymentModeDistribution.map((mode: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{mode.mode}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-temple-primary h-2 rounded-full" 
                        style={{ width: `${mode.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600">{mode.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Donations */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">{t.recentDonations}</h3>
            <div className="space-y-3">
              {stats.recentDonations.slice(0, 5).map((donation: any, index: number) => {
                // Use donationDate if available, otherwise use createdAt
                const displayDate = donation.donationDate || donation.createdAt;
                const formattedDate = new Date(displayDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit', 
                  year: 'numeric'
                });
                
                return (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium">{donation.name}</p>
                    <p className="text-xs text-gray-500">{formattedDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {language === "ta" ? formatCurrencyTamil(donation.amount) : formatCurrency(donation.amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{donation.paymentMode}</p>
                  </div>
                </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

export default Dashboard;