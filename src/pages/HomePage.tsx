import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Post, Category } from "../types";
import {
  fetchFeaturedPosts,
  fetchCategories,
  fetchRecentPosts,
} from "../lib/postsService";
import PostCard from "../components/PostCard";
import CategoryCard from "../components/CategoryCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { PenLine, BookOpen, Music, Star } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<Post[]>([]);
  const [recent, setRecent] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchFeaturedPosts(4), fetchRecentPosts(6), fetchCategories()])
      .then(([f, r, c]) => {
        setFeatured(f);
        setRecent(r);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const albumCategories = categories.filter((c) => c.type === "album").slice(0, 6);
  const specialCategory = categories.find((c) => c.type === "special");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-background to-purple-50 py-20 px-4">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-purple-400/5 blur-3xl" />
        </div>
        <div className="container mx-auto text-center relative">
          <Badge className="mb-5 bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1">
            ✨ A Swiftie Fan Creative Community
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Stories for a{" "}
            <span className="text-primary italic">Showgirl</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Share your original poems, stories, and videos inspired by Taylor
            Swift's music, eras, and the spirit of her storytelling. Fan
            creativity lives here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary text-white hover:bg-primary/90 shadow-lg px-8"
              onClick={() => navigate("/browse")}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Explore Fan Content
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white px-8"
              onClick={() => navigate("/submit")}
            >
              <PenLine className="w-5 h-5 mr-2" />
              Share Your Story
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-10 mt-14">
            {[
              { icon: <BookOpen className="w-5 h-5" />, label: "Fan Stories", value: "100+" },
              { icon: <Music className="w-5 h-5" />, label: "Era Categories", value: "19" },
              { icon: <Star className="w-5 h-5" />, label: "Swiftie Members", value: "Growing" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 text-primary">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured content */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold text-foreground">
              ✨ Featured
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Editor-selected standout pieces
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/browse")}>
            View All
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featured.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <EmptyState message="No featured content yet — be the first to post!" />
        )}
      </section>

      {/* Special: The Late Show Story */}
      {specialCategory && (
        <section className="bg-gradient-to-r from-purple-900 to-indigo-900 py-14 px-4">
          <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
            <div className="text-center md:text-left flex-1">
              <Badge className="bg-white/10 text-white border-white/20 mb-4">
                ⭐ Special Category
              </Badge>
              <h2 className="font-serif text-3xl font-bold text-white mb-3">
                The Late Show Story
              </h2>
              <p className="text-purple-200 mb-6 leading-relaxed max-w-lg">
                Taylor Swift once described a story concept on The Late Show with
                Stephen Colbert. Share your vision of how that tale could unfold —
                original, fan-imagined, and inspired by her storytelling genius.
              </p>
              <Button
                className="bg-white text-purple-900 hover:bg-purple-50"
                onClick={() => navigate("/category/late-show-story")}
              >
                Explore the Colbert Story →
              </Button>
            </div>
            <div className="text-6xl md:text-8xl">🎭</div>
          </div>
        </section>
      )}

      {/* Browse by Era */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold text-foreground mb-1">
            🎵 Browse by Era
          </h2>
          <p className="text-muted-foreground text-sm">
            Every album has its own world — explore them all
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-44 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {albumCategories.map((c) => (
              <CategoryCard key={c.id} category={c} />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/browse">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              View All Categories (Albums, Tours & More)
            </Button>
          </Link>
        </div>
      </section>

      {/* Recent posts */}
      <section className="bg-rose-50/50 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-3xl font-bold text-foreground">
              🕐 Recently Added
            </h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/browse")}>
              See More
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
              ))}
            </div>
          ) : recent.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recent.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          ) : (
            <EmptyState message="No posts yet — yours could be first!" />
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-gradient-to-br from-rose-600 to-primary py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="font-serif text-4xl font-bold text-white mb-4">
            Ready to Share Your Story?
          </h2>
          <p className="text-rose-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of Swifties. Free members can post one piece.
            Upgrade for unlimited posts and exclusive perks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-rose-50 shadow-lg px-10"
              onClick={() => navigate("/register")}
            >
              Join Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-10"
              onClick={() => navigate("/pricing")}
            >
              View Plans from $6/mo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <div className="text-4xl mb-3">🎵</div>
      <p>{message}</p>
    </div>
  );
}
