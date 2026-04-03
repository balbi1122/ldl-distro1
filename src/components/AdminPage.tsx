import React, { useState, useMemo } from "react";
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
import { Textarea } from "./ui/textarea";
import {
  Zap,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  TrendingUp,
  CheckCircle,
  Trash2,
  Phone,
  Mail,
  Search,
  Info,
} from "lucide-react";
import { LoanLead, LoanLeadStatus, LoanType } from "@/services/LoanService";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_LEADS: LoanLead[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    loan_type: "fix_flip",
    full_name: "Marcus Thompson",
    email: "marcus.t@email.com",
    phone: "(512) 555-0192",
    property_address: "4821 Oak Ridge Blvd, Austin, TX 78745",
    property_type: "single_family",
    property_state: "Texas",
    estimated_value: "250k_500k",
    purchase_price: "250k_500k",
    rehab_budget: "100k_250k",
    after_repair_value: "500k_1m",
    loan_amount: "250k_500k",
    estimated_ltv: "75_80",
    timeline: "asap",
    credit_score_range: "700_749",
    real_estate_experience: "first_time",
    status: "new",
    created_at: "2026-04-01T14:32:00Z",
    notes: "",
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    loan_type: "dscr",
    full_name: "Jennifer Rodriguez",
    email: "jrodriguez@realty.com",
    phone: "(305) 555-0847",
    property_address: "1102 Sunset Drive, Miami, FL 33101",
    property_type: "single_family",
    property_state: "Florida",
    estimated_value: "500k_1m",
    purchase_price: "500k_1m",
    monthly_rent: "$4,200/month",
    loan_amount: "500k_1m",
    estimated_ltv: "70_75",
    timeline: "1_month",
    credit_score_range: "750_plus",
    real_estate_experience: "4_10_deals",
    status: "contacted",
    created_at: "2026-03-30T09:15:00Z",
    contacted_at: "2026-03-30T11:00:00Z",
    notes: "Borrower has a strong portfolio. Requested 30-yr fixed rate sheet.",
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    loan_type: "ground_up",
    full_name: "David Kim",
    email: "david.kim@buildpro.net",
    phone: "(678) 555-0334",
    property_address: "Lot 14, Peachtree Estates, Atlanta, GA 30301",
    property_type: "single_family",
    property_state: "Georgia",
    estimated_value: "500k_1m",
    purchase_price: "100k_250k",
    lot_owned: true,
    construction_budget: "250k_500k",
    loan_amount: "250k_500k",
    estimated_ltv: "80_85",
    timeline: "2_3_months",
    credit_score_range: "700_749",
    real_estate_experience: "4_10_deals",
    status: "in_progress",
    created_at: "2026-03-28T16:45:00Z",
    notes: "Blueprints submitted. Appraiser scheduled for April 10.",
  },
  {
    id: "d4e5f6a7-b8c9-0123-defa-234567890123",
    loan_type: "fix_flip",
    full_name: "Sarah O'Brien",
    email: "sarah.obrien@gmail.com",
    phone: "(847) 555-0561",
    property_address: "2034 N. Maple Ave, Chicago, IL 60614",
    property_type: "multi_family",
    property_state: "Illinois",
    estimated_value: "500k_1m",
    purchase_price: "500k_1m",
    rehab_budget: "100k_250k",
    after_repair_value: "1m_2m",
    loan_amount: "500k_1m",
    estimated_ltv: "70_75",
    timeline: "asap",
    credit_score_range: "650_699",
    real_estate_experience: "1_3_deals",
    status: "closed",
    created_at: "2026-03-15T10:00:00Z",
    notes: "Closed March 25. 12-day close. Smooth process.",
  },
  {
    id: "e5f6a7b8-c9d0-1234-efab-345678901234",
    loan_type: "dscr",
    full_name: "Robert Chen",
    email: "r.chen@propinvest.io",
    phone: "(415) 555-0723",
    property_address: "889 Market St Unit 4B, San Francisco, CA 94103",
    property_type: "condo",
    property_state: "California",
    estimated_value: "1m_2m",
    purchase_price: "1m_2m",
    monthly_rent: "$5,800/month",
    loan_amount: "1m_plus",
    estimated_ltv: "65_70",
    timeline: "2_3_months",
    credit_score_range: "750_plus",
    real_estate_experience: "10_plus_deals",
    status: "lost",
    created_at: "2026-03-20T13:30:00Z",
    notes: "Borrower went with a local bank at lower rate. Keep in pipeline for future deals.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  dscr: "DSCR Rental",
  fix_flip: "Fix & Flip",
  ground_up: "Ground-Up",
};

const LOAN_TYPE_BADGE: Record<LoanType, string> = {
  dscr: "bg-blue-100 text-blue-700 border-blue-200",
  fix_flip: "bg-amber-100 text-amber-700 border-amber-200",
  ground_up: "bg-green-100 text-green-700 border-green-200",
};

const STATUS_LABELS: Record<LoanLeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  in_progress: "In Progress",
  closed: "Closed",
  lost: "Lost",
};

const STATUS_BADGE: Record<LoanLeadStatus, string> = {
  new: "bg-slate-100 text-slate-600 border-slate-200",
  contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-700 border-blue-200",
  closed: "bg-green-100 text-green-700 border-green-200",
  lost: "bg-red-100 text-red-600 border-red-200",
};

const LOAN_AMOUNT_LABELS: Record<string, string> = {
  "50k_100k": "$50k–$100k",
  "100k_250k": "$100k–$250k",
  "250k_500k": "$250k–$500k",
  "500k_1m": "$500k–$1M",
  "1m_plus": "$1M+",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Login Gate ───────────────────────────────────────────────────────────────

const PASSWORD = "LiteDOC2024";

const LoginGate: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === PASSWORD) {
      onLogin();
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-xl bg-amber-500 mb-4">
            <Zap className="h-7 w-7 text-slate-950 fill-slate-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-white mb-1">
            LiteDOC<span className="text-amber-400">.LOANS</span>
          </h1>
          <p className="text-slate-400 text-sm">Admin Portal</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-900 rounded-2xl border border-slate-800 p-7 space-y-5"
        >
          <div>
            <Label htmlFor="admin-password" className="text-sm font-semibold text-slate-300">
              Password
            </Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              className="mt-1.5 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-500"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                setError("");
              }}
              autoFocus
            />
            {error && <p className="text-red-400 text-xs mt-1.5">{error}</p>}
          </div>
          <Button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

// ─── Detail Item ──────────────────────────────────────────────────────────────

const DetailItem: React.FC<{
  label: string;
  value?: string | null;
  mono?: boolean;
}> = ({ label, value, mono }) => (
  <div>
    <span className="text-xs text-slate-400 uppercase tracking-wide block mb-0.5">{label}</span>
    <span className={`text-slate-700 text-sm ${mono ? "font-mono text-xs break-all" : "font-medium"}`}>
      {value ?? "—"}
    </span>
  </div>
);

// ─── Lead Row ─────────────────────────────────────────────────────────────────

interface LeadRowProps {
  lead: LoanLead;
  onStatusChange: (id: string, status: LoanLeadStatus) => void;
  onNotesSave: (id: string, notes: string) => void;
  onDelete: (id: string) => void;
  savedId: string | null;
}

const LeadRow: React.FC<LeadRowProps> = ({
  lead,
  onStatusChange,
  onNotesSave,
  onDelete,
  savedId,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [localStatus, setLocalStatus] = useState<LoanLeadStatus>(lead.status);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleStatusChange = (val: string) => {
    const s = val as LoanLeadStatus;
    setLocalStatus(s);
    onStatusChange(lead.id, s);
  };

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      {/* Summary row */}
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          {/* Name / contact */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-slate-900 text-base">{lead.full_name}</span>
              <Badge className={`text-xs ${LOAN_TYPE_BADGE[lead.loan_type]}`}>
                {LOAN_TYPE_LABELS[lead.loan_type]}
              </Badge>
              <Badge className={`text-xs ${STATUS_BADGE[localStatus]}`}>
                {STATUS_LABELS[localStatus]}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center gap-1 hover:text-amber-600 transition-colors"
              >
                <Phone className="h-3 w-3" /> {lead.phone}
              </a>
              <a
                href={`mailto:${lead.email}`}
                className="flex items-center gap-1 hover:text-amber-600 transition-colors"
              >
                <Mail className="h-3 w-3" /> {lead.email}
              </a>
              {lead.property_state && <span>{lead.property_state}</span>}
              {lead.loan_amount && (
                <span>{LOAN_AMOUNT_LABELS[lead.loan_amount] ?? lead.loan_amount}</span>
              )}
              <span className="text-slate-400">{formatDate(lead.created_at)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={localStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="h-8 w-36 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(STATUS_LABELS) as LoanLeadStatus[]).map((s) => (
                  <SelectItem key={s} value={s} className="text-xs">
                    {STATUS_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700"
              onClick={() => setExpanded((prev) => !prev)}
              title={expanded ? "Collapse" : "Expand"}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            {confirmDelete ? (
              <div className="flex items-center gap-1">
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => onDelete(lead.id)}
                >
                  Confirm
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => setConfirmDelete(false)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-slate-300 hover:text-red-500"
                onClick={() => setConfirmDelete(true)}
                title="Delete lead"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 text-sm">
            <DetailItem label="Loan Type" value={LOAN_TYPE_LABELS[lead.loan_type]} />
            <DetailItem label="Property Address" value={lead.property_address} />
            <DetailItem label="Property Type" value={lead.property_type} />
            <DetailItem label="State" value={lead.property_state} />
            <DetailItem label="Estimated Value" value={lead.estimated_value} />
            <DetailItem label="Purchase Price" value={lead.purchase_price} />
            <DetailItem
              label="Loan Amount"
              value={LOAN_AMOUNT_LABELS[lead.loan_amount ?? ""] ?? lead.loan_amount}
            />
            <DetailItem label="Est. LTV/LTC" value={lead.estimated_ltv} />
            <DetailItem label="Timeline" value={lead.timeline} />
            <DetailItem label="Credit Score" value={lead.credit_score_range} />
            <DetailItem label="Experience" value={lead.real_estate_experience} />
            {lead.monthly_rent && <DetailItem label="Monthly Rent" value={lead.monthly_rent} />}
            {lead.rehab_budget && <DetailItem label="Rehab Budget" value={lead.rehab_budget} />}
            {lead.after_repair_value && (
              <DetailItem label="After Repair Value" value={lead.after_repair_value} />
            )}
            {lead.lot_owned !== undefined && lead.lot_owned !== null && (
              <DetailItem label="Lot Owned" value={lead.lot_owned ? "Yes" : "No"} />
            )}
            {lead.construction_budget && (
              <DetailItem label="Construction Budget" value={lead.construction_budget} />
            )}
            {lead.contacted_at && (
              <DetailItem label="Contacted At" value={formatDate(lead.contacted_at)} />
            )}
            <DetailItem label="Lead ID" value={lead.id} mono />
          </div>

          <Separator className="mb-4" />

          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add internal notes about this lead..."
              className="text-sm min-h-[80px] bg-white"
            />
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
                onClick={() => onNotesSave(lead.id, notes)}
              >
                Save Notes
              </Button>
              {savedId === lead.id && (
                <span className="text-green-600 text-xs flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> Saved
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main Admin Component ─────────────────────────────────────────────────────

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [leads, setLeads] = useState<LoanLead[]>(MOCK_LEADS);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [savedId, setSavedId] = useState<string | null>(null);

  // ─── Stats ──────────────────────────────────────────────────────────────

  const stats = useMemo(
    () => ({
      total: leads.length,
      newLeads: leads.filter((l) => l.status === "new").length,
      inProgress: leads.filter(
        (l) => l.status === "in_progress" || l.status === "contacted"
      ).length,
      closed: leads.filter((l) => l.status === "closed").length,
    }),
    [leads]
  );

  // ─── Filtered leads ──────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        !search ||
        l.full_name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || l.loan_type === filterType;
      const matchStatus = filterStatus === "all" || l.status === filterStatus;
      return matchSearch && matchType && matchStatus;
    });
  }, [leads, search, filterType, filterStatus]);

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleStatusChange = (id: string, status: LoanLeadStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              status,
              ...(status === "contacted"
                ? { contacted_at: new Date().toISOString() }
                : {}),
            }
          : l
      )
    );
  };

  const handleNotesSave = (id: string, notes: string) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, notes } : l))
    );
    setSavedId(id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const handleDelete = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  if (!loggedIn) {
    return <LoginGate onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 shadow-md">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-500">
              <Zap className="h-5 w-5 text-slate-950 fill-slate-950" />
            </div>
            <div>
              <span className="text-white font-extrabold text-base">
                LiteDOC<span className="text-amber-400">.LOANS</span>
              </span>
              <span className="text-slate-500 text-xs ml-2">Admin Dashboard</span>
            </div>
          </div>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Site
          </button>
        </div>
      </header>

      {/* Supabase banner */}
      <div className="bg-blue-50 border-b border-blue-200">
        <div className="mx-auto max-w-7xl px-6 py-2 flex items-center gap-2 text-blue-700 text-xs">
          <Info className="h-3.5 w-3.5 flex-shrink-0" />
          <span>
            Connect Supabase to manage real leads — see{" "}
            <code className="font-mono bg-blue-100 px-1 rounded">LoanService.ts</code>{" "}
            for setup instructions. Currently showing mock data.
          </span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl w-full px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              icon: <Users className="h-5 w-5 text-slate-500" />,
              label: "Total Leads",
              value: stats.total,
            },
            {
              icon: <Clock className="h-5 w-5 text-yellow-500" />,
              label: "New (Uncontacted)",
              value: stats.newLeads,
            },
            {
              icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
              label: "In Progress",
              value: stats.inProgress,
            },
            {
              icon: <CheckCircle className="h-5 w-5 text-green-500" />,
              label: "Closed",
              value: stats.closed,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex items-center gap-4"
            >
              <div className="flex-shrink-0">{icon}</div>
              <div>
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All loan types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Loan Types</SelectItem>
                <SelectItem value="dscr">DSCR Rental</SelectItem>
                <SelectItem value="fix_flip">Fix & Flip</SelectItem>
                <SelectItem value="ground_up">Ground-Up</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Leads count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-800">{leads.length}</span> leads
          </p>
        </div>

        {/* Lead list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No leads match your filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((lead) => (
              <LeadRow
                key={lead.id}
                lead={lead}
                onStatusChange={handleStatusChange}
                onNotesSave={handleNotesSave}
                onDelete={handleDelete}
                savedId={savedId}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
