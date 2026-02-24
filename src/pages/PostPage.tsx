import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Post } from "../types";
import { fetchPostById } from "../lib/postsService";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Skeleton } from "../components/ui/skeleton";
import {
  ArrowLeft,
  Eye,
  Heart,
  Calendar,
  BookOpen,
  FileText,
  Film,
} from "lucide-react";
import { format } from "date-fns";

const typeIcon = {
  poem: <BookOpen className="w-4 h-4" />,
  story: <FileText className="w-4 h-4" />,
  video: <Film className="w-4 h-4" />,
};

function getYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchPostById(id)
      .then((p) => setPost(p))
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">📜</div>
        <h2 className="font-serif text-2xl font-bold mb-2">Post Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This story may have been removed or doesn't exist.
        </p>
        <Button onClick={() => navigate("/browse")}>Back to Browse</Button>
      </div>
    );
  }

  const color = post?.category?.color ?? "#c9386a";

  const renderVideo = (url: string) => {
    const ytId = getYouTubeId(url);
    if (ytId) {
      return (
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="w-full h-full"
            allowFullScreen
            title={post?.title}
          />
        </div>
      );
    }
    const vimeoId = getVimeoId(url);
    if (vimeoId) {
      return (
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            className="w-full h-full"
            allowFullScreen
            title={post?.title}
          />
        </div>
      );
    }
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-primary underline"
      >
        <Film className="w-4 h-4" /> Watch Video →
      </a>
    );
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-64 w-full mt-6" />
        </div>
      ) : post ? (
        <article>
          {/* Category stripe */}
          <div className="h-1.5 w-full rounded-full mb-6" style={{ backgroundColor: color }} />

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.category && (
              <Link to={`/category/${post.category.slug}`}>
                <Badge
                  className="text-white cursor-pointer hover:opacity-80"
                  style={{ backgroundColor: color }}
                >
                  {post.category.name}
                </Badge>
              </Link>
            )}
            <Badge variant="outline" className="gap-1">
              {typeIcon[post.content_type]}
              {post.content_type.charAt(0).toUpperCase() +
                post.content_type.slice(1)}
            </Badge>
            {post.is_featured && (
              <Badge className="bg-amber-400 text-amber-900 border-0">
                ✨ Featured
              </Badge>
            )}
          </div>

          {/* Title */}
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-6 border-b">
            <span className="font-medium text-foreground">
              By {post.author?.display_name ?? "Anonymous"}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.created_at), "MMMM d, yyyy")}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" /> {post.view_count} views
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" /> {post.like_count} likes
            </span>
          </div>

          {/* Content */}
          {post.content_type === "video" && post.video_url ? (
            <div className="mb-8">{renderVideo(post.video_url)}</div>
          ) : null}

          {post.content && (
            <div
              className={`prose prose-lg max-w-none text-foreground leading-relaxed ${
                post.content_type === "poem"
                  ? "font-serif whitespace-pre-line"
                  : ""
              }`}
            >
              {post.content_type === "poem" ? (
                <div className="text-xl leading-loose italic text-foreground/90">
                  {post.content}
                </div>
              ) : (
                <div className="space-y-4">
                  {post.content.split("\n\n").map((para, i) => (
                    <p key={i} className="leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copyright notice */}
          <div className="mt-10 pt-6 border-t border-border">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              <strong>📜 Original Fan Content:</strong> This is an original work
              created by a fan. It does not reproduce Taylor Swift's lyrics,
              music, or other copyrighted materials. Taylor Swift's intellectual
              property remains the property of Taylor Swift and her rights holders.
            </div>

            {post.author && (
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {post.author.display_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm">{post.author.display_name}</p>
                  {post.author.bio && (
                    <p className="text-xs text-muted-foreground">{post.author.bio}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </article>
      ) : null}
    </div>
  );
}
