import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Post, Category } from "../types";
import {
  fetchCategoryBySlug,
  fetchPostsByCategory,
} from "../lib/postsService";
import PostCard from "../components/PostCard";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowLeft, Music, Mic, Star } from "lucide-react";

const typeIcon = {
  album: <Music className="w-5 h-5" />,
  tour: <Mic className="w-5 h-5" />,
  special: <Star className="w-5 h-5" />,
};

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCategoryBySlug(slug)
      .then((cat) => {
        setCategory(cat);
        if (cat) return fetchPostsByCategory(cat.id);
        return [];
      })
      .then((p) => setPosts(p))
      .finally(() => setLoading(false));
  }, [slug]);

  if (!loading && !category) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">🎵</div>
        <h2 className="font-serif text-2xl font-bold mb-2">Category Not Found</h2>
        <p className="text-muted-foreground mb-6">
          This era hasn't been catalogued yet.
        </p>
        <Button onClick={() => navigate("/browse")}>Browse All Content</Button>
      </div>
    );
  }

  return (
    <div>
      {/* Category hero */}
      <div
        className="relative py-16 px-4 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${category?.color ?? "#c9386a"}22, ${category?.color ?? "#c9386a"}08)`,
          borderBottom: `2px solid ${category?.color ?? "#c9386a"}30`,
        }}
      >
        <div className="container mx-auto">
          <button
            onClick={() => navigate("/browse")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Browse
          </button>

          {loading ? (
            <Skeleton className="h-12 w-64 mb-3" />
          ) : (
            <>
              <div className="flex items-center gap-3 mb-3">
                {category && (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: category.color }}
                  >
                    {typeIcon[category.type]}
                  </div>
                )}
                <div>
                  <Badge
                    className="text-white text-xs mb-1"
                    style={{ backgroundColor: category?.color }}
                  >
                    {category?.type === "album"
                      ? "Album"
                      : category?.type === "tour"
                      ? "Tour"
                      : "Special"}
                    {category?.year_info ? ` · ${category.year_info}` : ""}
                  </Badge>
                  <h1 className="font-serif text-4xl font-bold text-foreground">
                    {category?.name}
                  </h1>
                </div>
              </div>
              {category?.description && (
                <p className="text-muted-foreground max-w-2xl leading-relaxed">
                  {category.description}
                </p>
              )}
              <p
                className="mt-3 text-sm font-semibold"
                style={{ color: category?.color }}
              >
                {posts.length} fan piece{posts.length !== 1 ? "s" : ""}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Posts grid */}
      <div className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">✍️</div>
            <h3 className="font-serif text-xl font-bold mb-2">
              No content yet for this era
            </h3>
            <p className="text-muted-foreground mb-6">
              Be the first to share a poem, story, or video inspired by{" "}
              <strong>{category?.name}</strong>!
            </p>
            <Button
              className="bg-primary text-white"
              onClick={() => navigate("/submit")}
            >
              Submit Your Content
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
