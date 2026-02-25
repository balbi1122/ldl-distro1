import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  BookOpen,
  Check,
  ChevronLeft,
  Database,
  Feather,
  Film,
  Filter,
  HardDrive,
  Info,
  Lock,
  Mail,
  Moon,
  Search,
  Server,
  ShieldCheck,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  Users,
  X,
} from "lucide-react";

/* ─── Mock submission data ──────────────────────────────────── */
type Status = "pending" | "approved" | "rejected";

interface Submission {
  id: string;
  title: string;
  contentType: "poem" | "story" | "video";
  era: string;
  author: string;
  email: string;
  body: string;
  aiAssisted: boolean;
  status: Status;
  submittedAt: string;
}

const mockSubmissions: Submission[] = [
  {
    id: "sub_001",
    title: "Midnights on the Rooftop",
    contentType: "poem",
    era: "Midnights",
    author: "Emily R.",
    email: "emily@swiftie.com",
    body: "Under the 3am glow, I wrote your name in the frost of my window...",
    aiAssisted: false,
    status: "pending",
    submittedAt: "2026-02-24T09:15:00Z",
  },
  {
    id: "sub_002",
    title: "The Girl Who Lived in the Ivy House",
    contentType: "story",
    era: "Colbert Book Project",
    author: "Marcus T.",
    email: "marcus@fans.net",
    body: "She arrived on a Tuesday in November, when the island fog was so thick you could lose your reflection in it...",
    aiAssisted: true,
    status: "pending",
    submittedAt: "2026-02-24T10:42:00Z",
  },
  {
    id: "sub_003",
    title: "Cardigan — A Fan Cover",
    contentType: "video",
    era: "Folklore",
    author: "Sofia L.",
    email: "sofia@creative.io",
    body: "https://youtube.com/watch?v=example123",
    aiAssisted: false,
    status: "approved",
    submittedAt: "2026-02-23T14:00:00Z",
  },
  {
    id: "sub_004",
    title: "1989 Polaroid Dreams",
    contentType: "poem",
    era: "1989",
    author: "Jake W.",
    email: "jake@poetry.me",
    body: "Shake it off, they said, but the polaroids never fade...",
    aiAssisted: false,
    status: "approved",
    submittedAt: "2026-02-22T16:30:00Z",
  },
  {
    id: "sub_005",
    title: "The Twin's Secret — Chapter 1",
    contentType: "story",
    era: "Colbert Book Project",
    author: "Anon",
    email: "anon@showgirl.com",
    body: "Nobody talked about what happened to Father. Not openly. Not on the island.",
    aiAssisted: true,
    status: "rejected",
    submittedAt: "2026-02-21T11:00:00Z",
  },
];

/* ─── Storage architecture info ─────────────────────────────── */
const storageInfo = [
  {
    icon: <Database className="h-5 w-5 text-violet-500" />,
    title: "Supabase PostgreSQL",
    subtitle: "Primary content store",
    description:
      "All submission data — title, author, content body, era, status, timestamps — is saved to a `submissions` table in your Supabase PostgreSQL database. Supabase is already wired into this project.",
    table: "submissions",
    color: "border-violet-200 bg-violet-50",
    fields: ["id", "title", "content_type", "era", "body", "author_id", "status", "created_at", "ai_assisted"],
  },
  {
    icon: <HardDrive className="h-5 w-5 text-sky-500" />,
    title: "Supabase Storage",
    subtitle: "Media & file uploads",
    description:
      "Video thumbnails, images, or any file attachments uploaded by members are stored in a Supabase Storage bucket called `content-media`. Files get a public URL you can embed anywhere on the site.",
    table: "content-media bucket",
    color: "border-sky-200 bg-sky-50",
    fields: ["video thumbnails", "cover images", "attachments"],
  },
  {
    icon: <Mail className="h-5 w-5 text-amber-500" />,
    title: "SendGrid",
    subtitle: "Email notifications",
    description:
      "When a member submits content, SendGrid sends a confirmation to the member and a review alert to the admin email. SendGrid is already configured in this project.",
    table: "Email logs",
    color: "border-amber-200 bg-amber-50",
    fields: ["submission_confirmed (member)", "review_alert (admin)"],
  },
  {
    icon: <Server className="h-5 w-5 text-emerald-500" />,
    title: "Supabase Auth",
    subtitle: "Member identity",
    description:
      "Each submission is linked to an authenticated Supabase user via `author_id`. Supabase Auth handles sign-up, sign-in, and session management. The admin area uses a separate admin role in Supabase Row Level Security.",
    table: "auth.users",
    color: "border-emerald-200 bg-emerald-50",
    fields: ["user_id", "email", "role", "membership_tier"],
  },
];

/* ─── Helpers ────────────────────────────────────────────────── */
const statusColors: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  approved: "bg-green-100 text-green-700 border-green-200",
  rejected: "bg-red-100 text-red-700 border-red-200",
};

const typeIcon = (t: string) => {
  if (t === "poem") return <Feather className="h-3.5 w-3.5" />;
  if (t === "story") return <BookOpen className="h-3.5 w-3.5" />;
  return <Film className="h-3.5 w-3.5" />;
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ─── Admin Login Gate ───────────────────────────────────────── */
const ADMIN_PIN = "swiftie13";

function LoginGate({ onLogin }: { onLogin: () => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const attempt = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onLogin();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-violet-950 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Admin Area</h1>
          <p className="text-slate-400 text-sm">Stories For A Showgirl</p>
        </div>

        <form onSubmit={attempt} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="space-y-1.5">
            <Label className="text-slate-300 text-sm">Admin Password</Label>
            <Input
              type="password"
              placeholder="Enter admin password…"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false); }}
              className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 focus-visible:ring-violet-500"
              autoFocus
            />
            {error && (
              <p className="text-xs text-red-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> Incorrect password. Try again.
              </p>
            )}
          </div>
          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white">
            <ShieldCheck className="mr-2 h-4 w-4" /> Sign In to Admin
          </Button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-4">
          ⚠️ Demo mode — replace with Supabase Auth in production
        </p>
      </div>
    </div>
  );
}

/* ─── Storage Info Modal ─────────────────────────────────────── */
function StorageModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Where Is Content Stored?</h2>
            <p className="text-sm text-slate-500 mt-0.5">Full storage architecture for Stories For A Showgirl</p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {storageInfo.map((s) => (
            <div key={s.title} className={`rounded-2xl border p-5 ${s.color}`}>
              <div className="flex items-start gap-4">
                <div className="mt-0.5 flex-shrink-0">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900">{s.title}</h3>
                    <span className="text-xs text-slate-500 bg-white/70 rounded-full px-2 py-0.5 border">
                      {s.subtitle}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {s.fields.map((f) => (
                      <code key={f} className="text-xs bg-white/80 border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-mono">
                        {f}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-slate-400" /> Supabase Table: <code className="font-mono text-violet-700">submissions</code>
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-1.5 pr-4 text-slate-400 font-semibold">Column</th>
                    <th className="text-left py-1.5 pr-4 text-slate-400 font-semibold">Type</th>
                    <th className="text-left py-1.5 text-slate-400 font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ["id", "UUID", "Primary key, auto-generated"],
                    ["title", "TEXT", "Submission title"],
                    ["content_type", "TEXT", "'poem' | 'story' | 'video'"],
                    ["era", "TEXT", "Album/era tag"],
                    ["body", "TEXT", "Poem or story content"],
                    ["video_url", "TEXT", "YouTube/Vimeo URL"],
                    ["ai_assisted", "BOOLEAN", "AI disclosure flag"],
                    ["ai_details", "TEXT", "How AI was used"],
                    ["is_original", "BOOLEAN", "Compliance checkbox 1"],
                    ["no_copyright", "BOOLEAN", "Compliance checkbox 2"],
                    ["accepts_terms", "BOOLEAN", "Compliance checkbox 3"],
                    ["status", "TEXT", "'pending' | 'approved' | 'rejected'"],
                    ["author_id", "UUID", "FK → auth.users"],
                    ["author_name", "TEXT", "Display name"],
                    ["author_email", "TEXT", "Member email"],
                    ["created_at", "TIMESTAMPTZ", "Auto, submission time"],
                    ["reviewed_at", "TIMESTAMPTZ", "When admin acted"],
                  ].map(([col, type, notes]) => (
                    <tr key={col}>
                      <td className="py-1.5 pr-4 text-violet-700">{col}</td>
                      <td className="py-1.5 pr-4 text-amber-600">{type}</td>
                      <td className="py-1.5 text-slate-500">{notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-slate-400 text-center">
            Set up the <code className="font-mono">submissions</code> table in your Supabase dashboard, then wire up <code className="font-mono">ContentService.ts</code> to replace the mock data in this admin panel.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Admin Dashboard ───────────────────────────────────── */
function AdminDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [showStorage, setShowStorage] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = (id: string, status: Status) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const remove = (id: string) => {
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  };

  const filtered = submissions.filter((s) => {
    if (filterStatus !== "all" && s.status !== filterStatus) return false;
    if (filterType !== "all" && s.contentType !== filterType) return false;
    if (search && !s.title.toLowerCase().includes(search.toLowerCase()) &&
        !s.author.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    total: submissions.length,
    pending: submissions.filter((s) => s.status === "pending").length,
    approved: submissions.filter((s) => s.status === "approved").length,
    rejected: submissions.filter((s) => s.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {showStorage && <StorageModal onClose={() => setShowStorage(false)} />}

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 leading-none">Stories For A Showgirl</p>
              <p className="text-sm font-bold text-slate-900 leading-tight">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStorage(true)}
              className="hidden sm:flex gap-1.5 border-violet-200 text-violet-700 hover:bg-violet-50"
            >
              <Database className="h-4 w-4" /> Storage Info
            </Button>
            <a href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 text-slate-500">
                <ChevronLeft className="h-4 w-4" /> Back to Site
              </Button>
            </a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Submissions", value: counts.total, icon: <Users className="h-5 w-5 text-slate-400" />, color: "border-slate-200 bg-white" },
            { label: "Pending Review", value: counts.pending, icon: <Moon className="h-5 w-5 text-yellow-500" />, color: "border-yellow-200 bg-yellow-50" },
            { label: "Approved", value: counts.approved, icon: <Check className="h-5 w-5 text-green-500" />, color: "border-green-200 bg-green-50" },
            { label: "Rejected", value: counts.rejected, icon: <X className="h-5 w-5 text-red-500" />, color: "border-red-200 bg-red-50" },
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

        {/* Storage notice */}
        <div
          className="rounded-2xl border border-violet-200 bg-violet-50 p-4 flex items-start gap-3 cursor-pointer hover:bg-violet-100 transition-colors"
          onClick={() => setShowStorage(true)}
        >
          <Database className="h-5 w-5 text-violet-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-violet-800">
              Content is stored in <span className="font-mono">Supabase PostgreSQL</span> → <span className="font-mono">submissions</span> table
            </p>
            <p className="text-xs text-violet-600 mt-0.5">
              Media files → Supabase Storage · Email alerts → SendGrid · Auth → Supabase Auth.{" "}
              <span className="underline underline-offset-2">Click to see the full storage architecture →</span>
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="h-4 w-4 text-violet-500" /> Filter Submissions
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search title or author…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="poem">Poems</SelectItem>
                <SelectItem value="story">Stories</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submissions table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">
              Submissions{" "}
              <span className="text-slate-400 font-normal text-sm">({filtered.length})</span>
            </h2>
            {counts.pending > 0 && (
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                {counts.pending} awaiting review
              </Badge>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Sparkles className="mx-auto h-8 w-8 mb-3 opacity-30" />
              <p className="text-sm">No submissions match your filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((sub) => (
                <div key={sub.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-4">
                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <button
                          className="font-semibold text-slate-900 hover:text-violet-700 transition-colors text-left"
                          onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
                        >
                          {sub.title}
                        </button>
                        <Badge className={`text-xs border ${statusColors[sub.status]}`}>
                          {sub.status}
                        </Badge>
                        <span className="flex items-center gap-1 text-xs text-slate-400 bg-slate-100 rounded-full px-2 py-0.5">
                          {typeIcon(sub.contentType)} {sub.contentType}
                        </span>
                        {sub.aiAssisted && (
                          <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                            AI-assisted
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{sub.author}</span>
                        {" · "}{sub.email}
                        {" · "}{sub.era}
                        {" · "}{fmt(sub.submittedAt)}
                      </p>
                      {expandedId === sub.id && (
                        <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
                          <p className="text-sm text-slate-600 leading-relaxed italic">"{sub.body}"</p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {sub.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-green-200 text-green-700 hover:bg-green-50"
                          onClick={() => updateStatus(sub.id, "approved")}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Approve</span>
                        </Button>
                      )}
                      {sub.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 gap-1 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => updateStatus(sub.id, "rejected")}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">Reject</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-500 hover:bg-red-50"
                        onClick={() => remove(sub.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <p className="text-xs text-center text-slate-400 pb-4">
          ⚠️ This admin area uses mock data. Wire up <code className="font-mono">ContentService.ts</code> + Supabase to manage real submissions.
        </p>
      </main>
    </div>
  );
}

/* ─── Export: gates login before showing dashboard ──────────── */
const AdminPage: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  return authed ? <AdminDashboard /> : <LoginGate onLogin={() => setAuthed(true)} />;
};

export default AdminPage;
