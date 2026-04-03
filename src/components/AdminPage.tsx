import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
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
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Database,
  Filter,
  Hammer,
  HardHat,
  Home,
  Lock,
  Mail,
  Phone,
  Search,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import type { LoanType, LoanLeadStatus } from "@/services/LoanService";

/* ─── Mock lead data ─────────────────────────────────────────── */
interface Lead {
  id: string;
  loanType: LoanType;
  fullName: string;
  email: string;
  phone: string;
  propertyAddress: string;
  propertyState: string;
  loanAmount: string;
  estimatedLtv: string;
  timeline: string;
  creditScoreRange: string;
  realEstateExperience: string;
  monthlyRent?: string;
  rehabBudget?: string;
  afterRepairValue?: string;
  lotOwned?: boolean;
  constructionBudget?: string;
  status: LoanLeadStatus;
  notes: string;
  createdAt: string;
}

const mockLeads: Lead[] = [
  {
    id: "ld_001",
    loanType: "fix_flip",
    fullName: "Marcus Thompson",
    email: "marcus@realestatepros.com",
    phone: "(602) 555-0184",
    propertyAddress: "4821 W Camelback Rd, Phoenix, AZ 85031",
    propertyState: "Arizona",
    loanAmount: "$250,000 – $500,000",
    estimatedLtv: "75% – 80%",
    timeline: "asap",
    creditScoreRange: "700_749",
    realEstateExperience: "4_10_deals",
    rehabBudget: "$100,000 – $250,000",
    afterRepairValue: "$500,000 – $1,000,000",
    status: "new",
    notes: "",
    createdAt: "2026-04-03T08:12:00Z",
  },
  {
    id: "ld_002",
    loanType: "dscr",
    fullName: "Sandra & Kevin Liu",
    email: "sliu@investorgroup.net",
    phone: "(404) 555-0237",
    propertyAddress: "1822 Peachtree Rd NE, Atlanta, GA 30309",
    propertyState: "Georgia",
    loanAmount: "$250,000 – $500,000",
    estimatedLtv: "70% – 75%",
    timeline: "1_month",
    creditScoreRange: "750_plus",
    realEstateExperience: "10_plus_deals",
    monthlyRent: "$3,200/month",
    status: "contacted",
    notes: "Spoke to Kevin 4/3. Very motivated buyer. Looking to close before 5/1. Sending term sheet today.",
    createdAt: "2026-04-02T14:30:00Z",
  },
  {
    id: "ld_003",
    loanType: "ground_up",
    fullName: "Derek Williams",
    email: "derek@dwbuilds.com",
    phone: "(214) 555-0399",
    propertyAddress: "Lot 14, Lakeview Dr, Frisco, TX 75034",
    propertyState: "Texas",
    loanAmount: "$500,000 – $1,000,000",
    estimatedLtv: "85% – 90%",
    timeline: "1_month",
    creditScoreRange: "700_749",
    realEstateExperience: "4_10_deals",
    lotOwned: true,
    constructionBudget: "$500,000 – $1,000,000",
    status: "in_progress",
    notes: "Term sheet sent 4/2. Reviewing with his contractor. Title search ordered. Expected to close 4/18.",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "ld_004",
    loanType: "fix_flip",
    fullName: "Alicia Moreno",
    email: "alicia.moreno@gmail.com",
    phone: "(305) 555-0112",
    propertyAddress: "2034 NW 7th Ave, Miami, FL 33127",
    propertyState: "Florida",
    loanAmount: "$100,000 – $250,000",
    estimatedLtv: "80% – 85%",
    timeline: "2_3_months",
    creditScoreRange: "650_699",
    realEstateExperience: "first_time",
    rehabBudget: "$50,000 – $100,000",
    afterRepairValue: "$250,000 – $500,000",
    status: "new",
    notes: "",
    createdAt: "2026-04-03T11:45:00Z",
  },
  {
    id: "ld_005",
    loanType: "dscr",
    fullName: "Robert Okafor",
    email: "r.okafor@portfoliocapital.co",
    phone: "(312) 555-0088",
    propertyAddress: "812 N Dearborn St, Chicago, IL 60610",
    propertyState: "Illinois",
    loanAmount: "$500,000 – $1,000,000",
    estimatedLtv: "65% – 70%",
    timeline: "asap",
    creditScoreRange: "750_plus",
    realEstateExperience: "10_plus_deals",
    monthlyRent: "$5,800/month",
    status: "closed",
    notes: "Closed 3/28. Funded $620K. 30-year DSCR. Client very happy — referred 2 colleagues.",
    createdAt: "2026-03-20T09:00:00Z",
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<LoanLeadStatus, { label: string; color: string }> = {
  new: { label: "New Lead", color: "bg-slate-100 text-slate-700 border-slate-300" },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
  in_progress: { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-300" },
  closed: { label: "Closed", color: "bg-green-100 text-green-700 border-green-300" },
  lost: { label: "Lost", color: "bg-red-100 text-red-600 border-red-200" },
};

const LOAN_TYPE_CONFIG: Record<LoanType, { label: string; color: string; icon: React.ReactNode }> = {
  dscr: { label: "DSCR Rental", color: "bg-blue-100 text-blue-700 border-blue-200", icon: <Home className="h-3.5 w-3.5" /> },
  fix_flip: { label: "Fix & Flip", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Hammer className="h-3.5 w-3.5" /> },
  ground_up: { label: "Ground-Up", color: "bg-green-100 text-green-700 border-green-200", icon: <HardHat className="h-3.5 w-3.5" /> },
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

const humanTimeline: Record<string, string> = {
  asap: "ASAP",
  "1_month": "Within 1 month",
  "2_3_months": "1–3 months",
  "3_plus_months": "3+ months",
};

const humanCredit: Record<string, string> = {
  "750_plus": "750+",
  "700_749": "700–749",
  "650_699": "650–699",
  "600_649": "600–649",
  "below_600": "Below 600",
};

const humanExp: Record<string, string> = {
  first_time: "First-time investor",
  "1_3_deals": "1–3 deals",
  "4_10_deals": "4–10 deals",
  "10_plus_deals": "10+ deals",
};

/* ─── Login Gate ─────────────────────────────────────────────── */
const ADMIN_PASSWORD = "LiteDOC2024";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      onLogin();
    } else {
      setError(true);
      setPw("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-slate-950" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <Zap className="h-5 w-5 text-amber-400" />
            <span className="font-black text-white text-lg">LiteDOC<span className="text-amber-400">.LOANS</span></span>
          </div>
          <h1 className="text-xl font-bold text-white">Staff Admin Portal</h1>
        </div>

        <form onSubmit={attempt} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Admin Password</Label>
            <Input
              type="password"
              placeholder="Enter admin password…"
              value={pw}
              onChange={(e) => { setPw(e.target.value); setError(false); }}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-amber-500"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Incorrect password.
              </p>
            )}
          </div>
          <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold">
            <Shield className="mr-2 h-4 w-4" /> Sign In
          </Button>
        </form>
        <p className="text-center text-xs text-slate-600 mt-4">
          For staff use only. Replace with Supabase Auth in production.
        </p>
      </div>
    </div>
  );
}

/* ─── Lead Card ──────────────────────────────────────────────── */
function LeadCard({ lead, onStatusChange, onNotesChange, onDelete }: {
  lead: Lead;
  onStatusChange: (id: string, status: LoanLeadStatus) => void;
  onNotesChange: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(lead.notes);
  const [notesSaved, setNotesSaved] = useState(false);

  const loanCfg = LOAN_TYPE_CONFIG[lead.loanType];
  const statusCfg = STATUS_CONFIG[lead.status];

  const saveNotes = () => {
    onNotesChange(lead.id, localNotes);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      {/* Main row */}
      <div className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          {/* Left: name + contact */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-bold text-slate-900 text-base">{lead.fullName}</h3>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold border rounded-full px-2.5 py-0.5 ${loanCfg.color}`}>
                {loanCfg.icon} {loanCfg.label}
              </span>
              <span className={`text-xs font-semibold border rounded-full px-2.5 py-0.5 ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-500">
              <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium">
                <Phone className="h-3.5 w-3.5" /> {lead.phone}
              </a>
              <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium">
                <Mail className="h-3.5 w-3.5" /> {lead.email}
              </a>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-xs text-slate-400">
              <span>{lead.propertyState} · {lead.loanAmount} · LTV {lead.estimatedLtv}</span>
              <span>Submitted: {fmt(lead.createdAt)}</span>
            </div>
          </div>

          {/* Right: status + actions */}
          <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
            <Select value={lead.status} onValueChange={(v) => onStatusChange(lead.id, v as LoanLeadStatus)}>
              <SelectTrigger className="h-8 text-xs w-36 border-slate-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_CONFIG) as LoanLeadStatus[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-2 text-slate-400 hover:text-red-500 hover:bg-red-50"
              onClick={() => onDelete(lead.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs border-slate-300"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5 mr-1" /> : <ChevronDown className="h-3.5 w-3.5 mr-1" />}
              {expanded ? "Hide" : "Details"}
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 space-y-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Property</p>
              <p className="text-sm text-slate-700 font-medium">{lead.propertyAddress}</p>
              <p className="text-xs text-slate-500">{lead.propertyState}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Loan Details</p>
              <div className="space-y-0.5 text-sm">
                <p><span className="text-slate-400">Amount:</span> <span className="font-medium">{lead.loanAmount}</span></p>
                <p><span className="text-slate-400">LTV/LTC:</span> <span className="font-medium">{lead.estimatedLtv}</span></p>
                <p><span className="text-slate-400">Timeline:</span> <span className="font-medium">{humanTimeline[lead.timeline] ?? lead.timeline}</span></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Borrower Profile</p>
              <div className="space-y-0.5 text-sm">
                <p><span className="text-slate-400">FICO:</span> <span className="font-medium">{humanCredit[lead.creditScoreRange] ?? lead.creditScoreRange}</span></p>
                <p><span className="text-slate-400">Experience:</span> <span className="font-medium">{humanExp[lead.realEstateExperience] ?? lead.realEstateExperience}</span></p>
              </div>
            </div>

            {/* DSCR-specific */}
            {lead.loanType === "dscr" && lead.monthlyRent && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">DSCR Details</p>
                <p className="text-sm"><span className="text-slate-400">Monthly Rent:</span> <span className="font-medium">{lead.monthlyRent}</span></p>
              </div>
            )}

            {/* Fix & Flip-specific */}
            {lead.loanType === "fix_flip" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">Fix & Flip Details</p>
                <div className="space-y-0.5 text-sm">
                  {lead.rehabBudget && <p><span className="text-slate-400">Rehab Budget:</span> <span className="font-medium">{lead.rehabBudget}</span></p>}
                  {lead.afterRepairValue && <p><span className="text-slate-400">ARV:</span> <span className="font-medium">{lead.afterRepairValue}</span></p>}
                </div>
              </div>
            )}

            {/* Ground-Up-specific */}
            {lead.loanType === "ground_up" && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2">Construction Details</p>
                <div className="space-y-0.5 text-sm">
                  <p><span className="text-slate-400">Lot Owned:</span> <span className="font-medium">{lead.lotOwned ? "Yes" : "No — acquiring"}</span></p>
                  {lead.constructionBudget && <p><span className="text-slate-400">Build Budget:</span> <span className="font-medium">{lead.constructionBudget}</span></p>}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400">Staff Notes</Label>
            <Textarea
              rows={3}
              placeholder="Add internal notes about this lead…"
              value={localNotes}
              onChange={(e) => setLocalNotes(e.target.value)}
              className="text-sm resize-none"
            />
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs"
                onClick={saveNotes}
              >
                {notesSaved ? "Saved!" : "Save Notes"}
              </Button>
              {notesSaved && <span className="text-xs text-green-600">✓ Notes saved</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Dashboard ──────────────────────────────────────────────── */
function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const updateStatus = (id: string, status: LoanLeadStatus) =>
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));

  const updateNotes = (id: string, notes: string) =>
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, notes } : l));

  const deleteLead = (id: string) =>
    setLeads((prev) => prev.filter((l) => l.id !== id));

  const filtered = leads.filter((l) => {
    if (filterType !== "all" && l.loanType !== filterType) return false;
    if (filterStatus !== "all" && l.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!l.fullName.toLowerCase().includes(q) &&
          !l.email.toLowerCase().includes(q) &&
          !l.propertyState.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const counts = {
    total: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    inProgress: leads.filter((l) => l.status === "in_progress").length,
    closed: leads.filter((l) => l.status === "closed").length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-950 border-b border-slate-800 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-500 leading-none">LiteDOC.LOANS</p>
              <p className="text-sm font-bold text-white leading-tight">Staff Admin Portal</p>
            </div>
          </div>
          <a href="/">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white gap-1.5">
              <ChevronLeft className="h-4 w-4" /> Back to Site
            </Button>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-6">

        {/* Supabase notice */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-start gap-3">
          <Database className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Demo Mode — Using Mock Data
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Connect Supabase to manage real leads. Add <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> and <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> to your <code className="font-mono bg-amber-100 px-1 rounded">.env</code> file, create the <code className="font-mono bg-amber-100 px-1 rounded">loan_leads</code> table (see <code className="font-mono bg-amber-100 px-1 rounded">LoanService.ts</code>), then wire <code className="font-mono bg-amber-100 px-1 rounded">loanService.getAll()</code> here.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Leads", value: counts.total, icon: <Users className="h-5 w-5 text-slate-400" />, color: "bg-white border-slate-200" },
            { label: "New (Uncontacted)", value: counts.new, icon: <TrendingUp className="h-5 w-5 text-amber-500" />, color: "bg-amber-50 border-amber-200" },
            { label: "In Progress", value: counts.inProgress, icon: <Building2 className="h-5 w-5 text-blue-500" />, color: "bg-blue-50 border-blue-200" },
            { label: "Closed Deals", value: counts.closed, icon: <Shield className="h-5 w-5 text-green-500" />, color: "bg-green-50 border-green-200" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`rounded-2xl border p-5 ${color}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">{label}</span>
                {icon}
              </div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-amber-500" /> Filter Leads
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search name, email, state…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger><SelectValue placeholder="All Loan Types" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Loan Types</SelectItem>
                <SelectItem value="dscr">DSCR Rental</SelectItem>
                <SelectItem value="fix_flip">Fix & Flip</SelectItem>
                <SelectItem value="ground_up">Ground-Up Construction</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger><SelectValue placeholder="All Statuses" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {(Object.keys(STATUS_CONFIG) as LoanLeadStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads list */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900">
              Leads{" "}
              <span className="text-slate-400 font-normal text-sm">({filtered.length} shown)</span>
            </h2>
            {counts.new > 0 && (
              <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                {counts.new} new lead{counts.new > 1 ? "s" : ""} awaiting contact
              </Badge>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center text-slate-400">
              <Users className="mx-auto h-8 w-8 mb-3 opacity-30" />
              <p className="text-sm">No leads match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onStatusChange={updateStatus}
                  onNotesChange={updateNotes}
                  onDelete={deleteLead}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ─── Export: login gate ─────────────────────────────────────── */
const AdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  return authed ? <Dashboard /> : <LoginGate onLogin={() => setAuthed(true)} />;
};

export default AdminPage;
