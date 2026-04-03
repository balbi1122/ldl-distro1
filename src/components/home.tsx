import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  DollarSign,
  FileText,
  Hammer,
  HardHat,
  Home,
  MapPin,
  Phone,
  Shield,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

/* ─── Loan products ────────────────────────────────────────────── */
const loanProducts = [
  {
    icon: <Home className="h-8 w-8 text-amber-500" />,
    title: "DSCR Rental Loans",
    badge: "No Income Docs",
    badgeColor: "bg-blue-100 text-blue-700 border-blue-200",
    headline: "Qualify on property cash flow, not W-2s",
    specs: [
      { label: "LTV", value: "Up to 80%" },
      { label: "Loan Term", value: "30-year fixed" },
      { label: "Min FICO", value: "640+" },
    ],
    features: [
      "No personal income verification",
      "Single-family & multi-family 2–4 units",
      "No prepayment penalty after month 6",
      "Short-term rental (Airbnb/VRBO) eligible",
    ],
    cta: "Get DSCR Quote",
    accentColor: "border-blue-500",
    bgGradient: "from-blue-50 to-white",
    type: "dscr",
  },
  {
    icon: <Hammer className="h-8 w-8 text-amber-500" />,
    title: "Fix & Flip Loans",
    badge: "No Experience Required",
    badgeColor: "bg-amber-100 text-amber-700 border-amber-200",
    headline: "Up to 90% of purchase + 100% of rehab costs",
    specs: [
      { label: "LTC", value: "Up to 90%" },
      { label: "ARV", value: "Up to 75%" },
      { label: "Close Time", value: "10–14 days" },
    ],
    features: [
      "First-time investors welcome",
      "100% rehab cost financing",
      "Interest-only payments",
      "12–24 month terms",
    ],
    cta: "Get Fix & Flip Quote",
    accentColor: "border-amber-500",
    bgGradient: "from-amber-50 to-white",
    type: "fix_flip",
  },
  {
    icon: <HardHat className="h-8 w-8 text-amber-500" />,
    title: "Ground-Up Construction",
    headline: "Build from scratch with flexible draw schedules",
    badge: "Up to 90% LTC",
    badgeColor: "bg-green-100 text-green-700 border-green-200",
    specs: [
      { label: "LTC", value: "Up to 90%" },
      { label: "Loan Term", value: "12–24 months" },
      { label: "Close Time", value: "10–14 days" },
    ],
    features: [
      "Lot acquisition + construction in one loan",
      "Staged draw schedule — funds as you build",
      "Single-family & small multifamily",
      "No experience required (with 80% LTC)",
    ],
    cta: "Get Construction Quote",
    accentColor: "border-green-500",
    bgGradient: "from-green-50 to-white",
    type: "ground_up",
  },
];

/* ─── Why LiteDOC ─────────────────────────────────────────────── */
const whyUs = [
  {
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    title: "Minimal Documentation",
    desc: "Our name says it all. No tax returns, no pay stubs, no financial statements — just the deal details. Less paper, faster close.",
    vs: "Competitors require 2 years of returns + extensive packages",
  },
  {
    icon: <Clock className="h-6 w-6 text-amber-500" />,
    title: "10–14 Day Close",
    desc: "Hard committed timeline, not a marketing claim. Sellers and agents trust a firm close date over vague 'up to 3 week' estimates.",
    vs: "Industry average is 21–28 days",
  },
  {
    icon: <DollarSign className="h-6 w-6 text-amber-500" />,
    title: "1.5–2 Points Origination",
    desc: "No broker markup, no hidden fees. Direct lending means you keep more of your profit. On a $500K deal, that's $5,000–$12,500 back in your pocket.",
    vs: "Competitors + broker layers often reach 4–5 points total",
  },
  {
    icon: <Shield className="h-6 w-6 text-amber-500" />,
    title: "First-Time Investors Welcome",
    desc: "No flip history required for Fix & Flip. No landlord experience for DSCR. We underwrite the deal, not your resume.",
    vs: "Most competitors require 1–3 completed deals",
  },
];

/* ─── How it works ────────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    icon: <FileText className="h-6 w-6 text-amber-500" />,
    title: "Apply Online",
    desc: "Complete our 5-minute questionnaire. No credit pull, no commitment — just tell us about your deal.",
    time: "5 minutes",
  },
  {
    num: "02",
    icon: <BadgeCheck className="h-6 w-6 text-amber-500" />,
    title: "Get Your Term Sheet",
    desc: "A LiteDOC advisor reviews your deal and sends a detailed term sheet within 24 hours. Rates, LTV, and fees — all upfront, no surprises.",
    time: "Within 24 hours",
  },
  {
    num: "03",
    icon: <DollarSign className="h-6 w-6 text-amber-500" />,
    title: "Close & Get Funded",
    desc: "Submit your lite doc package. We underwrite fast and close in 10–14 business days. Funds wired directly to title.",
    time: "10–14 business days",
  },
];

/* ─── Testimonials ────────────────────────────────────────────── */
const testimonials = [
  {
    name: "Marcus T.",
    location: "Phoenix, AZ",
    loanType: "Fix & Flip",
    loanTypeColor: "bg-amber-100 text-amber-700",
    quote:
      "Closed my first flip with LiteDOC in 12 days. Other lenders kept asking for more paperwork — these guys asked for the purchase contract and scope of work, that was it. Profit was $47K.",
    stars: 5,
  },
  {
    name: "Sandra & Kevin L.",
    location: "Atlanta, GA",
    loanType: "DSCR Rental",
    loanTypeColor: "bg-blue-100 text-blue-700",
    quote:
      "We built a 6-property rental portfolio in 18 months using DSCR loans from LiteDOC. No income verification meant our self-employed status never slowed us down. Rates were competitive and the process was seamless.",
    stars: 5,
  },
  {
    name: "Derek W.",
    location: "Dallas, TX",
    loanType: "Ground-Up",
    loanTypeColor: "bg-green-100 text-green-700",
    quote:
      "Built two spec homes back to back. LiteDOC funded 90% LTC including the lot — my out-of-pocket was minimal. Draws released within 48 hours of inspection sign-off. Will never use another lender.",
    stars: 5,
  },
];

/* ─── FAQs ────────────────────────────────────────────────────── */
const faqs = [
  {
    q: "What credit score do I need?",
    a: "640+ FICO for most programs. We can work with scores as low as 620 with compensating factors like lower LTV or larger reserves.",
  },
  {
    q: "Do I need real estate experience?",
    a: "No. We welcome first-time investors on all loan programs. For Fix & Flip, first-timers are capped at 75% ARV instead of 80% — that's the only adjustment.",
  },
  {
    q: "What states do you lend in?",
    a: "We lend in 48 states. Contact us for availability in North Dakota and South Dakota.",
  },
  {
    q: "What documents do I actually need?",
    a: "DSCR: Lease/rent schedule + entity docs. Fix & Flip: Purchase contract + scope of work + contractor bids. Ground-Up: Lot docs + construction budget + plans. That's it — no tax returns, no bank statements, no personal financial statements.",
  },
  {
    q: "Is there a prepayment penalty?",
    a: "DSCR loans have no prepayment penalty after month 6. Fix & Flip and construction loans have no prepayment penalty at all — pay off early, pay no extra.",
  },
  {
    q: "How fast are construction draw releases?",
    a: "Draws are released within 48–72 hours of inspection sign-off. We have in-house inspectors in most major markets which eliminates third-party delays.",
  },
];

/* ─── Component ────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 bg-slate-950 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-6 py-3.5 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-slate-950 shadow-sm">
              <Zap className="h-5 w-5 font-bold" />
            </div>
            <div className="leading-none">
              <span className="text-base font-black tracking-tight text-white">LiteDOC</span>
              <span className="text-base font-black tracking-tight text-amber-500">.LOANS</span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            {[
              { label: "DSCR Rental", href: "#products" },
              { label: "Fix & Flip", href: "#products" },
              { label: "Construction", href: "#products" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "FAQ", href: "#faq" },
            ].map(({ label, href }) => (
              <a key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+18005483625" className="hidden sm:flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors">
              <Phone className="h-3.5 w-3.5" /> (800) 548-3625
            </a>
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm px-5"
              onClick={() => navigate("/apply")}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800">
        {/* subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 lg:py-32 text-center">
          <Badge className="mb-6 bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            Hard Money Loans — Close in 10–14 Days
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-[1.05]">
            Fast Private Lending.{" "}
            <span className="text-amber-400">Fewer Docs.</span>
            <br />
            Better Terms.
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 mb-10 leading-relaxed">
            DSCR rental loans, fix & flip financing, and ground-up construction — closed in 10–14 days with minimal documentation. First-time investors welcome.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg px-10 text-base"
              onClick={() => navigate("/apply")}
            >
              Apply in 5 Minutes <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8"
              onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
            >
              View Loan Programs
            </Button>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-700 rounded-2xl overflow-hidden border border-slate-700">
            {[
              { value: "$500M+", label: "Capital Deployed" },
              { value: "2,000+", label: "Loans Funded" },
              { value: "10–14", label: "Days to Close" },
              { value: "48 States", label: "Nationwide Lending" },
            ].map(({ value, label }) => (
              <div key={label} className="bg-slate-900 px-6 py-5 text-center">
                <p className="text-2xl sm:text-3xl font-black text-amber-400 mb-0.5">{value}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Loan Products ── */}
      <section id="products" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Three Programs. <span className="text-amber-500">One Streamlined Process.</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Whether you're buying rentals, flipping houses, or building from scratch — we have a loan designed for your strategy.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {loanProducts.map((product) => (
            <Card
              key={product.title}
              className={`relative flex flex-col rounded-2xl border-t-4 ${product.accentColor} shadow-sm hover:shadow-lg transition-shadow`}
            >
              <CardHeader className="pb-3 pt-7">
                <div className="flex items-start justify-between mb-4">
                  {product.icon}
                  <Badge className={`text-xs border ${product.badgeColor}`}>{product.badge}</Badge>
                </div>
                <CardTitle className="text-xl font-black text-slate-900">{product.title}</CardTitle>
                <p className="text-sm text-slate-500 mt-1">{product.headline}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-5">
                {/* Specs */}
                <div className="grid grid-cols-3 gap-2">
                  {product.specs.map(({ label, value }) => (
                    <div key={label} className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-center">
                      <p className="text-xs text-slate-400 mb-0.5">{label}</p>
                      <p className="text-sm font-bold text-slate-900">{value}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Features */}
                <ul className="space-y-2 flex-1">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <CheckCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                  onClick={() => navigate("/apply")}
                >
                  {product.cta} <ChevronRight className="ml-1.5 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ── Why LiteDOC ── */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
              Why Investors Choose <span className="text-amber-500">LiteDOC.LOANS</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              We built LiteDOC because real estate investors deserve a lender that moves at the speed of the market.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUs.map(({ icon, title, desc, vs }) => (
              <div key={title} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-4">
                <div className="h-10 w-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
                </div>
                <div className="mt-auto pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-400 italic">vs: {vs}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            From Application to Funding in <span className="text-amber-500">3 Steps</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            No endless back-and-forth. No mystery. A clear path from deal to dollars.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 relative">
          {/* Connector line on desktop */}
          <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px bg-amber-200 z-0" />

          {steps.map((step, i) => (
            <div key={step.num} className="relative z-10 flex flex-col items-center text-center gap-4">
              <div className="h-20 w-20 rounded-full bg-slate-950 text-white flex items-center justify-center shadow-lg border-4 border-amber-400">
                <span className="text-2xl font-black text-amber-400">{step.num}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                <Clock className="h-3 w-3" /> {step.time}
              </div>
              <h3 className="text-xl font-black text-slate-900">{step.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-10 shadow-md"
            onClick={() => navigate("/apply")}
          >
            Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <p className="mt-3 text-sm text-slate-400">No credit pull. No commitment. Just tell us about your deal.</p>
        </div>
      </section>

      <Separator className="mx-auto max-w-7xl" />

      {/* ── Testimonials ── */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Real Investors. <span className="text-amber-400">Real Results.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Don't take our word for it — hear from the investors who've closed with LiteDOC.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map(({ name, location, loanType, loanTypeColor, quote, stars }) => (
              <div key={name} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 italic">"{quote}"</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-white">{name}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold rounded-full px-3 py-1 ${loanTypeColor}`}>
                    {loanType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Competitive Edge Banner ── */}
      <section className="bg-amber-500">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-wrap items-center justify-center gap-8 text-slate-950">
            {[
              { icon: <FileText className="h-5 w-5" />, text: "No Tax Returns Required" },
              { icon: <Clock className="h-5 w-5" />, text: "10–14 Day Close Guaranteed" },
              { icon: <TrendingUp className="h-5 w-5" />, text: "1.5–2 Points Origination" },
              { icon: <Shield className="h-5 w-5" />, text: "640+ FICO Accepted" },
              { icon: <Building2 className="h-5 w-5" />, text: "48 States" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-2 font-bold text-sm">
                {icon} {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3">
            Frequently Asked <span className="text-amber-500">Questions</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Straight answers to the questions we hear most.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-slate-900 text-sm sm:text-base">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 flex-shrink-0 ml-4 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Badge className="mb-6 bg-amber-500/15 text-amber-400 border-amber-500/30 hover:bg-amber-500/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
            Apply in 5 Minutes — No Credit Pull
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-5">
            Ready to Get Funded?
          </h2>
          <p className="text-slate-400 text-xl mb-10 max-w-xl mx-auto leading-relaxed">
            Tell us about your deal and a LiteDOC advisor will send you a term sheet within 24 hours. No obligation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-10 shadow-lg text-base"
              onClick={() => navigate("/apply")}
            >
              Start Your Application <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <a href="tel:+18005483625">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white px-8 w-full sm:w-auto"
              >
                <Phone className="mr-2 h-4 w-4" /> Call (800) 548-3625
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-black text-slate-400">
        <div className="mx-auto max-w-7xl px-6 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-slate-950">
                <Zap className="h-4 w-4" />
              </div>
              <span className="font-black text-white">LiteDOC<span className="text-amber-500">.LOANS</span></span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Fast, flexible hard money loans for real estate investors. DSCR, Fix & Flip, and Ground-Up Construction — nationwide.
            </p>
            <a href="tel:+18005483625" className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> (800) 548-3625
            </a>
            <a href="mailto:info@litedoc.loans" className="text-sm text-amber-400 hover:text-amber-300 block mt-1">
              info@litedoc.loans
            </a>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Loan Programs</h4>
            <ul className="space-y-2 text-sm">
              {["DSCR Rental Loans", "Fix & Flip Loans", "Ground-Up Construction", "Bridge Loans"].map((l) => (
                <li key={l}>
                  <a href="/apply" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              {["About LiteDOC", "How It Works", "FAQ", "Contact Us"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              {["DSCR Calculator", "Fix & Flip Calculator", "Loan Programs Guide", "Investor Blog"].map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-700">
          <span>© 2026 LiteDOC.LOANS — All rights reserved.</span>
          <span>LiteDOC.LOANS is a private lender. Not a bank. Loans subject to eligibility and approval. Available in 48 states.</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;
