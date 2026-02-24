import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, X, Star, User, LogOut, Settings, PenLine } from "lucide-react";

export default function Navbar() {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const tierBadge: Record<string, string> = {
    free: "",
    monthly: "⭐",
    annual: "🌟",
    lifetime: "✨",
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const navLinks = [
    { to: "/browse", label: "Browse" },
    { to: "/category/eras-tour", label: "Eras Tour" },
    { to: "/category/late-show-story", label: "The Colbert Story" },
    { to: "/pricing", label: "Join" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-rose-200/30 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🎤</span>
          <div>
            <span className="font-serif text-xl font-bold text-primary group-hover:text-primary/80 transition-colors leading-none block">
              Stories for a Showgirl
            </span>
            <span className="text-[10px] text-muted-foreground tracking-widest uppercase leading-none">
              A Swiftie Fan Portal
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {profile ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => navigate("/submit")}
              >
                <PenLine className="w-4 h-4 mr-1" />
                Submit
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-1">
                    <User className="w-4 h-4" />
                    <span className="max-w-[80px] truncate">
                      {profile.display_name}
                    </span>
                    {tierBadge[profile.membership_tier] && (
                      <span>{tierBadge[profile.membership_tier]}</span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="w-4 h-4 mr-2" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/pricing")}>
                    <Star className="w-4 h-4 mr-2" /> Upgrade
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        <Settings className="w-4 h-4 mr-2" /> Admin
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className="bg-primary text-white hover:bg-primary/90"
                onClick={() => navigate("/register")}
              >
                Join Free
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <div className="flex flex-col gap-4 mt-8">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="font-serif text-lg font-bold text-primary"
              >
                🎤 Stories for a Showgirl
              </Link>
              {navLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-base text-foreground/80 hover:text-primary transition-colors py-1"
                >
                  {l.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-2">
                {profile ? (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/submit");
                        setMobileOpen(false);
                      }}
                    >
                      <PenLine className="w-4 h-4 mr-2" /> Submit Content
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate("/profile");
                        setMobileOpen(false);
                      }}
                    >
                      Profile
                    </Button>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          navigate("/admin");
                          setMobileOpen(false);
                        }}
                      >
                        Admin
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full text-destructive"
                      onClick={handleSignOut}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate("/register");
                        setMobileOpen(false);
                      }}
                    >
                      Join Free
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate("/login");
                        setMobileOpen(false);
                      }}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
