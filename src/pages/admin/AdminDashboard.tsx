import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post, Profile, Category } from "../../types";
import {
  fetchAllPostsAdmin,
  fetchAllUsersAdmin,
  fetchCategories,
} from "../../lib/postsService";
import { Skeleton } from "../../components/ui/skeleton";
import { Button } from "../../components/ui/button";
import {
  FileText,
  Users,
  Tags,
  Eye,
  TrendingUp,
  Star,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAllPostsAdmin(),
      fetchAllUsersAdmin(),
      fetchCategories(),
    ])
      .then(([p, u, c]) => {
        setPosts(p);
        setUsers(u);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const pendingPosts = posts.filter((p) => !p.is_approved);
  const totalViews = posts.reduce((acc, p) => acc + p.view_count, 0);
  const paidUsers = users.filter((u) => u.membership_tier !== "free");
  const featuredPosts = posts.filter((p) => p.is_featured);

  const stats = [
    {
      label: "Total Posts",
      value: posts.length,
      icon: <FileText className="w-5 h-5" />,
      color: "#c9386a",
      action: () => navigate("/admin/posts"),
    },
    {
      label: "Total Members",
      value: users.length,
      icon: <Users className="w-5 h-5" />,
      color: "#9b59b6",
      action: () => navigate("/admin/users"),
    },
    {
      label: "Paid Members",
      value: paidUsers.length,
      icon: <Star className="w-5 h-5" />,
      color: "#d4af37",
      action: () => navigate("/admin/users"),
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: "#2196f3",
      action: null,
    },
    {
      label: "Categories",
      value: categories.length,
      icon: <Tags className="w-5 h-5" />,
      color: "#4caf50",
      action: () => navigate("/admin/categories"),
    },
    {
      label: "Featured Posts",
      value: featuredPosts.length,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "#ff9800",
      action: () => navigate("/admin/posts"),
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">Portal overview and quick actions</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {loading
          ? [...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))
          : stats.map((s) => (
              <div
                key={s.label}
                className={`bg-white rounded-xl border p-5 shadow-sm ${
                  s.action ? "cursor-pointer hover:shadow-md transition-shadow" : ""
                }`}
                onClick={s.action ?? undefined}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white mb-3"
                  style={{ backgroundColor: s.color }}
                >
                  {s.icon}
                </div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending posts */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">
              {pendingPosts.length > 0
                ? `⚠️ Pending Approval (${pendingPosts.length})`
                : "✅ All Posts Approved"}
            </h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/posts")}
            >
              Manage
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-24" />
          ) : pendingPosts.length > 0 ? (
            <ul className="divide-y text-sm">
              {pendingPosts.slice(0, 5).map((p) => (
                <li key={p.id} className="py-2.5 flex justify-between">
                  <span className="text-gray-700 font-medium truncate max-w-[60%]">
                    {p.title}
                  </span>
                  <span className="text-gray-400 text-xs shrink-0 ml-2">
                    {formatDistanceToNow(new Date(p.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm">
              All submitted content has been reviewed.
            </p>
          )}
        </div>

        {/* Recent users */}
        <div className="bg-white rounded-xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">Recent Members</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/users")}
            >
              View All
            </Button>
          </div>
          {loading ? (
            <Skeleton className="h-24" />
          ) : (
            <ul className="divide-y text-sm">
              {users.slice(0, 5).map((u) => (
                <li key={u.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-gray-700 font-medium">
                      {u.display_name}
                    </span>
                    <span className="text-gray-400 ml-2">@{u.username}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      u.membership_tier === "free"
                        ? "bg-gray-100 text-gray-600"
                        : u.membership_tier === "lifetime"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {u.membership_tier}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
