import { useEffect, useState } from "react";
import { Post, Category } from "../types";
import { fetchRecentPosts, fetchCategories } from "../lib/postsService";
import PostCard from "../components/PostCard";
import CategoryCard from "../components/CategoryCard";
import { Skeleton } from "../components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";

export default function BrowsePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "poem" | "story" | "video">("all");

  useEffect(() => {
    Promise.all([fetchRecentPosts(50), fetchCategories()])
      .then(([p, c]) => {
        setPosts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.display_name?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filter === "all" || p.content_type === filter;
    return matchesSearch && matchesType;
  });

  const albums = categories.filter((c) => c.type === "album");
  const tours = categories.filter((c) => c.type === "tour");
  const special = categories.filter((c) => c.type === "special");

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-4xl font-bold text-foreground mb-2">
          Browse Fan Content
        </h1>
        <p className="text-muted-foreground">
          Original poems, stories, and videos from the Swiftie community
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="mb-8">
          <TabsTrigger value="posts">All Content</TabsTrigger>
          <TabsTrigger value="albums">Albums</TabsTrigger>
          <TabsTrigger value="tours">Tours</TabsTrigger>
          <TabsTrigger value="special">Special</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          {/* Search + filter bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by title or author…"
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["all", "poem", "story", "video"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                    filter === t
                      ? "bg-primary text-white border-primary"
                      : "bg-card border-border text-foreground/70 hover:border-primary hover:text-primary"
                  }`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-5xl mb-4">🎵</div>
              <p className="text-lg">No content found matching your search.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="albums">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? [...Array(8)].map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))
              : albums.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="tours">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))
              : tours.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        </TabsContent>

        <TabsContent value="special">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading
              ? [...Array(1)].map((_, i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))
              : special.map((c) => <CategoryCard key={c.id} category={c} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
