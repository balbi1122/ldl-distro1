import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  FileText,
  Home,
  Hammer,
  HardHat,
  ChevronRight,
  Phone,
  Mail,
  Star,
  ArrowRight,
  Shield,
  DollarSign,
} from "lucide-react";

/* ─── Loan Products ─────────────────────────────────────────────── */
const loanProducts = [
  {
    icon: <Home className="h-8 w-8 text-blue-500" />,
    title: "DSCR Rental Loans",
    badge: "Most Popular",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    ltv: "Up to 80% LTV",
    rate: "Rates from 7.25%",
    term: "30-Year Fixed Available",
    features: [
      "Qualify on rental income — no personal income docs",
      "No prepayment penalty after 6 months",
      "Single family, multi-family, short-term rentals",
      "LLC / entity vesting accepted",
      "No tax returns required",
    ],
    highlight: false,
  },
  {
    icon: <Hammer className="h-8 w-8 text-amber-500" />,
    title: "Fix & Flip Loans",
    badge: "Best Terms",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    ltv: "Up to 90% of Purchase + 100% Rehab",
    rate: "Rates from 10.5%",
    term: "12–18 Month Bridge",
    features: [
      "No prior fix & flip experience required",
      "100% of rehab costs covered",
      "Draw schedule based on project milestones",
      "Close in as little as 10 business days",
      "1–2 points origination (competitors charge 2–4)",
    ],
    highlight: true,
  },
  {
    icon: <HardHat className="h-8 w-8 text-green-500" />,
    title: "Ground-Up Construction",
    badge: "Up to 90% LTC",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    ltv: "Up to 90% LTC",
    rate: "Rates from 11.5%",
    term: "12–24 Month Construction",
    features: [
      "90% LTC — competitors cap at 85%",
      "Lot owned or being acquired — both OK",
      "Interest-only payments during construction",
      "Single family & small multi-family",
      "Streamlined draw process",
    ],
    highlight: false,
  },
];

/* ─── Why LiteDOC section ───────────────────────────────────────── */
const whyFeatures = [
  {
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    title: "Minimal Documentation",
    desc: "Our name says it all. We cut the paperwork others require. No W-2s, no tax returns for most programs.",
    bg: "bg-amber-50",
  },
  {
    icon: <Clock className="h-6 w-6 text-blue-500" />,
    title: "10–14 Day Close",
    desc: "While competitors take 3–4 weeks, we move fast. Time is money — especially in real estate.",
    bg: "bg-blue-50",
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    title: "No Experience Required",
    desc: "First-time fix & flip investor? No problem. We lend on the deal, not your resume.",
    bg: "bg-green-50",
  },
  {
    icon: <DollarSign className="h-6 w-6 text-violet-500" />,
    title: "Competitive Rates & Fees",
    desc: "1–2 points origination vs. the industry's 2–4. No junk fees. What you see is what you close with.",
    bg: "bg-violet-50",
  },
];

/* ─── Steps ─────────────────────────────────────────────────────── */
const steps = [
  {
    number: "01",
    title: "Apply Online",
    desc: "Complete our 5-minute application. No SSN required upfront — just the basics about you and the deal.",
    time: "~5 minutes",
  },
  {
    number: "02",
    title: "Get Your Term Sheet",
    desc: "A LiteDOC advisor reviews your deal and sends a term sheet within 24 hours. No obligation.",
    time: "Within 24 hrs",
  },
  {
    number: "03",
    title: "Close & Fund",
    desc: "We work with you through underwriting and title. Most loans close in 10–14 business days.",
    time: "10–14 days",
  },
];

/* ─── Testimonials ──────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Marcus T.",
    loanType: "Fix & Flip",
    state: "TX",
    quote:
      "I was a first-time flipper and every lender turned me away for lack of experience. LiteDOC looked at the deal numbers and funded me in 12 days. Made $38k on my first flip.",
    stars: 5,
  },
  {
    name: "Jennifer R.",
    loanType: "DSCR Rental",
    state: "FL",
    quote:
      "Refinanced my short-term rental portfolio without digging up two years of tax returns. The process was shockingly simple — true to their name.",
    stars: 5,
  },
  {
    name: "David K.",
    loanType: "Ground-Up",
    state: "GA",
    quote:
      "90% LTC and a draw process that actually made sense. My builder stayed on schedule because the funds were always there when needed. Will use again.",
    stars: 5,
  },
];

/* ─── Component ─────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const programsRef = useRef<HTMLDivElement>(null);

  const scrollToPrograms = () => {
    programsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── Sticky Navbar ── */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800 shadow-sm">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-500">
              <Zap className="h-5 w-5 text-slate-950 fill-slate-950" />
            </div>
            <span className="text-white font-extrabold text-lg tracking-tight">
              LiteDOC<span className="text-amber-400">.LOANS</span>
            </span>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button
              onClick={scrollToPrograms}
              className="hover:text-amber-400 transition-colors"
            >
              Loan Programs
            </button>
            <a href="#why" className="hover:text-amber-400 transition-colors">Why LiteDOC?</a>
            <a href="#how" className="hover:text-amber-400 transition-colors">How It Works</a>
            <a href="/admin" className="hover:text-amber-400 transition-colors text-slate-500">Admin</a>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="tel:+18005483625"
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-amber-400 text-sm transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>(800) 548-3625</span>
            </a>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow"
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* Decorative gradient orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute bottom-0 -left-24 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <Badge className="mb-5 bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/20 px-4 py-1 text-xs uppercase tracking-wider">
            Hard Money Lending — Simplified
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-white">
            Fast Funding.{" "}
            <span className="text-amber-400">Lite Docs.</span>
            <br className="hidden sm:block" />
            <span className="text-slate-300 text-4xl sm:text-5xl lg:text-6xl">
              Real Estate Loans Done Right.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            DSCR rentals, fix & flip, and ground-up construction loans — with minimal paperwork,
            industry-low fees, and closings in 10–14 days. Available in 48 states.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg px-10 text-base"
              onClick={() => navigate("/apply")}
            >
              Apply Now — 5 Minutes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white px-10 text-base"
              onClick={scrollToPrograms}
            >
              See Loan Programs <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-amber-500">
        <div className="mx-auto max-w-6xl px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { stat: "500+", label: "Loans Funded" },
              { stat: "$200M+", label: "Capital Deployed" },
              { stat: "10–14 Days", label: "Average Close Time" },
              { stat: "48 States", label: "Licensed To Lend" },
            ].map(({ stat, label }) => (
              <div key={label} className="flex flex-col">
                <span className="text-2xl font-extrabold text-slate-950">{stat}</span>
                <span className="text-xs font-semibold text-slate-800 uppercase tracking-wide">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Loan Products ── */}
      <section ref={programsRef} className="mx-auto max-w-6xl px-6 py-20" id="programs">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Loan Programs</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Purpose-built products for every real estate investing strategy — with the speed and simplicity you deserve.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {loanProducts.map((product) => (
            <Card
              key={product.title}
              className={`flex flex-col rounded-2xl transition-all hover:shadow-xl hover:-translate-y-0.5 ${
                product.highlight
                  ? "border-2 border-amber-400 shadow-amber-100 shadow-lg"
                  : "border border-slate-200"
              }`}
            >
              {product.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-amber-500 text-slate-950 font-bold px-4">Most Requested</Badge>
                </div>
              )}
              <CardHeader className="pb-3 pt-7">
                <div className="mb-3">{product.icon}</div>
                <div className="flex items-center justify-between mb-1">
                  <CardTitle className="text-xl font-bold">{product.title}</CardTitle>
                  <Badge className={`text-xs ${product.badgeColor}`}>{product.badge}</Badge>
                </div>
                <div className="space-y-1 mt-2">
                  <p className="text-sm font-semibold text-slate-700">{product.ltv}</p>
                  <p className="text-sm text-slate-500">{product.rate}</p>
                  <p className="text-xs text-slate-400">{product.term}</p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <Separator />
                <ul className="space-y-2 flex-1">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-2 font-semibold ${
                    product.highlight
                      ? "bg-amber-500 hover:bg-amber-400 text-slate-950"
                      : "border border-slate-300 hover:bg-slate-50 text-slate-800"
                  }`}
                  variant={product.highlight ? "default" : "outline"}
                  onClick={() => navigate("/apply")}
                >
                  Apply for This Loan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Why LiteDOC? ── */}
      <section className="mx-auto max-w-6xl px-6 py-20" id="why">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">Why LiteDOC?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            We built LiteDOC to solve the biggest pain points investors face with traditional hard money lenders.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyFeatures.map(({ icon, title, desc, bg }) => (
            <div key={title} className={`rounded-2xl p-6 ${bg}`}>
              <div className="mb-4">{icon}</div>
              <h3 className="font-bold text-base mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Competitive comparison callout */}
        <div className="mt-10 rounded-2xl bg-slate-950 text-white p-8 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge className="mb-3 bg-amber-500/20 text-amber-400 border-amber-500/30">
              Competitive Edge
            </Badge>
            <h3 className="text-2xl font-extrabold mb-3">
              LiteDOC vs. The Competition
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We track what competitors charge and publish our advantage openly. No surprises.
            </p>
          </div>
          <div className="space-y-3">
            {[
              { label: "Origination Fees", us: "1–2 points", them: "2–4 points" },
              { label: "Close Time", us: "10–14 days", them: "3–4 weeks" },
              { label: "Experience Required", us: "None for Fix & Flip", them: "2+ completed deals" },
              { label: "Construction LTC", us: "Up to 90%", them: "Up to 85%" },
              { label: "Prepay Penalty (DSCR)", us: "Gone after 6 months", them: "3–5 year lockout" },
            ].map(({ label, us, them }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-slate-400 w-40">{label}</span>
                <span className="text-green-400 font-semibold flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5" /> {us}
                </span>
                <span className="text-slate-600 line-through text-xs">{them}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── How It Works ── */}
      <section className="mx-auto max-w-6xl px-6 py-20" id="how">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold mb-3">How It Works</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Three simple steps from application to funded — no guesswork, no runaround.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connector line */}
          <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-amber-200 z-0" />

          {steps.map((step, i) => (
            <div key={step.number} className="relative text-center">
              <div className="relative z-10 inline-flex items-center justify-center h-20 w-20 rounded-full bg-amber-500 text-slate-950 font-extrabold text-2xl mb-5 mx-auto shadow-lg">
                {step.number}
              </div>
              <Badge className="mb-3 bg-slate-100 text-slate-600 border-slate-200 text-xs">
                {step.time}
              </Badge>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              {i < steps.length - 1 && (
                <ChevronRight className="hidden md:block absolute top-8 -right-5 h-6 w-6 text-amber-400 z-10" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md px-10"
            onClick={() => navigate("/apply")}
          >
            Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Testimonials ── */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold mb-3">Borrower Stories</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Real investors. Real deals. Real results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <Card key={t.name} className="rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-400">
                        {t.loanType} · {t.state}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-800 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-amber-500 mb-6">
            <Zap className="h-7 w-7 text-slate-950 fill-slate-950" />
          </div>
          <h2 className="text-4xl font-extrabold mb-4">
            Ready to Get Funded?
          </h2>
          <p className="text-slate-400 text-lg mb-3">
            Apply in 5 minutes. Term sheet in 24 hours. Funded in 10–14 days.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            No obligation. No SSN required upfront. No experience necessary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg px-10 text-base"
              onClick={() => navigate("/apply")}
            >
              Apply Now — It's Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href="tel:+18005483625">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white px-10 text-base w-full sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" /> Talk to an Advisor
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-md bg-amber-500">
                <Zap className="h-5 w-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="text-white font-extrabold text-base">
                LiteDOC<span className="text-amber-400">.LOANS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Hard money lending with minimal documentation, competitive rates, and closings in 10–14 days.
              Available in 48 states.
            </p>
            <div className="space-y-1 text-sm">
              <a
                href="tel:+18005483625"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" /> (800) 548-3625
              </a>
              <a
                href="mailto:info@litedoc.loans"
                className="flex items-center gap-2 hover:text-amber-400 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" /> info@litedoc.loans
              </a>
            </div>
          </div>

          {/* Loan Products */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Loan Programs
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                "DSCR Rental Loans",
                "Fix & Flip Loans",
                "Ground-Up Construction",
              ].map((l) => (
                <li key={l}>
                  <button
                    onClick={() => navigate("/apply")}
                    className="hover:text-amber-400 transition-colors text-left"
                  >
                    {l}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              {["About Us", "How It Works", "Borrower Resources"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-amber-400 transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {["Terms of Service", "Privacy Policy", "Licensing Info"].map(
                (l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-amber-400 transition-colors">
                      {l}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800">
          <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
            <span>© {new Date().getFullYear()} LiteDOC.LOANS. All rights reserved.</span>
            <span className="text-center">
              LiteDOC.LOANS is a private lender. Loans are for business/investment purposes only.
              Not available in all states. Subject to underwriting approval.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
