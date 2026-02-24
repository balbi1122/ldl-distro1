import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Button } from "../../components/ui/button";

const links = [
  { to: "/admin", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" />, end: true },
  { to: "/admin/posts", label: "Posts", icon: <FileText className="w-4 h-4" /> },
  { to: "/admin/users", label: "Users", icon: <Users className="w-4 h-4" /> },
  { to: "/admin/categories", label: "Categories", icon: <Tags className="w-4 h-4" /> },
];

export default function AdminLayout() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-900 text-gray-100 flex flex-col">
        <div className="px-5 py-5 border-b border-gray-700">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <p className="font-serif font-bold text-primary text-lg leading-tight">
            🎤 Showgirl Portal
          </p>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              {l.icon}
              {l.label}
              <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-300 hover:text-white hover:bg-gray-800 justify-start"
            onClick={() => navigate("/")}
          >
            ← View Portal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-400 hover:text-red-400 hover:bg-gray-800 justify-start"
            onClick={async () => {
              await signOut();
              navigate("/");
            }}
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
