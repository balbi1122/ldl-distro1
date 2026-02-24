import { Link } from "react-router-dom";
import { Category } from "../types";
import { Music, Mic, Star } from "lucide-react";

const typeIcon = {
  album: <Music className="w-5 h-5" />,
  tour: <Mic className="w-5 h-5" />,
  special: <Star className="w-5 h-5" />,
};

const typeLabel = {
  album: "Album",
  tour: "Tour",
  special: "Special",
};

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      to={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 block"
    >
      {/* Background colour gradient */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
        style={{
          background: `linear-gradient(135deg, ${category.color}, transparent)`,
        }}
      />

      <div className="relative p-5">
        {/* Icon + type */}
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm"
            style={{ backgroundColor: category.color }}
          >
            {typeIcon[category.type]}
          </div>
          <span
            className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
            style={{
              color: category.color,
              borderColor: `${category.color}50`,
              backgroundColor: `${category.color}15`,
            }}
          >
            {typeLabel[category.type]}
          </span>
        </div>

        <h3 className="font-serif font-bold text-base text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
          {category.name}
        </h3>
        {category.year_info && (
          <p
            className="text-[11px] font-semibold mb-2"
            style={{ color: category.color }}
          >
            {category.year_info}
          </p>
        )}
        {category.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {category.description}
          </p>
        )}

        <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            {category.post_count} piece{category.post_count !== 1 ? "s" : ""}
          </span>
          <span
            className="text-xs font-medium group-hover:underline"
            style={{ color: category.color }}
          >
            Explore →
          </span>
        </div>
      </div>
    </Link>
  );
}
