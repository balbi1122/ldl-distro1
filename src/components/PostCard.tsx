import { Link } from "react-router-dom";
import { Post } from "../types";
import { Badge } from "./ui/badge";
import { Heart, Eye, BookOpen, Film, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PostCardProps {
  post: Post;
  className?: string;
}

const contentTypeIcon = {
  poem: <BookOpen className="w-3.5 h-3.5" />,
  story: <FileText className="w-3.5 h-3.5" />,
  video: <Film className="w-3.5 h-3.5" />,
};

const contentTypeLabel = {
  poem: "Poem",
  story: "Story",
  video: "Video",
};

export default function PostCard({ post, className = "" }: PostCardProps) {
  const color = post.category?.color ?? "#c9386a";

  return (
    <Link
      to={`/post/${post.id}`}
      className={`group block rounded-xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {/* Color accent stripe */}
      <div className="h-1.5 w-full" style={{ backgroundColor: color }} />

      <div className="p-5">
        {/* Category + type badges */}
        <div className="flex items-center gap-2 mb-3">
          {post.category && (
            <Badge
              className="text-white text-[10px] px-2 py-0.5"
              style={{ backgroundColor: color }}
            >
              {post.category.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] px-2 py-0.5 gap-1">
            {contentTypeIcon[post.content_type]}
            {contentTypeLabel[post.content_type]}
          </Badge>
          {post.is_featured && (
            <Badge className="text-[10px] px-2 py-0.5 bg-amber-400 text-amber-900 border-0">
              ✨ Featured
            </Badge>
          )}
        </div>

        {/* Title */}
        <h3 className="font-serif text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
            {post.excerpt}
          </p>
        )}
        {!post.excerpt && post.content && (
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4 italic">
            {post.content.slice(0, 140)}…
          </p>
        )}

        {/* Footer: author + stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <span className="font-medium">
            {post.author?.display_name ?? "Anonymous"}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {post.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {post.like_count}
            </span>
            <span>
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
