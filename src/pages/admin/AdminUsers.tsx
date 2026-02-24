import { useEffect, useState } from "react";
import { Profile, MembershipTier } from "../../types";
import { fetchAllUsersAdmin, updateUserTier } from "../../lib/postsService";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Search } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { format } from "date-fns";

const tierColors: Record<MembershipTier, string> = {
  free: "bg-gray-100 text-gray-600",
  monthly: "bg-rose-100 text-rose-700",
  annual: "bg-purple-100 text-purple-700",
  lifetime: "bg-amber-100 text-amber-700",
};

export default function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllUsersAdmin()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(
    (u) =>
      !search ||
      u.display_name.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.membership_tier.includes(search.toLowerCase()),
  );

  const handleTierChange = async (userId: string, tier: string) => {
    await updateUserTier(userId, tier);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, membership_tier: tier as MembershipTier } : u,
      ),
    );
    toast({ title: `Membership updated to ${tier}` });
  };

  const memberStats = {
    total: users.length,
    free: users.filter((u) => u.membership_tier === "free").length,
    monthly: users.filter((u) => u.membership_tier === "monthly").length,
    annual: users.filter((u) => u.membership_tier === "annual").length,
    lifetime: users.filter((u) => u.membership_tier === "lifetime").length,
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Users</h1>
        <p className="text-gray-500 mt-1">Manage portal members</p>
      </div>

      {/* Membership breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Total", value: memberStats.total, color: "#607d8b" },
          { label: "Free", value: memberStats.free, color: "#9e9e9e" },
          { label: "Monthly", value: memberStats.monthly, color: "#c9386a" },
          { label: "Annual", value: memberStats.annual, color: "#9b59b6" },
          { label: "Lifetime", value: memberStats.lifetime, color: "#d4af37" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border p-4 text-center shadow-sm"
          >
            <p
              className="text-2xl font-bold"
              style={{ color: s.color }}
            >
              {loading ? "—" : s.value}
            </p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search users…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <Skeleton className="h-64 rounded-xl" />
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>User</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Membership</TableHead>
                <TableHead className="text-right">Change Tier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-gray-400 py-12"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((u) => (
                  <TableRow key={u.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                          style={{ backgroundColor: "#c9386a" }}
                        >
                          {u.display_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            {u.display_name}
                          </p>
                          {u.is_admin && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                              Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      @{u.username}
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {u.post_count}
                    </TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {format(new Date(u.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-xs border-0 ${tierColors[u.membership_tier]}`}
                      >
                        {u.membership_tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={u.membership_tier}
                        onValueChange={(v) => handleTierChange(u.id, v)}
                      >
                        <SelectTrigger className="w-36 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="lifetime">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
