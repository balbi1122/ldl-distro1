import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import {
  BookOpen,
  Check,
  ChevronRight,
  Crown,
  Feather,
  Film,
  Heart,
  Moon,
  Music,
  Shield,
  Sparkles,
  Star,
  TreePine,
  Users,
  Waves,
  Zap,
} from "lucide-react";

/* ─── Era data ─────────────────────────────────────────────────── */
const eras = [
  {
    title: "Eras Tour",
    slug: "Eras%20Tour",
    gradient: "from-yellow-400 to-amber-600",
    icon: <Crown className="h-6 w-6" />,
    description: "The record-breaking concert film era",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
  },
  {
    title: "Midnights",
    slug: "Midnights",
    gradient: "from-indigo-500 to-violet-700",
    icon: <Moon className="h-6 w-6" />,
    description: "13 sleepless nights and confessions",
    color: "text-violet-600",
    bg: "bg-violet-50 border-violet-200",
  },
  {
    title: "Folklore",
    slug: "Folklore",
    gradient: "from-slate-400 to-slate-700",
    icon: <TreePine className="h-6 w-6" />,
    description: "Indie folk daydreams & cottagecore",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
  },
  {
    title: "Evermore",
    slug: "Evermore",
    gradient: "from-orange-400 to-red-600",
    icon: <Feather className="h-6 w-6" />,
    description: "A sister album born in the woods",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  {
    title: "1989",
    slug: "1989",
    gradient: "from-sky-400 to-blue-600",
    icon: <Waves className="h-6 w-6" />,
    description: "Pop perfection and synth dreams",
    color: "text-sky-600",
    bg: "bg-sky-50 border-sky-200",
  },
  {
    title: "Colbert Book Project",
    slug: "Colbert%20Book%20Project",
    gradient: "from-rose-500 to-pink-700",
    icon: <BookOpen className="h-6 w-6" />,
    description: "Taylor's gothic mystery — co-written by fans",
    color: "text-rose-600",
    bg: "bg-rose-50 border-rose-200",
  },
];

/* ─── Membership plans ─────────────────────────────────────────── */
const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    tagline: "Start sharing your creativity",
    cta: "Get Started",
    highlighted: false,
    features: [
      "Browse all content",
      "1 piece of content",
      "Basic community access",
      "Album category browsing",
    ],
  },
  {
    name: "Monthly",
    price: "7",
    period: "/month",
    tagline: "Perfect for active creators",
    cta: "Subscribe",
    highlighted: false,
    features: [
      "Everything in Free",
      "Unlimited content posts",
      "Priority support",
      "Early access to features",
      "Creator badge",
    ],
  },
  {
    name: "Annual",
    price: "49",
    period: "/year",
    tagline: "Best value for dedicated Swifties",
    cta: "Subscribe",
    highlighted: true,
    badge: "Best Value",
    features: [
      "Everything in Monthly",
      "2 months free",
      "Exclusive content access",
      "Annual member badge",
      "Featured creator opportunities",
    ],
  },
  {
    name: "Lifetime",
    price: "99",
    period: "one-time",
    tagline: "Join the inner circle forever",
    cta: "Subscribe",
    highlighted: false,
    badge: "Popular",
    features: [
      "Everything in Annual",
      "Lifetime access",
      "Founding member status",
      "Exclusive Lifetime badge",
      "Direct input on features",
      "VIP community events",
    ],
  },
];

/* ─── Component ────────────────────────────────────────────────── */
const Home: React.FC = () => {
  const [activeNav, setActiveNav] = useState("");

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">

      {/* ── Navigation ── */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-slate-900">Stories For A</span>
              <span className="block text-sm font-bold tracking-tight text-violet-600">Showgirl</span>
            </div>
          </a>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {[
              { label: "Browse", href: "/browse" },
              { label: "Albums & Eras", href: "/albums" },
              { label: "Colbert Book", href: "/colbert-project" },
              { label: "Membership", href: "/membership" },
            ].map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="hover:text-violet-600 transition-colors"
                onClick={() => setActiveNav(label)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
              Start Writing
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-50 via-pink-50 to-white">
        {/* Decorative stars */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[
            { top: "10%", left: "8%", size: "h-2 w-2", opacity: "opacity-40" },
            { top: "20%", left: "75%", size: "h-3 w-3", opacity: "opacity-30" },
            { top: "60%", left: "5%", size: "h-2 w-2", opacity: "opacity-20" },
            { top: "40%", left: "90%", size: "h-2 w-2", opacity: "opacity-30" },
            { top: "75%", left: "85%", size: "h-3 w-3", opacity: "opacity-20" },
            { top: "15%", left: "45%", size: "h-1.5 w-1.5", opacity: "opacity-50" },
          ].map((s, i) => (
            <Star
              key={i}
              className={`absolute ${s.size} ${s.opacity} fill-violet-400 text-violet-400`}
              style={{ top: s.top, left: s.left }}
            />
          ))}
        </div>

        <div className="mx-auto max-w-4xl px-6 py-24 text-center relative">
          <Badge className="mb-5 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100 px-4 py-1 text-xs uppercase tracking-wider">
            A Community for Swifties
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Stories For A{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Showgirl
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-500 mb-10 leading-relaxed">
            Share your Taylor Swift inspired stories, poems, and videos with a
            community that celebrates creativity in every era.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="bg-violet-600 hover:bg-violet-700 text-white shadow-md px-8"
            >
              <Feather className="mr-2 h-4 w-4" /> Start Writing
            </Button>
            <Button size="lg" variant="outline" className="px-8 border-slate-300">
              Browse Stories <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-violet-500" /> Free to join
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-violet-500" /> Original content only
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-violet-500" /> AI-assisted welcome
            </span>
          </div>
        </div>
      </section>

      {/* ── Why section ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Why Stories For A Showgirl?</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            A dedicated space for Taylor Swift fans to express their creativity through original works.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Feather className="h-6 w-6 text-violet-500" />,
              title: "Share Your Creativity",
              desc: "Post stories, poems, and videos inspired by Taylor Swift's music and lyrics.",
              bg: "bg-violet-50",
            },
            {
              icon: <Users className="h-6 w-6 text-pink-500" />,
              title: "Join the Community",
              desc: "Connect with fellow Swifties who share your passion for creative expression.",
              bg: "bg-pink-50",
            },
            {
              icon: <Shield className="h-6 w-6 text-sky-500" />,
              title: "Safe & Respectful",
              desc: "A moderated space that celebrates original work and respects copyright.",
              bg: "bg-sky-50",
            },
            {
              icon: <Zap className="h-6 w-6 text-amber-500" />,
              title: "AI Welcome",
              desc: "AI-assisted content is welcome here, as long as it's properly disclosed.",
              bg: "bg-amber-50",
            },
          ].map(({ icon, title, desc, bg }) => (
            <div key={title} className={`rounded-2xl p-6 ${bg}`}>
              <div className="mb-4">{icon}</div>
              <h3 className="font-semibold text-base mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Albums & Eras ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Explore by Album & Era</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Content organized by Taylor's iconic albums and tours. Find inspiration from your favorite era.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {eras.map((era) => (
            <a
              key={era.title}
              href={`/browse?album=${era.slug}`}
              className={`group rounded-2xl border p-6 ${era.bg} hover:shadow-md transition-all hover:-translate-y-0.5`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${era.color}`}>{era.icon}</div>
                <ChevronRight className={`h-4 w-4 ${era.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
              </div>
              <h3 className={`font-bold text-lg mb-1 ${era.color}`}>{era.title}</h3>
              <p className="text-sm text-slate-500 mb-3">{era.description}</p>
              <div className="flex items-center gap-2">
                <div className={`h-1.5 w-24 rounded-full bg-gradient-to-r ${era.gradient} opacity-60`} />
                <span className="text-xs text-slate-400">0 pieces</span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="border-slate-300">
            View All Albums <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Colbert Book Project ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-violet-950 to-slate-900 text-white overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left */}
            <div className="p-10 lg:p-14">
              <Badge className="mb-4 bg-white/10 text-pink-300 border-white/10 hover:bg-white/10">
                Special Project
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-extrabold mb-4 leading-tight">
                The Colbert{" "}
                <span className="bg-gradient-to-r from-pink-400 to-violet-400 bg-clip-text text-transparent">
                  Book Project
                </span>
              </h2>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                Inspired by Taylor Swift's appearance on The Late Show with Stephen Colbert in December 2025 — a collaborative storytelling experience where Swifties bring Taylor's gothic mystery outline to life.
              </p>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">
                Key Themes
              </h3>
              <ul className="space-y-2 mb-8">
                {[
                  "An old, rambling British mansion covered in moss or ivy",
                  "A mysterious relationship — he may not be what he seems",
                  "A murder in the past, whispered about but never resolved",
                  "The possibility of a ghost — or an actual ghost",
                  "A family compound on an island off the coast of Maine",
                  "Deep family secrets",
                  "A brother who disappeared for ten years and suddenly returns",
                ].map((theme) => (
                  <li key={theme} className="flex items-start gap-2 text-sm text-slate-300">
                    <Star className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 fill-pink-400 text-pink-400" />
                    {theme}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white shadow">
                  <Feather className="mr-2 h-4 w-4" /> Write Your Chapter
                </Button>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 hover:text-white">
                  Read Contributions
                </Button>
              </div>
            </div>

            {/* Right — plot twist card */}
            <div className="p-10 lg:p-14 flex flex-col justify-center gap-6 border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Moon className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">The Plot Twist</span>
                </div>
                <p className="text-lg font-semibold text-white mb-1">Unreliable narrator</p>
                <p className="text-slate-400 text-sm">She is the psychopath.</p>
              </div>

              <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="h-4 w-4 text-pink-400" />
                  <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">Additional Elements</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {[
                    "A mistress who is actually related to the family",
                    "Someone falls off a cliff",
                    "The family does not actually own the island",
                    "Their father was really his twin brother",
                    "The father died in a mysterious drowning",
                  ].map((el) => (
                    <li key={el} className="flex items-start gap-2">
                      <span className="text-pink-400 mt-0.5">·</span> {el}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Content types ── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Three Ways to Create</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Express your love for Taylor's music through the medium that speaks to you.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            {
              icon: <Feather className="h-8 w-8 text-violet-500" />,
              label: "Poems",
              desc: "Lyrical verses and free-form poetry inspired by Taylor's storytelling.",
              gradient: "from-violet-500 to-purple-700",
              bg: "bg-violet-50",
            },
            {
              icon: <BookOpen className="h-8 w-8 text-pink-500" />,
              label: "Stories",
              desc: "Short fiction, fan fiction, and prose rooted in Taylor's universe.",
              gradient: "from-pink-500 to-rose-700",
              bg: "bg-pink-50",
            },
            {
              icon: <Film className="h-8 w-8 text-amber-500" />,
              label: "Videos",
              desc: "Fan edits, covers, spoken word — creativity in motion.",
              gradient: "from-amber-400 to-orange-600",
              bg: "bg-amber-50",
            },
          ].map(({ icon, label, desc, gradient, bg }) => (
            <div key={label} className={`rounded-2xl ${bg} p-8 text-center`}>
              <div className="flex justify-center mb-4">{icon}</div>
              <h3 className="text-xl font-bold mb-2">{label}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>
              <div className={`h-1 w-12 rounded-full bg-gradient-to-r ${gradient} mx-auto`} />
            </div>
          ))}
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      {/* ── Membership ── */}
      <section className="mx-auto max-w-6xl px-6 py-20" id="membership">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Choose Your Membership</h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Join free or upgrade to unlock unlimited posting and exclusive features.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col rounded-2xl ${
                plan.highlighted
                  ? "border-2 border-violet-500 shadow-lg shadow-violet-100"
                  : "border border-slate-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className={plan.highlighted ? "bg-violet-600 text-white" : "bg-slate-700 text-white"}>
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardHeader className="pb-2 pt-7">
                <div className="flex items-center gap-2 mb-1">
                  <Music className="h-4 w-4 text-violet-400" />
                  <CardTitle className="text-base font-bold">{plan.name}</CardTitle>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-extrabold">${plan.price}</span>
                  <span className="text-sm text-slate-400 mb-1">{plan.period}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{plan.tagline}</p>
              </CardHeader>
              <CardContent className="flex flex-col flex-1 gap-4">
                <Separator />
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-violet-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full mt-2 ${
                    plan.highlighted
                      ? "bg-violet-600 hover:bg-violet-700 text-white"
                      : "variant-outline"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-gradient-to-br from-violet-600 to-pink-600 text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">
          <Heart className="mx-auto mb-4 h-8 w-8 fill-white text-white opacity-80" />
          <p className="text-sm uppercase tracking-widest mb-3 opacity-80">Made by Swifties, for Swifties</p>
          <h2 className="text-4xl font-extrabold mb-4">Ready to Share Your Story?</h2>
          <p className="text-violet-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Taylor Swift fans sharing their creative works. Your story is waiting to be told.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-violet-700 hover:bg-violet-50 shadow-md px-8 font-semibold">
              Join Now — It's Free
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 hover:text-white px-8">
              Browse Content
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400">
        <div className="mx-auto max-w-6xl px-6 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-bold text-white">Stories For A Showgirl</span>
            </div>
            <p className="text-sm leading-relaxed">
              A community for Taylor Swift fans to share their creative works inspired by Taylor and her music.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              {["Browse Content", "Albums & Eras", "Colbert Book Project"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Membership</h4>
            <ul className="space-y-2 text-sm">
              {["Pricing", "Gift a Membership"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              {["Terms of Service", "Privacy Policy", "Copyright Policy"].map((l) => (
                <li key={l}><a href="#" className="hover:text-white transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mx-auto max-w-6xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-600">
          <span>Made with ♥ by Swifties, for Swifties</span>
          <span>This is a fan community. Not affiliated with Taylor Swift or Taylor Nation.</span>
        </div>
      </footer>

    </div>
  );
};

export default Home;
