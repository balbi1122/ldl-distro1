import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
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
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  Crown,
  Feather,
  Film,
  Moon,
  Sparkles,
  TreePine,
  Waves,
  AlertCircle,
  Zap,
} from "lucide-react";

/* ─── Era options ─────────────────────────────────────────── */
const eras = [
  { value: "eras-tour", label: "Eras Tour", icon: <Crown className="h-4 w-4 text-amber-500" /> },
  { value: "midnights", label: "Midnights", icon: <Moon className="h-4 w-4 text-violet-500" /> },
  { value: "folklore", label: "Folklore", icon: <TreePine className="h-4 w-4 text-slate-500" /> },
  { value: "evermore", label: "Evermore", icon: <Feather className="h-4 w-4 text-orange-500" /> },
  { value: "1989", label: "1989", icon: <Waves className="h-4 w-4 text-sky-500" /> },
  { value: "colbert-book", label: "Colbert Book Project", icon: <BookOpen className="h-4 w-4 text-rose-500" /> },
  { value: "other", label: "Other / General", icon: <Sparkles className="h-4 w-4 text-pink-500" /> },
];

const contentTypes = [
  { value: "poem", label: "Poem", icon: <Feather className="h-4 w-4" /> },
  { value: "story", label: "Story", icon: <BookOpen className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Film className="h-4 w-4" /> },
];

/* ─── Form state type ─────────────────────────────────────── */
interface FormState {
  name: string;
  title: string;
  contentType: string;
  era: string;
  body: string;
  videoUrl: string;
  aiAssisted: boolean;
  aiDetails: string;
  // compliance checkboxes
  isOriginal: boolean;
  noCopyright: boolean;
  acceptsTerms: boolean;
}

const defaultForm: FormState = {
  name: "",
  title: "",
  contentType: "",
  era: "",
  body: "",
  videoUrl: "",
  aiAssisted: false,
  aiDetails: "",
  isOriginal: false,
  noCopyright: false,
  acceptsTerms: false,
};

/* ─── Component ───────────────────────────────────────────── */
const SubmitPage: React.FC = () => {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  /* helpers */
  const set = (field: keyof FormState, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const clearError = (field: keyof FormState) =>
    setErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });

  /* validation */
  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!form.title.trim()) e.title = "Please enter a title.";
    if (!form.contentType) e.contentType = "Please choose a content type.";
    if (!form.era) e.era = "Please choose an album or era.";
    if (form.contentType === "video") {
      if (!form.videoUrl.trim()) e.videoUrl = "Please provide a video URL.";
    } else {
      if (!form.body.trim()) e.body = "Please add some content.";
      else if (form.body.trim().length < 20) e.body = "Content must be at least 20 characters.";
    }
    if (form.aiAssisted && !form.aiDetails.trim())
      e.aiDetails = "Please briefly describe how AI was used.";
    if (!form.isOriginal) e.isOriginal = "Required";
    if (!form.noCopyright) e.noCopyright = "Required";
    if (!form.acceptsTerms) e.acceptsTerms = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // In a real implementation this would call an API
      console.log("Submission:", form);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    setForm(defaultForm);
    setErrors({});
    setSubmitted(false);
  };

  /* ─── Success screen ─── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-20">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center shadow-lg">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold mb-3 text-slate-900">
            {form.name.trim() ? `${form.name.trim()}, you're a Star!` : "You're a Star!"} ⭐
          </h1>
          <p className="text-slate-500 mb-8 text-lg">
            Your <span className="font-semibold text-violet-600">{form.contentType}</span>{" "}
            "<span className="italic">{form.title}</span>" has been submitted and is pending review.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white"
              onClick={handleReset}
            >
              <Feather className="mr-2 h-4 w-4" /> Submit Another
            </Button>
            <Button variant="outline" onClick={() => (window.location.href = "/")}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ─── Form ─── */
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50/50 to-white text-slate-900">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <span className="block text-sm font-bold tracking-tight text-slate-900">Stories For A</span>
              <span className="block text-sm font-bold tracking-tight text-violet-600">Showgirl</span>
            </div>
          </a>
          <a
            href="/"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" /> Back to Home
          </a>
        </div>
      </header>

      {/* Page title */}
      <div className="mx-auto max-w-5xl px-6 pt-12 pb-8">
        <div className="text-center">
          <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200 hover:bg-violet-100 px-4 py-1 text-xs uppercase tracking-wider">
            Share Your Creativity
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Submit Your{" "}
            <span className="bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
              Creation
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">
            Share your Taylor Swift inspired poem, story, or video with the Swiftie community.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mx-auto max-w-5xl px-6 pb-20 grid lg:grid-cols-3 gap-8">

          {/* ── Left column: main fields ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Content type */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Feather className="h-4 w-4 text-violet-500" /> What are you sharing?
              </h2>
              <div className="grid grid-cols-3 gap-3">
                {contentTypes.map(({ value, label, icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => { set("contentType", value); clearError("contentType"); }}
                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                      form.contentType === value
                        ? "border-violet-500 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-violet-50/50"
                    }`}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
              {errors.contentType && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.contentType}
                </p>
              )}
            </div>

            {/* Name */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" /> Your Name
              </h2>
              <div className="space-y-1">
                <Input
                  placeholder="How should we credit you?"
                  value={form.name}
                  onChange={(e) => { set("name", e.target.value); clearError("name"); }}
                  className={errors.name ? "border-red-400 focus-visible:ring-red-300" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>
            </div>

            {/* Title */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-violet-500" /> Title
              </h2>
              <div className="space-y-1">
                <Input
                  placeholder="Give your piece a title…"
                  value={form.title}
                  onChange={(e) => { set("title", e.target.value); clearError("title"); }}
                  className={errors.title ? "border-red-400 focus-visible:ring-red-300" : ""}
                />
                {errors.title && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.title}
                  </p>
                )}
              </div>
            </div>

            {/* Era */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-violet-500" /> Album / Era
              </h2>
              <Select
                value={form.era}
                onValueChange={(val) => { set("era", val); clearError("era"); }}
              >
                <SelectTrigger className={errors.era ? "border-red-400" : ""}>
                  <SelectValue placeholder="Choose an album or era…" />
                </SelectTrigger>
                <SelectContent>
                  {eras.map(({ value, label, icon }) => (
                    <SelectItem key={value} value={value}>
                      <span className="flex items-center gap-2">
                        {icon} {label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.era && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.era}
                </p>
              )}
            </div>

            {/* Content body / video URL */}
            {form.contentType === "video" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h2 className="font-semibold text-base flex items-center gap-2">
                  <Film className="h-4 w-4 text-violet-500" /> Video URL
                </h2>
                <div className="space-y-1">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={form.videoUrl}
                    onChange={(e) => { set("videoUrl", e.target.value); clearError("videoUrl"); }}
                    className={errors.videoUrl ? "border-red-400 focus-visible:ring-red-300" : ""}
                  />
                  <p className="text-xs text-slate-400">YouTube, Vimeo, or TikTok links accepted.</p>
                  {errors.videoUrl && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.videoUrl}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h2 className="font-semibold text-base flex items-center gap-2">
                  {form.contentType === "poem"
                    ? <Feather className="h-4 w-4 text-violet-500" />
                    : <BookOpen className="h-4 w-4 text-violet-500" />}
                  {form.contentType === "poem" ? "Your Poem" : form.contentType === "story" ? "Your Story" : "Your Content"}
                </h2>
                <div className="space-y-1">
                  <Textarea
                    placeholder={
                      form.contentType === "poem"
                        ? "Write your poem here… Let the words flow like Taylor's lyrics."
                        : form.contentType === "story"
                        ? "Begin your story here… Every great tale starts with a single line."
                        : "Write your content here…"
                    }
                    rows={12}
                    value={form.body}
                    onChange={(e) => { set("body", e.target.value); clearError("body"); }}
                    className={`resize-none font-mono text-sm leading-relaxed ${errors.body ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      {errors.body && (
                        <p className="text-xs text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> {errors.body}
                        </p>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 text-right">
                      {form.body.length} characters
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Disclosure */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
              <h2 className="font-semibold text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" /> AI Disclosure
              </h2>
              <div className="flex items-start gap-3">
                <Checkbox
                  id="aiAssisted"
                  checked={form.aiAssisted}
                  onCheckedChange={(checked) => set("aiAssisted", !!checked)}
                  className="mt-0.5"
                />
                <div>
                  <Label htmlFor="aiAssisted" className="font-medium cursor-pointer">
                    This content was created with AI assistance
                  </Label>
                  <p className="text-xs text-slate-400 mt-0.5">
                    AI-assisted content is welcome here — just let us know!
                  </p>
                </div>
              </div>
              {form.aiAssisted && (
                <div className="space-y-1 ml-7">
                  <Label className="text-sm">How was AI used?</Label>
                  <Textarea
                    placeholder="e.g. Used Claude to help brainstorm metaphors, then wrote the poem myself…"
                    rows={3}
                    value={form.aiDetails}
                    onChange={(e) => { set("aiDetails", e.target.value); clearError("aiDetails"); }}
                    className={`resize-none text-sm ${errors.aiDetails ? "border-red-400 focus-visible:ring-red-300" : ""}`}
                  />
                  {errors.aiDetails && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> {errors.aiDetails}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right column: compliance + submit ── */}
          <div className="space-y-6">

            {/* Compliance checkboxes */}
            <div className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-6 shadow-sm space-y-5">
              <h2 className="font-semibold text-base flex items-center gap-2 text-violet-800">
                <CheckCircle2 className="h-4 w-4 text-violet-600" /> Before You Submit
              </h2>
              <p className="text-xs text-violet-600 leading-relaxed">
                Please confirm all three items to keep our community safe and respectful.
              </p>

              <Separator className="bg-violet-200" />

              {/* Original Content */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="isOriginal"
                  checked={form.isOriginal}
                  onCheckedChange={(checked) => { set("isOriginal", !!checked); clearError("isOriginal"); }}
                  className={`mt-0.5 ${errors.isOriginal ? "border-red-400" : "border-violet-400 data-[state=checked]:bg-violet-600"}`}
                />
                <div>
                  <Label htmlFor="isOriginal" className="font-semibold text-sm cursor-pointer text-slate-800">
                    This is original content
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    This work was created by me (with or without AI assistance) and has not been copied from another source.
                  </p>
                  {errors.isOriginal && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> This confirmation is required.
                    </p>
                  )}
                </div>
              </div>

              {/* No copyrighted material */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="noCopyright"
                  checked={form.noCopyright}
                  onCheckedChange={(checked) => { set("noCopyright", !!checked); clearError("noCopyright"); }}
                  className={`mt-0.5 ${errors.noCopyright ? "border-red-400" : "border-violet-400 data-[state=checked]:bg-violet-600"}`}
                />
                <div>
                  <Label htmlFor="noCopyright" className="font-semibold text-sm cursor-pointer text-slate-800">
                    No copyrighted material
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    My submission does not reproduce song lyrics, album artwork, or any other copyrighted material without permission.
                  </p>
                  {errors.noCopyright && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> This confirmation is required.
                    </p>
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-3">
                <Checkbox
                  id="acceptsTerms"
                  checked={form.acceptsTerms}
                  onCheckedChange={(checked) => { set("acceptsTerms", !!checked); clearError("acceptsTerms"); }}
                  className={`mt-0.5 ${errors.acceptsTerms ? "border-red-400" : "border-violet-400 data-[state=checked]:bg-violet-600"}`}
                />
                <div>
                  <Label htmlFor="acceptsTerms" className="font-semibold text-sm cursor-pointer text-slate-800">
                    Content adheres to Terms & Conditions
                  </Label>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    My content follows the{" "}
                    <a href="/terms" className="text-violet-600 underline underline-offset-2 hover:text-violet-800">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="/copyright" className="text-violet-600 underline underline-offset-2 hover:text-violet-800">
                      Copyright Policy
                    </a>{" "}
                    of this community.
                  </p>
                  {errors.acceptsTerms && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> This confirmation is required.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Validation error summary */}
            {Object.keys(errors).length > 0 && (
              <Alert variant="destructive" className="rounded-2xl">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Please fix the errors above</AlertTitle>
                <AlertDescription className="text-xs">
                  All required fields and confirmations must be completed before submitting.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-md"
            >
              <Feather className="mr-2 h-4 w-4" /> Submit My Creation
            </Button>

            <p className="text-xs text-center text-slate-400">
              Your submission will be reviewed before being published. We typically review within 24 hours.
            </p>

            {/* Info card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-slate-700">Submission tips</h3>
              <ul className="space-y-2 text-slate-500 text-xs">
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">·</span>
                  Inspiration from Taylor's music is great — reproducing her lyrics is not.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">·</span>
                  Be specific with your title — it helps readers find your work.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">·</span>
                  AI-assisted? Disclose it! The community embraces all creative tools.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-violet-400 font-bold">·</span>
                  Choose the album that most inspired your piece for better discoverability.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmitPage;
