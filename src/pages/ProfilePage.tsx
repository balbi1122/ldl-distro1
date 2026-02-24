import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Post } from "../types";
import { fetchUserPosts } from "../lib/postsService";
import PostCard from "../components/PostCard";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { PenLine, Settings, Star } from "lucide-react";
import { format } from "date-fns";

const tierInfo: Record<
  string,
  { label: string; badge: string; color: string }
> = {
  free: { label: "Swiftie (Free)", badge: "🎵", color: "#78909c" },
  monthly: { label: "Gold Star (Monthly)", badge: "⭐", color: "#c9386a" },
  annual: { label: "All Too Well (Annual)", badge: "🌟", color: "#9b59b6" },
  lifetime: { label: "Long Live (Lifetime)", badge: "✨", color: "#d4af37" },
};

export default function ProfilePage() {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    fetchUserPosts(profile.id)
      .then(setPosts)
      .finally(() => setLoading(false));
  }, [profile]);

  if (!profile) return null;

  const tier = tierInfo[profile.membership_tier] ?? tierInfo.free;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Profile header */}
      <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-2xl border p-8 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-3xl text-white font-bold shadow-lg shrink-0"
            style={{ backgroundColor: tier.color }}
          >
            {profile.display_name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-serif text-2xl font-bold text-foreground">
                {profile.display_name}
              </h1>
              <span className="text-xl" title={tier.label}>
                {tier.badge}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              @{profile.username}
            </p>
            {profile.bio && (
              <p className="text-sm text-foreground/80 mt-2">{profile.bio}</p>
            )}
            <div className="flex flex-wrap gap-3 mt-3">
              <Badge
                className="text-white text-xs"
                style={{ backgroundColor: tier.color }}
              >
                {tier.label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                Member since{" "}
                {format(new Date(profile.created_at), "MMMM yyyy")}
              </span>
              <span className="text-xs text-muted-foreground">
                {profile.post_count} post{profile.post_count !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Button
              size="sm"
              className="bg-primary text-white hover:bg-primary/90"
              onClick={() => navigate("/submit")}
            >
              <PenLine className="w-4 h-4 mr-1" /> Submit Content
            </Button>
            {profile.membership_tier === "free" && (
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate("/pricing")}
              >
                <Star className="w-4 h-4 mr-1" /> Upgrade
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Membership info */}
      {profile.membership_tier !== "free" && profile.subscription_end_date && (
        <div className="mb-6 p-4 bg-card border rounded-xl text-sm flex items-center justify-between">
          <span className="text-muted-foreground">
            Subscription renews:{" "}
            <strong className="text-foreground">
              {format(new Date(profile.subscription_end_date), "MMMM d, yyyy")}
            </strong>
          </span>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-1" /> Manage Subscription
          </Button>
        </div>
      )}

      {/* User's posts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-2xl font-bold text-foreground">
            My Content
          </h2>
          <span className="text-sm text-muted-foreground">
            {posts.length} piece{posts.length !== 1 ? "s" : ""}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-48 rounded-xl" />
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-xl bg-card">
            <div className="text-4xl mb-3">✍️</div>
            <p className="text-muted-foreground mb-4">
              You haven't posted anything yet.
            </p>
            <Button
              className="bg-primary text-white"
              onClick={() => navigate("/submit")}
            >
              Share Your First Story
            </Button>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="mt-10 pt-6 border-t text-center">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-destructive"
          onClick={async () => {
            await signOut();
            navigate("/");
          }}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
}
