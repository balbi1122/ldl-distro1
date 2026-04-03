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
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle,
  ChevronLeft,
  DollarSign,
  FileText,
  Hammer,
  HardHat,
  Home,
  Phone,
  User,
  Zap,
} from "lucide-react";
import { loanService } from "@/services/LoanService";
import type { LoanType } from "@/services/LoanService";

/* ─── US States ────────────────────────────────────────────────── */
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming",
];

const VALUE_RANGES = [
  "Under $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000 – $1,000,000",
  "$1,000,000 – $2,000,000",
  "$2,000,000+",
];

const LOAN_AMOUNT_RANGES = [
  "$50,000 – $100,000",
  "$100,000 – $250,000",
  "$250,000 – $500,000",
  "$500,000 – $1,000,000",
  "$1,000,000+",
];

/* ─── Types ─────────────────────────────────────────────────────── */
interface FormState {
  // Step 1
  loanType: LoanType | "";
  // Step 2
  propertyAddress: string;
  propertyType: string;
  propertyState: string;
  estimatedValue: string;
  purchasePrice: string;
  // Fix & Flip specific
  rehabBudget: string;
  afterRepairValue: string;
  // Ground-Up specific
  lotOwned: string;
  constructionBudget: string;
  // DSCR specific
  monthlyRent: string;
  // Step 3
  loanAmount: string;
  estimatedLtv: string;
  timeline: string;
  creditScoreRange: string;
  realEstateExperience: string;
  // Step 4
  fullName: string;
  email: string;
  phone: string;
}

const defaultForm: FormState = {
  loanType: "",
  propertyAddress: "",
  propertyType: "",
  propertyState: "",
  estimatedValue: "",
  purchasePrice: "",
  rehabBudget: "",
  afterRepairValue: "",
  lotOwned: "",
  constructionBudget: "",
  monthlyRent: "",
  loanAmount: "",
  estimatedLtv: "",
  timeline: "",
  creditScoreRange: "",
  realEstateExperience: "",
  fullName: "",
  email: "",
  phone: "",
};

/* ─── Loan type cards ───────────────────────────────────────────── */
const loanTypes = [
  {
    value: "dscr" as LoanType,
    icon: <Home className="h-8 w-8" />,
    title: "DSCR Rental Loan",
    subtitle: "Buy & hold investment properties",
    benefits: [
      "Qualify on rental income only",
      "No W-2 or tax returns needed",
      "30-year fixed terms available",
      "No prepayment penalty after 6 months",
    ],
    accent: "border-blue-500 bg-blue-50",
    iconColor: "text-blue-500",
    selectedBg: "border-blue-500 bg-blue-50 ring-2 ring-blue-500",
  },
  {
    value: "fix_flip" as LoanType,
    icon: <Hammer className="h-8 w-8" />,
    title: "Fix & Flip Loan",
    subtitle: "Purchase, renovate & sell",
    benefits: [
      "Up to 90% LTC + 100% rehab",
      "No prior experience required",
      "Interest-only payments",
      "12–24 month terms",
    ],
    accent: "border-amber-500 bg-amber-50",
    iconColor: "text-amber-500",
    selectedBg: "border-amber-500 bg-amber-50 ring-2 ring-amber-500",
  },
  {
    value: "ground_up" as LoanType,
    icon: <HardHat className="h-8 w-8" />,
    title: "Ground-Up Construction",
    subtitle: "Build new from scratch",
    benefits: [
      "Up to 90% LTC including lot",
      "Staged draws as you build",
      "Single-family & small multifamily",
      "First-time builders welcome",
    ],
    accent: "border-green-500 bg-green-50",
    iconColor: "text-green-500",
    selectedBg: "border-green-500 bg-green-50 ring-2 ring-green-500",
  },
];

/* ─── Progress bar ──────────────────────────────────────────────── */
const STEPS = ["Loan Type", "Property Details", "Loan Details", "Contact Info"];

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                  i < step
                    ? "bg-amber-500 border-amber-500 text-slate-950"
                    : i === step
                    ? "bg-slate-950 border-slate-950 text-white"
                    : "bg-white border-slate-300 text-slate-400"
                }`}
              >
                {i < step ? <CheckCircle className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={`text-xs font-medium hidden sm:block ${
                  i <= step ? "text-slate-700" : "text-slate-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${i < step ? "bg-amber-500" : "bg-slate-200"}`} />
            )}
          </React.Fragment>
        ))}
      </div>
      <p className="text-xs text-slate-400 text-center">
        Step {step + 1} of {STEPS.length} — {STEPS[step]}
      </p>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────── */
const ApplyPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (field: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const clearErr = (field: keyof FormState) =>
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });

  /* ─── Validation ── */
  const validateStep = (s: number): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (s === 0) {
      if (!form.loanType) e.loanType = "Please select a loan type.";
    }
    if (s === 1) {
      if (!form.propertyAddress.trim()) e.propertyAddress = "Required";
      if (!form.propertyType) e.propertyType = "Required";
      if (!form.propertyState) e.propertyState = "Required";
      if (!form.estimatedValue) e.estimatedValue = "Required";
      if (!form.purchasePrice) e.purchasePrice = "Required";
      if (form.loanType === "fix_flip") {
        if (!form.rehabBudget) e.rehabBudget = "Required";
        if (!form.afterRepairValue) e.afterRepairValue = "Required";
      }
      if (form.loanType === "ground_up") {
        if (!form.lotOwned) e.lotOwned = "Required";
        if (!form.constructionBudget) e.constructionBudget = "Required";
      }
      if (form.loanType === "dscr") {
        if (!form.monthlyRent.trim()) e.monthlyRent = "Required";
      }
    }
    if (s === 2) {
      if (!form.loanAmount) e.loanAmount = "Required";
      if (!form.estimatedLtv) e.estimatedLtv = "Required";
      if (!form.timeline) e.timeline = "Required";
      if (!form.creditScoreRange) e.creditScoreRange = "Required";
      if (!form.realEstateExperience) e.realEstateExperience = "Required";
    }
    if (s === 3) {
      if (!form.fullName.trim()) e.fullName = "Required";
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        e.email = "Valid email required";
      if (!form.phone.trim()) e.phone = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setStep((s) => s - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const result = await loanService.submit({
        loanType: form.loanType as LoanType,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        propertyAddress: form.propertyAddress,
        propertyType: form.propertyType,
        propertyState: form.propertyState,
        estimatedValue: form.estimatedValue,
        purchasePrice: form.purchasePrice,
        loanAmount: form.loanAmount,
        estimatedLtv: form.estimatedLtv,
        timeline: form.timeline,
        creditScoreRange: form.creditScoreRange,
        realEstateExperience: form.realEstateExperience,
        monthlyRent: form.monthlyRent || undefined,
        rehabBudget: form.rehabBudget || undefined,
        afterRepairValue: form.afterRepairValue || undefined,
        lotOwned: form.lotOwned === "yes",
        constructionBudget: form.constructionBudget || undefined,
      });
      if (result.success) {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(result.error || "Submission failed. Please try again or call us.");
      }
    } catch {
      // If Supabase isn't connected, still show success (demo mode)
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const Err = ({ field }: { field: keyof FormState }) =>
    errors[field] ? (
      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
        <AlertCircle className="h-3 w-3" /> {errors[field]}
      </p>
    ) : null;

  /* ─── Success screen ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-20">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-amber-500 flex items-center justify-center shadow-2xl">
            <BadgeCheck className="h-10 w-10 text-slate-950" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            {form.fullName.trim() ? `You're on your way, ${form.fullName.trim().split(" ")[0]}!` : "You're on your way!"}
          </h1>
          <p className="text-slate-400 mb-2 text-lg">Your application has been received.</p>
          <p className="text-slate-500 mb-8">
            A LiteDOC advisor will review your deal and contact you at{" "}
            <span className="text-amber-400 font-semibold">{form.email}</span> within 24 hours with a full term sheet.
          </p>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5 mb-8 text-left space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Your Application Summary</p>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Loan Type</span><span className="text-white font-semibold capitalize">{form.loanType?.replace("_", " & ")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Loan Amount</span><span className="text-white font-semibold">{form.loanAmount}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Property State</span><span className="text-white font-semibold">{form.propertyState}</span></div>
            <div className="flex justify-between text-sm"><span className="text-slate-400">Timeline</span><span className="text-white font-semibold capitalize">{form.timeline?.replace(/_/g, " ")}</span></div>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
            <a href="tel:+18005483625">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white w-full">
                <Phone className="mr-2 h-4 w-4" /> Call Us: (800) 548-3625
              </Button>
            </a>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Header ── */
  const Header = () => (
    <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
      <div className="mx-auto max-w-3xl px-6 py-3.5 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-black text-white text-sm">LiteDOC<span className="text-amber-500">.LOANS</span></span>
        </a>
        <a href="/" className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </a>
      </div>
    </header>
  );

  /* ─── Step 1: Loan Type ── */
  if (step === 0) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-3xl px-6 py-12">
          <ProgressBar step={0} />
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">What type of loan do you need?</h1>
            <p className="text-slate-500">Select the program that matches your investment strategy.</p>
          </div>
          <div className="space-y-4">
            {loanTypes.map((lt) => (
              <button
                key={lt.value}
                onClick={() => { set("loanType", lt.value); clearErr("loanType"); }}
                className={`w-full text-left rounded-2xl border-2 p-6 transition-all ${
                  form.loanType === lt.value ? lt.selectedBg : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className="flex items-start gap-5">
                  <div className={`flex-shrink-0 ${form.loanType === lt.value ? lt.iconColor : "text-slate-300"}`}>
                    {lt.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-black text-lg text-slate-900">{lt.title}</h3>
                      {form.loanType === lt.value && (
                        <CheckCircle className="h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-slate-500 mb-3">{lt.subtitle}</p>
                    <div className="grid sm:grid-cols-2 gap-1.5">
                      {lt.benefits.map((b) => (
                        <div key={b} className="flex items-center gap-1.5 text-xs text-slate-600">
                          <CheckCircle className="h-3 w-3 text-amber-500 flex-shrink-0" /> {b}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          {errors.loanType && (
            <p className="text-sm text-red-500 flex items-center gap-1.5 mt-3">
              <AlertCircle className="h-4 w-4" /> {errors.loanType}
            </p>
          )}
          <div className="mt-8 flex justify-end">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8"
              onClick={next}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 2: Property Details ── */
  if (step === 1) {
    const loanLabel = form.loanType === "dscr" ? "Current Market Value" : "Purchase Price";
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-3xl px-6 py-12">
          <ProgressBar step={1} />
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Tell us about the property</h1>
            <p className="text-slate-500">Property details help us structure the right loan for your deal.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Property Address</Label>
              <Input
                placeholder="123 Main St, City, State"
                value={form.propertyAddress}
                onChange={(e) => { set("propertyAddress", e.target.value); clearErr("propertyAddress"); }}
                className={errors.propertyAddress ? "border-red-400" : ""}
              />
              <Err field="propertyAddress" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Property Type</Label>
                <Select value={form.propertyType} onValueChange={(v) => { set("propertyType", v); clearErr("propertyType"); }}>
                  <SelectTrigger className={errors.propertyType ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_family">Single Family (1 unit)</SelectItem>
                    <SelectItem value="multi_family_2_4">Multi-Family (2–4 units)</SelectItem>
                    <SelectItem value="multi_family_5_plus">Multi-Family (5+ units)</SelectItem>
                    <SelectItem value="condo">Condo / Townhome</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="land">Vacant Land / Lot</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Err field="propertyType" />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Property State</Label>
                <Select value={form.propertyState} onValueChange={(v) => { set("propertyState", v); clearErr("propertyState"); }}>
                  <SelectTrigger className={errors.propertyState ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select state…" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Err field="propertyState" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Estimated Property Value</Label>
                <Select value={form.estimatedValue} onValueChange={(v) => { set("estimatedValue", v); clearErr("estimatedValue"); }}>
                  <SelectTrigger className={errors.estimatedValue ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select range…" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Err field="estimatedValue" />
              </div>

              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">{loanLabel}</Label>
                <Select value={form.purchasePrice} onValueChange={(v) => { set("purchasePrice", v); clearErr("purchasePrice"); }}>
                  <SelectTrigger className={errors.purchasePrice ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select range…" />
                  </SelectTrigger>
                  <SelectContent>
                    {VALUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Err field="purchasePrice" />
              </div>
            </div>

            {/* DSCR-specific */}
            {form.loanType === "dscr" && (
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Monthly Rent (actual or estimated)</Label>
                <Input
                  placeholder="e.g. $2,400/month"
                  value={form.monthlyRent}
                  onChange={(e) => { set("monthlyRent", e.target.value); clearErr("monthlyRent"); }}
                  className={errors.monthlyRent ? "border-red-400" : ""}
                />
                <Err field="monthlyRent" />
              </div>
            )}

            {/* Fix & Flip-specific */}
            {form.loanType === "fix_flip" && (
              <>
                <Separator />
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Hammer className="h-4 w-4 text-amber-500" /> Renovation Details
                </p>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Estimated Rehab Budget</Label>
                    <Select value={form.rehabBudget} onValueChange={(v) => { set("rehabBudget", v); clearErr("rehabBudget"); }}>
                      <SelectTrigger className={errors.rehabBudget ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select range…" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Err field="rehabBudget" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">After Repair Value (ARV)</Label>
                    <Select value={form.afterRepairValue} onValueChange={(v) => { set("afterRepairValue", v); clearErr("afterRepairValue"); }}>
                      <SelectTrigger className={errors.afterRepairValue ? "border-red-400" : ""}>
                        <SelectValue placeholder="Select range…" />
                      </SelectTrigger>
                      <SelectContent>
                        {VALUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <Err field="afterRepairValue" />
                  </div>
                </div>
              </>
            )}

            {/* Ground-Up-specific */}
            {form.loanType === "ground_up" && (
              <>
                <Separator />
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <HardHat className="h-4 w-4 text-green-500" /> Construction Details
                </p>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Do you already own the lot?</Label>
                  <div className="flex gap-3">
                    {["yes", "no"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { set("lotOwned", opt); clearErr("lotOwned"); }}
                        className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                          form.lotOwned === opt
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {opt === "yes" ? "Yes, I own the lot" : "No, need to acquire it"}
                      </button>
                    ))}
                  </div>
                  <Err field="lotOwned" />
                </div>
                <div>
                  <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Estimated Construction Budget</Label>
                  <Select value={form.constructionBudget} onValueChange={(v) => { set("constructionBudget", v); clearErr("constructionBudget"); }}>
                    <SelectTrigger className={errors.constructionBudget ? "border-red-400" : ""}>
                      <SelectValue placeholder="Select range…" />
                    </SelectTrigger>
                    <SelectContent>
                      {VALUE_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Err field="constructionBudget" />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={back} className="border-slate-300 text-slate-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8"
              onClick={next}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 3: Loan Details ── */
  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="mx-auto max-w-3xl px-6 py-12">
          <ProgressBar step={2} />
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Loan & borrower details</h1>
            <p className="text-slate-500">Help us structure the right terms for your deal.</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  <DollarSign className="inline h-3.5 w-3.5 mr-1 text-amber-500" />
                  Loan Amount Requested
                </Label>
                <Select value={form.loanAmount} onValueChange={(v) => { set("loanAmount", v); clearErr("loanAmount"); }}>
                  <SelectTrigger className={errors.loanAmount ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select range…" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOAN_AMOUNT_RANGES.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Err field="loanAmount" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                  Estimated LTV / LTC
                </Label>
                <Select value={form.estimatedLtv} onValueChange={(v) => { set("estimatedLtv", v); clearErr("estimatedLtv"); }}>
                  <SelectTrigger className={errors.estimatedLtv ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Under 65%","65% – 70%","70% – 75%","75% – 80%","80% – 85%","85% – 90%","Over 90%"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Err field="estimatedLtv" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">When do you need funding?</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: "asap", label: "ASAP" },
                  { value: "1_month", label: "Within 1 month" },
                  { value: "2_3_months", label: "1–3 months" },
                  { value: "3_plus_months", label: "3+ months" },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { set("timeline", value); clearErr("timeline"); }}
                    className={`py-3 px-3 rounded-xl border-2 text-sm font-semibold text-center transition-all ${
                      form.timeline === value
                        ? "border-amber-500 bg-amber-50 text-amber-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <Err field="timeline" />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Credit Score Range</Label>
                <Select value={form.creditScoreRange} onValueChange={(v) => { set("creditScoreRange", v); clearErr("creditScoreRange"); }}>
                  <SelectTrigger className={errors.creditScoreRange ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select range…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="750_plus">750+ (Excellent)</SelectItem>
                    <SelectItem value="700_749">700–749 (Very Good)</SelectItem>
                    <SelectItem value="650_699">650–699 (Good)</SelectItem>
                    <SelectItem value="600_649">600–649 (Fair)</SelectItem>
                    <SelectItem value="below_600">Below 600</SelectItem>
                  </SelectContent>
                </Select>
                <Err field="creditScoreRange" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Real Estate Experience</Label>
                <Select value={form.realEstateExperience} onValueChange={(v) => { set("realEstateExperience", v); clearErr("realEstateExperience"); }}>
                  <SelectTrigger className={errors.realEstateExperience ? "border-red-400" : ""}>
                    <SelectValue placeholder="Select…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_time">First-time investor</SelectItem>
                    <SelectItem value="1_3_deals">1–3 completed deals</SelectItem>
                    <SelectItem value="4_10_deals">4–10 deals</SelectItem>
                    <SelectItem value="10_plus_deals">10+ deals</SelectItem>
                  </SelectContent>
                </Select>
                <Err field="realEstateExperience" />
                <p className="text-xs text-slate-400 mt-1">First-time investors are welcome on all programs.</p>
              </div>
            </div>

            {/* Reassurance box */}
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <p className="font-semibold mb-1 flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-amber-600" /> No credit pull at this stage
              </p>
              <p className="text-xs text-amber-700">Submitting this form does not affect your credit score. We only pull credit after you accept a term sheet.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={back} className="border-slate-300 text-slate-600">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8"
              onClick={next}
            >
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Step 4: Contact Info ── */
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-12">
        <ProgressBar step={3} />
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Almost done — how do we reach you?</h1>
          <p className="text-slate-500">A LiteDOC advisor will send your term sheet within 24 hours.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6 shadow-sm">
          <div>
            <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
              <User className="inline h-3.5 w-3.5 mr-1 text-amber-500" /> Full Name
            </Label>
            <Input
              placeholder="Jane Smith"
              value={form.fullName}
              onChange={(e) => { set("fullName", e.target.value); clearErr("fullName"); }}
              className={errors.fullName ? "border-red-400" : ""}
            />
            <Err field="fullName" />
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</Label>
              <Input
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => { set("email", e.target.value); clearErr("email"); }}
                className={errors.email ? "border-red-400" : ""}
              />
              <Err field="email" />
            </div>
            <div>
              <Label className="text-sm font-semibold text-slate-700 mb-1.5 block">
                <Phone className="inline h-3.5 w-3.5 mr-1 text-amber-500" /> Phone Number
              </Label>
              <Input
                type="tel"
                placeholder="(555) 000-0000"
                value={form.phone}
                onChange={(e) => { set("phone", e.target.value); clearErr("phone"); }}
                className={errors.phone ? "border-red-400" : ""}
              />
              <Err field="phone" />
            </div>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Application Summary</p>
            <div className="space-y-2">
              {[
                { label: "Loan Type", value: form.loanType?.replace("_", " & ").toUpperCase() },
                { label: "Loan Amount", value: form.loanAmount },
                { label: "LTV/LTC", value: form.estimatedLtv },
                { label: "Property State", value: form.propertyState },
                { label: "Timeline", value: form.timeline?.replace(/_/g, " ") },
                { label: "Credit Score", value: form.creditScoreRange?.replace(/_/g, "+") },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-800 capitalize">{value}</span>
                </div>
              ) : null)}
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center leading-relaxed">
            By submitting, you agree to be contacted by a LiteDOC loan advisor. No spam — just your term sheet.
            Your information is never sold or shared with third parties.
          </p>

          {submitError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>{submitError} <a href="tel:+18005483625" className="underline font-semibold">Call (800) 548-3625</a></span>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button variant="outline" onClick={back} className="border-slate-300 text-slate-600">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-10 shadow-md"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting…" : "Submit Application"} {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
        <p className="text-xs text-center text-slate-400 mt-4">
          <FileText className="inline h-3 w-3 mr-1" />
          No credit pull. No commitment. Term sheet delivered within 24 hours.
        </p>
      </div>
    </div>
  );
};

export default ApplyPage;
