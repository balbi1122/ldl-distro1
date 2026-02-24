import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { fetchCategories, createPost } from "../lib/postsService";
import { Category } from "../types";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Alert } from "../components/ui/alert";
import { Badge } from "../components/ui/badge";
import { useToast } from "../components/ui/use-toast";
import { Lock } from "lucide-react";

const schema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(120),
    category_id: z.string().min(1, "Please select a category"),
    content_type: z.enum(["poem", "story", "video"]),
    content: z.string().optional(),
    video_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
    excerpt: z.string().max(300).optional(),
    agreeCopyright: z.boolean().refine((v) => v, {
      message: "You must confirm your content is original",
    }),
  })
  .superRefine((data, ctx) => {
    if (data.content_type === "video") {
      if (!data.video_url || data.video_url.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Video URL is required for video content",
          path: ["video_url"],
        });
      }
    } else {
      if (!data.content || data.content.trim().length < 50) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Content must be at least 50 characters",
          path: ["content"],
        });
      }
    }
  });

type FormData = z.infer<typeof schema>;

export default function SubmitPage() {
  const { profile, canPost } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoadingCats(false));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { content_type: "poem", agreeCopyright: false },
  });

  const contentType = watch("content_type");
  const agreeCopyright = watch("agreeCopyright");

  const onSubmit = async (data: FormData) => {
    if (!profile) return;

    const { data: newPost, error } = await createPost({
      author_id: profile.id,
      category_id: data.category_id,
      title: data.title,
      content_type: data.content_type,
      content: data.content ?? null,
      video_url: data.video_url || null,
      excerpt: data.excerpt ?? null,
      author: profile,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Published! 🎉",
      description: "Your content has been submitted to the portal.",
    });
    navigate(`/post/${newPost?.id}`);
  };

  if (!canPost) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-xl text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h2 className="font-serif text-3xl font-bold mb-3">
          Upgrade to Post More
        </h2>
        <p className="text-muted-foreground mb-6">
          Free members can post one piece of content. You've used your free post!
          Upgrade to a paid plan to post unlimited content.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            className="bg-primary text-white"
            onClick={() => navigate("/pricing")}
          >
            See Membership Plans
          </Button>
          <Button variant="outline" onClick={() => navigate("/browse")}>
            Browse Content
          </Button>
        </div>
      </div>
    );
  }

  const albumCategories = categories.filter((c) => c.type === "album");
  const tourCategories = categories.filter((c) => c.type === "tour");
  const specialCategories = categories.filter((c) => c.type === "special");

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Share Your Story ✍️
        </h1>
        <p className="text-muted-foreground">
          Submit an original poem, story, or video inspired by Taylor Swift's
          music and artistry.
        </p>
        {profile?.membership_tier === "free" && (
          <Alert className="mt-4 border-amber-300 bg-amber-50 text-amber-800 text-sm">
            <Lock className="w-4 h-4 inline mr-1" />
            <strong>Free plan:</strong> You have 1 free post. After this, upgrade
            to continue posting.
          </Alert>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Give your piece a title…"
            className="mt-1"
            {...register("title")}
          />
          {errors.title && (
            <p className="text-destructive text-xs mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <Label>Category *</Label>
          <Select onValueChange={(v) => setValue("category_id", v, { shouldValidate: true })}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select an era or category…" />
            </SelectTrigger>
            <SelectContent>
              {loadingCats ? (
                <SelectItem value="" disabled>Loading categories…</SelectItem>
              ) : (
                <>
                  <SelectItem value="" disabled className="text-xs text-muted-foreground font-semibold">
                    — Albums —
                  </SelectItem>
                  {albumCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.year_info})
                    </SelectItem>
                  ))}
                  <SelectItem value="" disabled className="text-xs text-muted-foreground font-semibold">
                    — Tours —
                  </SelectItem>
                  {tourCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name} ({c.year_info})
                    </SelectItem>
                  ))}
                  <SelectItem value="" disabled className="text-xs text-muted-foreground font-semibold">
                    — Special —
                  </SelectItem>
                  {specialCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </>
              )}
            </SelectContent>
          </Select>
          {errors.category_id && (
            <p className="text-destructive text-xs mt-1">
              {errors.category_id.message}
            </p>
          )}
        </div>

        {/* Content type */}
        <div>
          <Label>Content Type *</Label>
          <div className="flex gap-3 mt-1">
            {(["poem", "story", "video"] as const).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setValue("content_type", t, { shouldValidate: true })}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  contentType === t
                    ? "bg-primary text-white border-primary"
                    : "bg-card border-border text-foreground/70 hover:border-primary"
                }`}
              >
                {t === "poem" ? "📜 Poem" : t === "story" ? "📖 Story" : "🎬 Video"}
              </button>
            ))}
          </div>
        </div>

        {/* Content or video URL */}
        {contentType === "video" ? (
          <div>
            <Label htmlFor="video_url">Video URL *</Label>
            <Input
              id="video_url"
              type="url"
              placeholder="https://youtube.com/watch?v=… or https://vimeo.com/…"
              className="mt-1"
              {...register("video_url")}
            />
            <p className="text-xs text-muted-foreground mt-1">
              YouTube and Vimeo links supported
            </p>
            {errors.video_url && (
              <p className="text-destructive text-xs mt-1">
                {errors.video_url.message}
              </p>
            )}
          </div>
        ) : (
          <div>
            <Label htmlFor="content">
              {contentType === "poem" ? "Your Poem" : "Your Story"} *
            </Label>
            <Textarea
              id="content"
              placeholder={
                contentType === "poem"
                  ? "Write your poem here…\n\nFor line breaks in a poem, simply press Enter."
                  : "Write your story here…\n\nYou can use paragraph breaks to structure your writing."
              }
              className={`mt-1 min-h-[280px] ${contentType === "poem" ? "font-serif text-base leading-loose" : ""}`}
              {...register("content")}
            />
            {errors.content && (
              <p className="text-destructive text-xs mt-1">
                {errors.content.message}
              </p>
            )}
          </div>
        )}

        {/* Excerpt */}
        <div>
          <Label htmlFor="excerpt">
            Short Description{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="excerpt"
            placeholder="A brief description of your piece shown on cards (max 300 characters)…"
            className="mt-1 min-h-[80px]"
            maxLength={300}
            {...register("excerpt")}
          />
        </div>

        {/* Copyright agreement */}
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-2">
            📜 Copyright Declaration
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            By submitting, you confirm that:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 mb-4 list-disc list-inside">
            <li>This is your own original work</li>
            <li>It does not reproduce Taylor Swift's copyrighted lyrics or music</li>
            <li>It is inspired by, not copied from, her work</li>
            <li>You grant the portal a non-exclusive licence to display this content</li>
          </ul>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="agreeCopyright"
              className="w-4 h-4 accent-rose-600"
              checked={agreeCopyright}
              onChange={(e) =>
                setValue("agreeCopyright", e.target.checked, {
                  shouldValidate: true,
                })
              }
            />
            <label htmlFor="agreeCopyright" className="text-sm text-foreground cursor-pointer">
              I confirm this is my original work and does not infringe copyright
            </label>
          </div>
          {errors.agreeCopyright && (
            <p className="text-destructive text-xs mt-1">
              {errors.agreeCopyright.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-primary text-white hover:bg-primary/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing…" : "Publish My Content 🎤"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
