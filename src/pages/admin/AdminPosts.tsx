import { useEffect, useState } from "react";
import { Post } from "../../types";
import {
  fetchAllPostsAdmin,
  updatePostStatus,
  deletePost,
} from "../../lib/postsService";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog";
import { Search, Star, Trash2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "../../components/ui/use-toast";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchAllPostsAdmin()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(
    (p) =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.author?.display_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleApprove = async (id: string, approved: boolean) => {
    await updatePostStatus(id, { is_approved: approved });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_approved: approved } : p)),
    );
    toast({ title: approved ? "Post approved" : "Post rejected" });
  };

  const handleFeature = async (id: string, featured: boolean) => {
    await updatePostStatus(id, { is_featured: featured });
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_featured: featured } : p)),
    );
    toast({ title: featured ? "Post featured ✨" : "Post unfeatured" });
  };

  const handleDelete = async (id: string) => {
    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
    toast({ title: "Post deleted", variant: "destructive" });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
          <p className="text-gray-500 mt-1">Manage all submitted fan content</p>
        </div>
        <Badge className="text-sm px-3 py-1 bg-gray-100 text-gray-700 border-0">
          {posts.length} total
        </Badge>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by title or author…"
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
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-gray-400 py-12"
                  >
                    No posts found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((p) => (
                  <TableRow key={p.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium max-w-[180px]">
                      <Link
                        to={`/post/${p.id}`}
                        target="_blank"
                        className="hover:text-primary hover:underline truncate block"
                      >
                        {p.title}
                      </Link>
                    </TableCell>
                    <TableCell className="text-gray-600 text-sm">
                      {p.author?.display_name ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {p.content_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {p.category?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-xs text-gray-400">
                      {format(new Date(p.created_at), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {p.is_approved ? (
                          <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                            Approved
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">
                            Pending
                          </Badge>
                        )}
                        {p.is_featured && (
                          <Badge className="bg-amber-400 text-amber-900 border-0 text-xs">
                            ✨
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Approve / Reject */}
                        {p.is_approved ? (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-amber-500 hover:text-amber-700"
                            title="Reject"
                            onClick={() => handleApprove(p.id, false)}
                          >
                            <XCircle className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="w-7 h-7 text-green-600 hover:text-green-800"
                            title="Approve"
                            onClick={() => handleApprove(p.id, true)}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}

                        {/* Feature / Unfeature */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`w-7 h-7 ${
                            p.is_featured
                              ? "text-amber-400 hover:text-gray-400"
                              : "text-gray-300 hover:text-amber-400"
                          }`}
                          title={p.is_featured ? "Unfeature" : "Feature"}
                          onClick={() => handleFeature(p.id, !p.is_featured)}
                        >
                          <Star
                            className="w-4 h-4"
                            fill={p.is_featured ? "currentColor" : "none"}
                          />
                        </Button>

                        {/* Delete */}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="w-7 h-7 text-gray-300 hover:text-red-500"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{p.title}"?
                                This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700"
                                onClick={() => handleDelete(p.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
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
