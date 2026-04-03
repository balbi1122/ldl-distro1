import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Zap,
  Home,
  Hammer,
  HardHat,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { loanService, LoanLeadInput, LoanType } from "@/services/LoanService";
import { cn } from "@/lib/utils";

// ─── Constants ───────────────────────────────────────────────────────────────

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma",
  "Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee",
  "Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

const VALUE_RANGES = [
  { value: "under_100k", label: "Under $100,000" },
  { value: "100k_250k", label: "$100,000 – $250,000" },
  { value: "250k_500k", label: "$250,000 – $500,000" },
  { value: "500k_1m", label: "$500,000 – $1,000,000" },
  { value: "1m_2m", label: "$1,000,000 – $2,000,000" },
  { value: "2m_plus", label: "$2,000,000+" },
];

const LOAN_AMOUNT_RANGES = [
  { value: "50k_100k", label: "$50,000 – $100,000" },
  { value: "100k_250k", label: "$100,000 – $250,000" },
  { value: "250k_500k", label: "$250,000 – $500,000" },
  { value: "500k_1m", label: "$500,000 – $1,000,000" },
  { value: "1m_plus", label: "$1,000,000+" },
];

// ─── Form State Type ─────────────────────────────────────────────────────────

interface FormData {
  loan_type: LoanType | "";
  property_address: string;
  property_type: string;
  property_state: string;
  estimated_value: string;
  purchase_price: string;
  rehab_budget: string;
  after_repair_value: string;
  lot_owned: boolean | null;
  construction_budget: string;
  monthly_rent: string;
  loan_amount: string;
  estimated_ltv: string;
  timeline: string;
  credit_score_range: string;
  real_estate_experience: string;
  full_name: string;
  email: string;
  phone: string;
}

const INITIAL_FORM: FormData = {
  loan_type: "",
  property_address: "",
  property_type: "",
  property_state: "",
  estimated_value: "",
  purchase_price: "",
  rehab_budget: "",
  after_repair_value: "",
  lot_owned: null,
  construction_budget: "",
  monthly_rent: "",
  loan_amount: "",
  estimated_ltv: "",
  timeline: "",
  credit_score_range: "",
  real_estate_experience: "",
  full_name: "",
  email: "",
  phone: "",
};

// ─── Progress Bar ────────────────────────────────────────────────────────────

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, labels }) => (
  <div className="w-full mb-8">
    <div className="flex items-center justify-between mb-2">
      {labels.map((label, idx) => {
        const step = idx + 1;
        const isCompleted = step < currentStep;
        const isActive = step === currentStep;
        return (
          <div key={label} className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 transition-colors",
                isCompleted && "bg-green-500 text-white",
                isActive && "bg-amber-500 text-slate-950",
                !isCompleted && !isActive && "bg-slate-200 text-slate-400"
              )}
            >
              {isCompleted ? <CheckCircle className="h-5 w-5" /> : step}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                isActive ? "text-amber-600" : "text-slate-400"
              )}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
    <div className="relative h-1.5 bg-slate-200 rounded-full">
      <div
        className="absolute left-0 top-0 h-full bg-amber-500 rounded-full transition-all duration-500"
        style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
      />
    </div>
  </div>
);

// ─── Field Error ─────────────────────────────────────────────────────────────

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
  message ? <p className="text-red-500 text-xs mt-1">{message}</p> : null;

// ─── Main Component ──────────────────────────────────────────────────────────

const ApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const STEPS = ["Loan Type", "Property", "Loan Details", "Contact"];

  // ─── Helpers ──────────────────────────────────────────────────────────────

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const addError = (key: keyof FormData, msg: string) => {
    setErrors((prev) => ({ ...prev, [key]: msg }));
  };

  // ─── Validation ───────────────────────────────────────────────────────────

  const validateStep1 = () => {
    if (!form.loan_type) {
      addError("loan_type", "Please select a loan type to continue.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    let valid = true;
    if (!form.property_address.trim()) {
      addError("property_address", "Property address is required.");
      valid = false;
    }
    if (!form.property_type) {
      addError("property_type", "Please select a property type.");
      valid = false;
    }
    if (!form.property_state) {
      addError("property_state", "Please select a state.");
      valid = false;
    }
    if (!form.estimated_value) {
      addError("estimated_value", "Please select an estimated property value.");
      valid = false;
    }
    if (!form.purchase_price) {
      addError("purchase_price", "Please select a value for this field.");
      valid = false;
    }
    if (form.loan_type === "fix_flip") {
      if (!form.rehab_budget) {
        addError("rehab_budget", "Rehab budget is required for fix & flip loans.");
        valid = false;
      }
      if (!form.after_repair_value) {
        addError("after_repair_value", "After repair value is required.");
        valid = false;
      }
    }
    if (form.loan_type === "ground_up") {
      if (form.lot_owned === null) {
        addError("lot_owned", "Please indicate if you own the lot.");
        valid = false;
      }
      if (!form.construction_budget) {
        addError("construction_budget", "Construction budget is required.");
        valid = false;
      }
    }
    return valid;
  };

  const validateStep3 = () => {
    let valid = true;
    if (!form.loan_amount) {
      addError("loan_amount", "Please select a loan amount range.");
      valid = false;
    }
    if (!form.estimated_ltv) {
      addError("estimated_ltv", "Please select an estimated LTV.");
      valid = false;
    }
    if (!form.timeline) {
      addError("timeline", "Please select your funding timeline.");
      valid = false;
    }
    if (!form.credit_score_range) {
      addError("credit_score_range", "Please select a credit score range.");
      valid = false;
    }
    if (!form.real_estate_experience) {
      addError("real_estate_experience", "Please select your experience level.");
      valid = false;
    }
    return valid;
  };

  const validateStep4 = () => {
    let valid = true;
    if (!form.full_name.trim()) {
      addError("full_name", "Full name is required.");
      valid = false;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      addError("email", "A valid email address is required.");
      valid = false;
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length < 10) {
      addError("phone", "A valid 10-digit phone number is required.");
      valid = false;
    }
    return valid;
  };

  // ─── Navigation ───────────────────────────────────────────────────────────

  const next = () => {
    setErrors({});
    const validators = [null, validateStep1, validateStep2, validateStep3, validateStep4];
    if (validators[step]?.()) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setErrors({});
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async () => {
    setErrors({});
    if (!validateStep4()) return;

    setSubmitting(true);
    setSubmitError(null);

    const input: LoanLeadInput = {
      loan_type: form.loan_type as LoanType,
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      property_address: form.property_address || undefined,
      property_type: (form.property_type as LoanLeadInput["property_type"]) || undefined,
      property_state: form.property_state || undefined,
      estimated_value: form.estimated_value || undefined,
      purchase_price: form.purchase_price || undefined,
      loan_amount: form.loan_amount || undefined,
      estimated_ltv: form.estimated_ltv || undefined,
      timeline: (form.timeline as LoanLeadInput["timeline"]) || undefined,
      credit_score_range: (form.credit_score_range as LoanLeadInput["credit_score_range"]) || undefined,
      real_estate_experience: (form.real_estate_experience as LoanLeadInput["real_estate_experience"]) || undefined,
      ...(form.loan_type === "dscr" && { monthly_rent: form.monthly_rent || undefined }),
      ...(form.loan_type === "fix_flip" && {
        rehab_budget: form.rehab_budget || undefined,
        after_repair_value: form.after_repair_value || undefined,
      }),
      ...(form.loan_type === "ground_up" && {
        lot_owned: form.lot_owned ?? undefined,
        construction_budget: form.construction_budget || undefined,
      }),
    };

    const result = await loanService.submit(input);

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setSubmitError(
        result.error ??
          "Something went wrong submitting your application. Please try again or call us directly."
      );
    }
  };

  // ─── Success Screen ───────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          <div className="mx-auto max-w-4xl px-6 py-3 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-500">
                <Zap className="h-5 w-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                LiteDOC<span className="text-amber-500">.LOANS</span>
              </span>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-20">
          <div className="text-center max-w-lg">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
              You're on Your Way!
            </h1>
            <p className="text-lg text-slate-600 mb-2">
              <span className="font-semibold text-slate-900">{form.full_name}</span>, your application has been received.
            </p>
            <p className="text-slate-500 mb-8">
              A LiteDOC advisor will contact you at{" "}
              <span className="font-semibold text-slate-700">{form.email}</span> within 24 hours to discuss your loan options.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-left space-y-2">
              <p className="text-sm font-semibold text-amber-800">What happens next:</p>
              <ul className="text-sm text-amber-700 space-y-1">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  A loan advisor reviews your deal within hours
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  You'll receive a preliminary term sheet within 24 hours
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  Close in as little as 10 business days
                </li>
              </ul>
            </div>
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={() => navigate("/")}
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-4xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-500">
              <Zap className="h-5 w-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              LiteDOC<span className="text-amber-500">.LOANS</span>
            </span>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 mb-1">
            Apply for a Loan
          </h1>
          <p className="text-slate-500 text-sm">
            Step {step} of {STEPS.length} — {STEPS[step - 1]}
          </p>
        </div>

        <ProgressBar currentStep={step} totalSteps={STEPS.length} labels={STEPS} />

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">

          {/* ── Step 1: Loan Type ── */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">What type of loan are you looking for?</h2>
              <p className="text-slate-500 text-sm mb-6">Select the program that best fits your investing strategy.</p>
              {errors.loan_type && (
                <p className="text-red-500 text-sm mb-4">{errors.loan_type}</p>
              )}
              <div className="space-y-4">
                {[
                  {
                    type: "dscr" as LoanType,
                    icon: <Home className="h-7 w-7 text-blue-500" />,
                    title: "DSCR Rental Loan",
                    subtitle: "Qualify on rental income — not personal income",
                    features: ["No W-2s or tax returns", "30-year fixed available", "Short-term rentals OK", "No prepay penalty after 6 months"],
                    color: "border-blue-400 bg-blue-50",
                    selectedColor: "border-blue-500 bg-blue-50 ring-2 ring-blue-400",
                    badgeColor: "bg-blue-100 text-blue-700",
                  },
                  {
                    type: "fix_flip" as LoanType,
                    icon: <Hammer className="h-7 w-7 text-amber-500" />,
                    title: "Fix & Flip",
                    subtitle: "Up to 90% of purchase + 100% of rehab costs",
                    features: ["No prior experience required", "100% rehab financing", "Close in 10 business days", "1–2 pts origination"],
                    color: "border-amber-300 bg-amber-50",
                    selectedColor: "border-amber-500 bg-amber-50 ring-2 ring-amber-400",
                    badgeColor: "bg-amber-100 text-amber-700",
                  },
                  {
                    type: "ground_up" as LoanType,
                    icon: <HardHat className="h-7 w-7 text-green-600" />,
                    title: "Ground-Up Construction",
                    subtitle: "Up to 90% LTC — lot owned or being acquired",
                    features: ["90% LTC (competitors cap at 85%)", "Lot acquisition included", "Interest-only during construction", "Up to 24-month term"],
                    color: "border-green-300 bg-green-50",
                    selectedColor: "border-green-500 bg-green-50 ring-2 ring-green-400",
                    badgeColor: "bg-green-100 text-green-700",
                  },
                ].map((option) => (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => set("loan_type", option.type)}
                    className={cn(
                      "w-full text-left rounded-xl border-2 p-5 transition-all",
                      form.loan_type === option.type
                        ? option.selectedColor
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-0.5">{option.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-slate-900 text-base">{option.title}</span>
                          {form.loan_type === option.type && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-slate-600 text-sm mb-3">{option.subtitle}</p>
                        <div className="flex flex-wrap gap-2">
                          {option.features.map((f) => (
                            <Badge key={f} className={`text-xs ${option.badgeColor} border-0`}>
                              {f}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 2: Property Details ── */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Tell us about the property</h2>
                <p className="text-slate-500 text-sm">We'll use this to assess the deal and craft your term sheet.</p>
              </div>

              {/* Property Address */}
              <div>
                <Label htmlFor="property_address" className="text-sm font-semibold text-slate-700">
                  Property Address
                </Label>
                <Input
                  id="property_address"
                  placeholder="123 Main St, City, State 12345"
                  className="mt-1.5"
                  value={form.property_address}
                  onChange={(e) => set("property_address", e.target.value)}
                />
                <FieldError message={errors.property_address} />
              </div>

              {/* Property Type */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Property Type</Label>
                <Select value={form.property_type} onValueChange={(v) => set("property_type", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_family">Single Family</SelectItem>
                    <SelectItem value="multi_family_2_4">Multi-Family (2–4 units)</SelectItem>
                    <SelectItem value="multi_family_5_plus">Multi-Family (5+ units)</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.property_type} />
              </div>

              {/* State */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">State</Label>
                <Select value={form.property_state} onValueChange={(v) => set("property_state", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.property_state} />
              </div>

              {/* Estimated Property Value */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Estimated Property Value</Label>
                <Select value={form.estimated_value} onValueChange={(v) => set("estimated_value", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALUE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.estimated_value} />
              </div>

              {/* Purchase Price / Current Value */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">
                  {form.loan_type === "dscr" ? "Current Value / Purchase Price" : "Purchase Price"}
                </Label>
                <Select value={form.purchase_price} onValueChange={(v) => set("purchase_price", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALUE_RANGES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.purchase_price} />
              </div>

              {/* DSCR: Monthly Rent */}
              {form.loan_type === "dscr" && (
                <div>
                  <Label htmlFor="monthly_rent" className="text-sm font-semibold text-slate-700">
                    Monthly Rent / Expected Rent
                  </Label>
                  <Input
                    id="monthly_rent"
                    placeholder="e.g. $2,500/month"
                    className="mt-1.5"
                    value={form.monthly_rent}
                    onChange={(e) => set("monthly_rent", e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1">Enter current or projected monthly rent income.</p>
                </div>
              )}

              {/* Fix & Flip: Rehab Budget & ARV */}
              {form.loan_type === "fix_flip" && (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Rehab Budget</Label>
                    <Select value={form.rehab_budget} onValueChange={(v) => set("rehab_budget", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_RANGES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.rehab_budget} />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">After Repair Value (ARV)</Label>
                    <Select value={form.after_repair_value} onValueChange={(v) => set("after_repair_value", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_RANGES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.after_repair_value} />
                  </div>
                </>
              )}

              {/* Ground-Up: Lot Owned + Construction Budget */}
              {form.loan_type === "ground_up" && (
                <>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Do you own the lot?</Label>
                    <div className="flex gap-3 mt-1.5">
                      {[
                        { label: "Yes, I own the lot", value: true },
                        { label: "No, acquiring with loan", value: false },
                      ].map((opt) => (
                        <button
                          key={String(opt.value)}
                          type="button"
                          onClick={() => set("lot_owned", opt.value)}
                          className={cn(
                            "flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all",
                            form.lot_owned === opt.value
                              ? "border-amber-500 bg-amber-50 text-amber-800"
                              : "border-slate-200 text-slate-600 hover:border-slate-300"
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                    <FieldError message={errors.lot_owned} />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700">Construction Budget</Label>
                    <Select value={form.construction_budget} onValueChange={(v) => set("construction_budget", v)}>
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder="Select a range" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_RANGES.map((r) => (
                          <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError message={errors.construction_budget} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Step 3: Loan Details ── */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Loan details</h2>
                <p className="text-slate-500 text-sm">Help us understand what you're looking for in terms of financing.</p>
              </div>

              {/* Loan Amount */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Loan Amount Requested</Label>
                <Select value={form.loan_amount} onValueChange={(v) => set("loan_amount", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_AMOUNT_RANGES.map((r) => (
                      <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError message={errors.loan_amount} />
              </div>

              {/* Estimated LTV */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Estimated LTV / LTC</Label>
                <Select value={form.estimated_ltv} onValueChange={(v) => set("estimated_ltv", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select a range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under_65">Under 65%</SelectItem>
                    <SelectItem value="65_70">65% – 70%</SelectItem>
                    <SelectItem value="70_75">70% – 75%</SelectItem>
                    <SelectItem value="75_80">75% – 80%</SelectItem>
                    <SelectItem value="80_85">80% – 85%</SelectItem>
                    <SelectItem value="85_90">85% – 90%</SelectItem>
                    <SelectItem value="over_90">Over 90%</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.estimated_ltv} />
              </div>

              {/* Timeline */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">When do you need funding?</Label>
                <Select value={form.timeline} onValueChange={(v) => set("timeline", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP (as soon as possible)</SelectItem>
                    <SelectItem value="1_month">Within 1 month</SelectItem>
                    <SelectItem value="2_3_months">1–2 months</SelectItem>
                    <SelectItem value="3_plus_months">3+ months</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.timeline} />
              </div>

              {/* Credit Score */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Credit Score Range</Label>
                <Select value={form.credit_score_range} onValueChange={(v) => set("credit_score_range", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="750_plus">750+ (Excellent)</SelectItem>
                    <SelectItem value="700_749">700 – 749 (Good)</SelectItem>
                    <SelectItem value="650_699">650 – 699 (Fair)</SelectItem>
                    <SelectItem value="600_649">600 – 649 (Below Average)</SelectItem>
                    <SelectItem value="below_600">Below 600</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.credit_score_range} />
              </div>

              {/* Real Estate Experience */}
              <div>
                <Label className="text-sm font-semibold text-slate-700">Real Estate Investing Experience</Label>
                <Select value={form.real_estate_experience} onValueChange={(v) => set("real_estate_experience", v)}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_time">First-time investor</SelectItem>
                    <SelectItem value="1_3_deals">1–3 completed deals</SelectItem>
                    <SelectItem value="4_10_deals">4–10 deals</SelectItem>
                    <SelectItem value="10_plus_deals">10+ deals</SelectItem>
                  </SelectContent>
                </Select>
                <FieldError message={errors.real_estate_experience} />
              </div>
            </div>
          )}

          {/* ── Step 4: Contact Info ── */}
          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Almost done — contact info</h2>
                <p className="text-slate-500 text-sm">A LiteDOC advisor will reach out within 24 hours.</p>
              </div>

              <div>
                <Label htmlFor="full_name" className="text-sm font-semibold text-slate-700">Full Name</Label>
                <Input
                  id="full_name"
                  placeholder="John Smith"
                  className="mt-1.5"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                />
                <FieldError message={errors.full_name} />
              </div>

              <div>
                <Label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="mt-1.5"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FieldError message={errors.email} />
              </div>

              <div>
                <Label htmlFor="phone" className="text-sm font-semibold text-slate-700">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                  className="mt-1.5"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <FieldError message={errors.phone} />
              </div>

              {/* Summary card */}
              <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 text-sm">
                <p className="font-semibold text-slate-700 mb-2">Application Summary</p>
                <div className="space-y-1 text-slate-500">
                  <p>
                    <span className="font-medium text-slate-700">Loan Type:</span>{" "}
                    {form.loan_type === "dscr"
                      ? "DSCR Rental Loan"
                      : form.loan_type === "fix_flip"
                      ? "Fix & Flip"
                      : "Ground-Up Construction"}
                  </p>
                  {form.property_state && (
                    <p><span className="font-medium text-slate-700">State:</span> {form.property_state}</p>
                  )}
                  {form.loan_amount && (
                    <p>
                      <span className="font-medium text-slate-700">Loan Amount:</span>{" "}
                      {LOAN_AMOUNT_RANGES.find((r) => r.value === form.loan_amount)?.label}
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <p className="text-xs text-slate-400 text-center">
                No spam. A LiteDOC loan advisor will contact you within 24 hours.
                Your information is kept strictly confidential.
              </p>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={back}
              className="flex items-center gap-2"
              disabled={submitting}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < STEPS.length ? (
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-2"
              onClick={next}
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-8 flex items-center gap-2"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Application"}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" /> No SSN required upfront
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" /> No obligation
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-green-500" /> Response within 24 hours
          </span>
        </div>
      </main>
    </div>
  );
};

export default ApplyPage;
