import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Code2, LayoutDashboard, Trophy, User, Zap, LogOut, Menu, X, PlayCircle, LogIn, Plus } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", label: "Problems", icon: LayoutDashboard },
    { href: "/tutorials", label: "Tutorials", icon: PlayCircle },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors" />
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">PacalTower</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  location.pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <Link to="/problem/create">
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2 border border-primary/30 bg-gradient-to-r from-primary/15 to-sky-500/15 text-foreground hover:border-primary/50 hover:from-primary/25 hover:to-sky-500/25"
                >
                  <Plus className="h-4 w-4" />
                  Create a problem
                </Button>
              </Link>
            )}
            <ThemeToggle />
            
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
                  <Zap className="h-4 w-4 text-medium" />
                  <span className="text-sm font-medium">1,247</span>
                  <span className="text-xs text-muted-foreground">pts</span>
                </div>
                
                <Link to="/profile" className="relative p-2 rounded-full bg-secondary border border-border hover:bg-accent transition-colors">
                  <User className="h-5 w-5" />
                  <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-easy border-2 border-background" />
                </Link>

                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-secondary border border-border hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="default" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && (
              <Link to="/problem/create">
                <Button
                  variant="secondary"
                  size="icon"
                  className="border border-primary/30 bg-gradient-to-r from-primary/15 to-sky-500/15 text-foreground hover:border-primary/50 hover:from-primary/25 hover:to-sky-500/25"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[60] bg-background/60 backdrop-blur-md transition-opacity md:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-72 bg-background/95 backdrop-blur-xl border-l border-border shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <span className="text-lg font-bold text-gradient">Menu</span>
          <button
            onClick={closeMobileMenu}
            className="p-2 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Section - Only show when authenticated */}
        {isAuthenticated ? (
          <div className="p-4 border-b border-border">
            <Link 
              to="/profile" 
              onClick={closeMobileMenu}
              className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border hover:bg-accent transition-colors"
            >
              <div className="relative p-2 rounded-full bg-primary/10 border border-primary/20">
                <User className="h-5 w-5 text-primary" />
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-easy border-2 border-background" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">View Profile</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap className="h-3 w-3 text-medium" />
                  <span className="text-xs text-muted-foreground">1,247 pts</span>
                </div>
              </div>
            </Link>
          </div>
        ) : (
          <div className="p-4 border-b border-border">
            <Link 
              to="/auth" 
              onClick={closeMobileMenu}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              <LogIn className="h-5 w-5" />
              Sign In / Sign Up
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Navigation</p>
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={closeMobileMenu}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent border border-transparent"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions - Only show logout when authenticated */}
        {isAuthenticated && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-background/80 backdrop-blur-sm">
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
