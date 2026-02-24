import { useEffect, useState } from "react";
import { Category } from "../../types";
import { fetchCategories } from "../../lib/postsService";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Music, Mic, Star } from "lucide-react";
import { Link } from "react-router-dom";

const typeIcon = {
  album: <Music className="w-4 h-4" />,
  tour: <Mic className="w-4 h-4" />,
  special: <Star className="w-4 h-4" />,
};

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  const albums = categories.filter((c) => c.type === "album");
  const tours = categories.filter((c) => c.type === "tour");
  const special = categories.filter((c) => c.type === "special");

  const renderGroup = (title: string, items: Category[]) => (
    <div className="mb-8">
      <h2 className="font-bold text-gray-700 text-lg mb-3">{title}</h2>
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Colour</TableHead>
              <TableHead>View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7}>
                  <Skeleton className="h-8 w-full" />
                </TableCell>
              </TableRow>
            ) : (
              items.map((c) => (
                <TableRow key={c.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                        style={{ backgroundColor: c.color }}
                      >
                        {typeIcon[c.type]}
                      </div>
                      {c.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-gray-400 font-mono">
                    {c.slug}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {c.year_info ?? "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {c.post_count}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs capitalize">
                      {c.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-5 h-5 rounded-full border border-gray-200"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-xs text-gray-400 font-mono">
                        {c.color}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/category/${c.slug}`}
                      target="_blank"
                      className="text-xs text-primary hover:underline"
                    >
                      View →
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
        <p className="text-gray-500 mt-1">
          {categories.length} categories — Albums, Tours, and Special
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Categories are seeded from the database schema. Add new ones via
          Supabase or the SQL schema.
        </p>
      </div>

      {renderGroup(`💿 Albums (${albums.length})`, albums)}
      {renderGroup(`🎪 Tours (${tours.length})`, tours)}
      {renderGroup(`⭐ Special (${special.length})`, special)}
    </div>
  );
}
