import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";
// Removed TypeScript imports - using JavaScript
import { useTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatCurrencyTamil } from "@/lib/i18n";
import { Plus, CheckCircle } from "lucide-react";
import type { Donation, InsertDonation } from "@/../../shared/schema";

/* 🔽 ADD THIS RIGHT HERE (TOP LEVEL) */
type DonationFormValues = Omit<InsertDonation, "donationDate"> & {
  donationDate: string;
};


export default function DonationForm({
  initialData,
  onSuccess,
}: {
  initialData?: Donation;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const t = useTranslation();
  const [donorHistory, setDonorHistory] = useState<any>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [receiptError, setReceiptError] = useState<string>("");

  const isEditMode = !!initialData;

  const form = useForm<DonationFormValues>({
     defaultValues: initialData
    ? {
        receiptNo: initialData.receiptNo,
        name: initialData.name,
        phone: initialData.phone,
        community: initialData.community ?? undefined,
        location: initialData.location ?? "",
        address: initialData.address ?? "",
        amount: initialData.amount,
        paymentMode: initialData.paymentMode,
        inscription: initialData.inscription,
        
        donationDate: initialData.donationDate
          ? new Date(initialData.donationDate).toISOString().split("T")[0]
          : "", // ✅ STRING ONLY
      }
       : {
        receiptNo: "",
        name: "",
        phone: "",
        community: undefined,
        location: "",
        address: "",
        amount: undefined,
        paymentMode: "cash",
        inscription: false,
        donationDate: "", // ✅ STRING
      },
});

  const createDonationMutation = useMutation({
  mutationFn: async (data: any) => {
    const payload = {
      ...data,
      donationDate: new Date(data.donationDate),
    };

    if (isEditMode && initialData) {
      const donationId =
        (initialData as any)._id || (initialData as any).id;

      const response = await fetch(`/api/donations/${donationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update donation");
      }

      // ✅ SAFE: handle empty or non-JSON response
      const text = await response.text();
      return text ? JSON.parse(text) : payload;
    }

    // CREATE MODE (no change needed)
    const response = await fetch("/api/donations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to create donation");
    }

    return response.json();
  },
    onSuccess: (result) => {
      if (isEditMode) {
        // For edit mode, call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
        toast({
          title: "Success",
          description: "Donation updated successfully",
        });
      } else {
        // For create mode, show success dialog and toast
        setSuccessData({
          receiptNo: result.receiptNo,
          amount: result.amount,
          name: result.name,
          community: result.community,
          paymentMode: result.paymentMode,
        });
        setShowSuccessDialog(true);

        // Show success toast immediately
        toast({
          title:
            language === "en"
              ? "✅ Donation Added Successfully!"
              : "✅ நன்கொடை வெற்றிகரமாக சேர்க்கப்பட்டது!",
          description:
            language === "en"
              ? `Receipt No: ${result.receiptNo} | Amount: ₹${result.amount}`
              : `ரசீது எண்: ${result.receiptNo} | தொகை: ₹${result.amount}`,
          duration: 5000,
        });

        // Reset form and state
        form.reset({
          receiptNo: "",
          name: "",
          phone: "",
          community: undefined,
          location: "",
          amount: undefined,
          paymentMode: "cash",
          inscription: false,
          donationDate: "",
        });
        setDonorHistory(null);

        // Invalidate queries to refresh data across all components
        queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
        queryClient.invalidateQueries({ queryKey: ["/api/donations"] });
        queryClient.invalidateQueries({ queryKey: ["/api/donors"] });
      }
    },
    onError: (error: any) => {
      console.error("Donation error:", error);
      
      // Handle authentication error
      if (error.message?.includes("Authentication required")) {
        toast({
          title: language === "en" ? "❌ Authentication Required" : "❌ அங்கீகாரம் தேவை",
          description: language === "en" 
            ? "Please login to admin panel first to add donations." 
            : "நன்கொடை சேர்க்க முதலில் நிர्वाக பாட्டில் உள்நுழैகवुम்.",
          variant: "destructive",
          duration: 8000,
        });
        return;
      }
      
      // Handle specific receipt number duplicate error
      if (error.message?.includes("Receipt number already exists") || error.code === "DUPLICATE_RECEIPT") {
        setReceiptError(language === "en" ? "Receipt number already exists" : "ரசீது எண் ஏற்கனவே உள்ளது");
        form.setError("receiptNo", {
          type: "manual",
          message: language === "en" ? "Receipt number already exists" : "ரசீது எண் ஏற்கனவே உள்ளது"
        });
        toast({
          title: language === "en" ? "❌ Error" : "❌ பிழை",
          description: language === "en" ? "Receipt number already exists. Please use a different receipt number." : "ரசீது எண் ஏற்கனவே உள்ளது. வேறு ரசீது எண்ணைப் பயன்படுத்தவும்.",
          variant: "destructive",
          duration: 5000,
        });
      } else {
        toast({
          title: language === "en" ? "❌ Error" : "❌ பிழை",
          description: error.message || t("donationError"),
          variant: "destructive",
          duration: 5000,
        });
      }
    },
  });

  const checkReceiptNumber = async (receiptNo: string) => {
    if (receiptNo && receiptNo.trim() !== "" && !isEditMode) {
      try {
        const response = await fetch(`/api/donations/check-receipt/${encodeURIComponent(receiptNo)}`, {
          credentials: "include",
        });
        
        if (response.status === 401) {
          // Authentication required - show warning but don't block form
          toast({
            title: language === "en" ? "⚠️ Authentication Required" : "⚠️ அங்கीகாரம் தேவை",
            description: language === "en" 
              ? "Please login to admin panel to enable receipt validation." 
              : "ரசீது சரிபார्पणை इष்टमाच्छुम् நிर्वाक பাट्টில் उள्நुழैগावুম्.",
            variant: "destructive",
            duration: 5000,
          });
          return;
        }
        
        if (response.ok) {
          const result = await response.json();
          if (result.exists) {
            const errorMsg = language === "en" ? "Receipt number already exists" : "ரசீது எண் ஏற்கனவே உள்ளது";
            setReceiptError(errorMsg);
            form.setError("receiptNo", {
              type: "manual",
              message: errorMsg
            });
          } else {
            setReceiptError("");
            form.clearErrors("receiptNo");
          }
        }
      } catch (error) {
        console.error("Error checking receipt number:", error);
      }
    } else {
      setReceiptError("");
      form.clearErrors("receiptNo");
    }
  };

const checkExistingDonor = async (phone: string) => {
  if (phone.length >= 10) {
    try {
      const response = await fetch(`/api/donors/${phone}`, {
        credentials: "include",
      });

      if (!response.ok) {
        setDonorHistory(null);
        return;
      }

      const donor = await response.json();
      setDonorHistory(donor);

      form.setValue("name", donor.name ?? "");
      form.setValue("location", donor.location ?? "");
      form.setValue("community", donor.community ?? undefined);
    } catch {
      setDonorHistory(null);
    }
  } else {
    setDonorHistory(null);
  }
};




const onSubmit = (data: DonationFormValues) => {
    if (receiptError) {
      toast({
        title: language === "en" ? "❌ Error" : "❌ பிழை",
        description: language === "en" ? "Please fix the receipt number error before submitting." : "சமர்ப்பிக்கும் முன் ரசீது எண் பிழையை சரிசெய்யவும்.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    // Validate all required fields
    const errors = [];
    if (!data.receiptNo || data.receiptNo.trim() === "") {
      errors.push(language === "en" ? "Receipt number is required" : "ரசீது எண் அவசியம்");
    }
    if (!data.name || data.name.trim() === "") {
      errors.push(language === "en" ? "Name is required" : "பெயர் அவசியம்");
    }
    if (!data.phone || data.phone.trim() === "" || data.phone.length !== 10) {
      errors.push(language === "en" ? "Phone number (10 digits) is required" : "தொலைபேசி எண் (10 இலக்கங்கள்) அவசியம்");
    }
    if (!data.community || data.community === "") {
      errors.push(language === "en" ? "Community is required" : "குலம் அவசியம்");
    }
    if (!data.location || data.location.trim() === "") {
      errors.push(language === "en" ? "Location is required" : "இடம் அவசியம்");
    }
    if (!data.amount || Number(data.amount) <= 0) {
      errors.push(language === "en" ? "Donation amount is required" : "நன்கொடை தொகை அவசியம்");
    }
    if (!data.donationDate || data.donationDate.trim() === "") {
      errors.push(language === "en" ? "Donation date is required" : "நன்கொடை தேதி அவசியம்");
    }
    if (!data.paymentMode || data.paymentMode.trim() === "") {
      errors.push(language === "en" ? "Payment mode is required" : "கட்டண முறை அவசியம்");
    }

    if (errors.length > 0) {
      toast({
        title: language === "en" ? "❌ Required Fields Missing" : "❌ அவசிய புலங்கள் இல்லை",
        description: errors.join(", "),
        variant: "destructive",
        duration: 8000,
      });
      return;
    }
    
    // Process and clean the donation data
const donationData: InsertDonation = {
  ...data,
  amount: Number(data.amount),
  donationDate: new Date(data.donationDate),
};
    createDonationMutation.mutate(donationData);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card className="overflow-hidden shadow-lg border-0 sm:border">
        <div className="bg-gradient-to-r from-temple-primary to-temple-secondary px-4 sm:px-6 py-4 sm:py-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            {t("donationFormTitle")}
          </h2>
          <p className="text-white/90 text-sm sm:text-base mt-1">
            {t("donationFormSubtitle")}
          </p>
        </div>

        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 sm:space-y-8"
          >
            {/* Receipt Number field - Manual entry */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {t("receiptNumber")} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={
                  language === "en"
                    ? "Enter receipt number (e.g., 1, 2, A001, etc.)"
                    : "ரசீது எண்ணை உள்ளிடவும் (எ.கா., 1, 2, A001, போன்றவை)"
                }
                {...form.register("receiptNo", {
                  required: language === "en" ? "Receipt number is required" : "ரசீது எண் அவசியம்",
                  minLength: {
                    value: 1,
                    message: language === "en" ? "Receipt number cannot be empty" : "ரசீது எண் காலியாக இருக்க முடியாது"
                  }
                })}
                onChange={(e) => {
                  form.setValue("receiptNo", e.target.value);
                  // Clear previous errors when user starts typing
                  if (receiptError) {
                    setReceiptError("");
                    form.clearErrors("receiptNo");
                  }
                }}
                onBlur={(e) => checkReceiptNumber(e.target.value)}
                className={`text-sm sm:text-base h-11 sm:h-12 ${receiptError || form.formState.errors.receiptNo ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.receiptNo && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {form.formState.errors.receiptNo.message}
                </p>
              )}
            </div>

            {/* Donor Name field */}
            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {language === "en" ? "Name" : "பெயர்"} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={
                  language === "en"
                    ? "Enter full name"
                    : "முழு பெயரை உள்ளிடவும்"
                }
                {...form.register("name", {
                  required: language === "en" ? "Name is required" : "பெயர் அவசியம்",
                  minLength: {
                    value: 2,
                    message: language === "en" ? "Name must be at least 2 characters" : "பெயர் குறைந்தது 2 எழுத்துக்கள் இருக்க வேண்டும்"
                  }
                })}
                className={`text-sm sm:text-base h-11 sm:h-12 ${form.formState.errors.name ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.name && (
                <p className="text-xs sm:text-sm text-red-600">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {language === "en" ? "Phone Number" : "தொலைபேசி எண்"} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                placeholder={t("phoneHelp")}
                {...form.register("phone", {
                  required: language === "en" ? "Phone number is required" : "தொலைபேசி எண் அவசியம்",
                  pattern: {
                    value: /^\d{10}$/,
                    message: language === "en" ? "Phone number must be exactly 10 digits" : "தொலைபேசி எண் சரியாக 10 இலக்கங்களாக இருக்க வேண்டும்"
                  }
                })}
                onBlur={(e) => {
  if (!isEditMode) {
    checkExistingDonor(e.target.value);
  }
}}

                onChange={(e) => {
                  // Only allow digits and limit to 10 characters
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                  form.setValue("phone", value);
                }}
                maxLength={10}
                className={`text-sm sm:text-base h-11 sm:h-12 ${form.formState.errors.phone ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.phone && (
                <p className="text-xs sm:text-sm text-red-600">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Donor History Display */}
            {donorHistory && (
              <div className="bg-temple-accent border border-temple-primary/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {donorHistory.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Previous donations:{" "}
                      <span className="font-medium">
                        {formatCurrency(donorHistory.totalAmount)}
                      </span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      Last donation:{" "}
                      <span>
                        {new Date(
                          donorHistory.lastDonation,
                        ).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Total visits: <span>{donorHistory.donationCount}</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {t("community")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={form.watch("community")}
               onValueChange={(value) => {
  form.setValue("community", value as InsertDonation["community"], {
    shouldValidate: true,
  });
}}

              >
                <SelectTrigger className="text-sm sm:text-base h-11 sm:h-12">
                  <SelectValue
                    placeholder={
                      language === "en"
                        ? "Select Kulam"
                        : "குலத்தை தேர்ந்தெடுக்கவும்"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">
                    {language === "en" ? "Any" : "எதுவும்"}
                  </SelectItem>
                  <SelectItem value="payiran">{t("payiran")}</SelectItem>
                  <SelectItem value="semban">{t("semban")}</SelectItem>
                  <SelectItem value="othaalan">{t("othaalan")}</SelectItem>
                  <SelectItem value="aavan">{t("aavan")}</SelectItem>
                  <SelectItem value="aadai">{t("aadai")}</SelectItem>
                  <SelectItem value="vizhiyan">{t("vizhiyan")}</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.community && (
                <p className="text-xs sm:text-sm text-red-600">
                  {form.formState.errors.community.message?.toString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {t("location")} <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder={
                  language === "en" ? "City, State" : "நகரம், மாநிலம்"
                }
                {...form.register("location", {
                  required: language === "en" ? "Location is required" : "இடம் அவசியம்",
                  minLength: {
                    value: 2,
                    message: language === "en" ? "Location must be at least 2 characters" : "இடம் குறைந்தது 2 எழுத்துக்கள் இருக்க வேண்டும்"
                  }
                })}
                className={`text-sm sm:text-base h-11 sm:h-12 ${form.formState.errors.location ? 'border-red-500' : ''}`}
              />
              {form.formState.errors.location && (
                <p className="text-xs sm:text-sm text-red-600">
                  {form.formState.errors.location.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm sm:text-base font-medium">
                {language === "en" ? "Address" : "முகவரி"}
              </Label>
              <Input
                placeholder={
                  language === "en" ? "Full address (optional)" : "முழு முகவரி (விருப்பம்)"
                }
                {...form.register("address")}
                className="text-sm sm:text-base h-11 sm:h-12"
              />
              {form.formState.errors.address && (
                <p className="text-xs sm:text-sm text-red-600">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">
                  {t("donationAmount")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 sm:top-3.5 text-gray-500 text-sm sm:text-base">
                    ₹
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className={`pl-8 text-sm sm:text-base h-11 sm:h-12 ${form.formState.errors.amount ? 'border-red-500' : ''}`}
                    step="0.01"
                    min="1"
                    {...form.register("amount", { 
                      valueAsNumber: true,
                      required: language === "en" ? "Donation amount is required" : "நன்கொடை தொகை அவசியம்",
                      min: {
                        value: 1,
                        message: language === "en" ? "Amount must be at least ₹1" : "தொகை குறைந்தது ₹1 இருக்க வேண்டும்"
                      }
                    })}
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">
                  {language === "en" ? "Donation Date" : "நன்கொடை தேதி"} <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  className={`text-sm sm:text-base h-11 sm:h-12 ${form.formState.errors.donationDate ? 'border-red-500' : ''}`}
                  {...form.register("donationDate", {
                    required: language === "en" ? "Donation date is required" : "நன்கொடை தேதி அவசியம்"
                  })}
                />
                {form.formState.errors.donationDate && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {form.formState.errors.donationDate.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">
                  {t("paymentMode")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={form.watch("paymentMode") || ""}
                  onValueChange={(value) => {
                    form.setValue("paymentMode", value as any);
                    form.clearErrors("paymentMode");
                  }}
                >
                  <SelectTrigger className="text-sm sm:text-base h-11 sm:h-12">
                    <SelectValue
                      placeholder={
                        language === "en"
                          ? "Select Payment Mode"
                          : "கட்டண முறையை தேர்ந்தெடுக்கவும்"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bankTransfer">
                      {t("bankTransfer")}
                    </SelectItem>
                    <SelectItem value="card">{t("card")}</SelectItem>
                    <SelectItem value="cash">{t("cash")}</SelectItem>
                    <SelectItem value="cheque">{t("cheque")}</SelectItem>
                    <SelectItem value="upi">{t("upi")}</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.paymentMode && (
                  <p className="text-xs sm:text-sm text-red-600">
                    {form.formState.errors.paymentMode.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-sm sm:text-base font-medium">
                {t("inscriptionRequired")}
              </Label>
              <RadioGroup
                defaultValue="false"
                onValueChange={(value) =>
                  form.setValue("inscription", value === "true")
                }
                className="flex flex-col sm:flex-row sm:space-x-8 space-y-3 sm:space-y-0"
              >
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="true" id="inscription-yes" />
                  <Label
                    htmlFor="inscription-yes"
                    className="text-sm sm:text-base font-medium"
                  >
                    {t("yes")}
                  </Label>
                </div>
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="false" id="inscription-no" />
                  <Label
                    htmlFor="inscription-no"
                    className="text-sm sm:text-base font-medium"
                  >
                    {t("no")}
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pt-6 border-t border-gray-200">
              <Button
                type="submit"
                className="w-full lg:flex-1 bg-temple-primary hover:bg-temple-primary/90 text-white h-12 sm:h-14 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createDonationMutation.isPending || receiptError !== ""}
                onClick={(e) => {
                  // Prevent double-clicks while processing
                  if (createDonationMutation.isPending) {
                    e.preventDefault();
                    return false;
                  }
                }}
              >
                <Plus className="h-5 w-5 mr-2" />
                {createDonationMutation.isPending
                  ? t("adding")
                  : t("addDonation")}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full lg:w-auto lg:px-8 h-12 sm:h-14 text-base sm:text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={createDonationMutation.isPending}
                onClick={(e) => {
                  // Prevent clicks while form is submitting
                  if (createDonationMutation.isPending) {
                    e.preventDefault();
                    return false;
                  }
                  
                  form.reset({
                    receiptNo: "",
                    name: "",
                    phone: "",
                    community: undefined,
                    location: "",
                    amount: undefined,
                    paymentMode: "cash",
                    inscription: false,
                    donationDate: "",
                  });
                  setDonorHistory(null);
                  setReceiptError("");
                  // Clear any form validation errors
                  form.clearErrors();
                }}
              >
                {t("reset")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              {language === "en"
                ? "Donation successfully added"
                : "நன்கொடை வெற்றிகரமாக சேர்க்கப்பட்டது"}
            </DialogTitle>
            <DialogDescription className="text-center space-y-2">
              {successData && (
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {language === "en" ? "Receipt Number:" : "ரசீது எண்:"}
                      </span>
                      <span className="font-mono">{successData.receiptNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {language === "en"
                          ? "Donor Name:"
                          : "நன்கொடையாளர் பெயர்:"}
                      </span>
                      <span>{successData.name}</span>
                    </div>
                    {successData.community &&
                      successData.community !== "any" && (
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {language === "en" ? "Kulam:" : "குலம்:"}
                          </span>
                          <span>{successData.community}</span>
                        </div>
                      )}
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {language === "en" ? "Amount:" : "தொகை:"}
                      </span>
                      <span className="font-semibold text-green-600">
                        {language === "en"
                          ? formatCurrency(successData.amount)
                          : formatCurrencyTamil(successData.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">
                        {language === "en"
                          ? "Payment Mode:"
                          : "பணம் செலுத்தும் முறை:"}
                      </span>
                      <span className="capitalize">
                        {successData.paymentMode}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-6">
            <Button
              onClick={() => setShowSuccessDialog(false)}
              className="w-full sm:w-auto"
            >
              {language === "en" ? "Continue" : "தொடரவும்"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
