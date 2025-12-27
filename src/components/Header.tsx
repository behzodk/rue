import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Code2, LayoutDashboard, Trophy, User, Zap } from "lucide-react";

export function Header() {
  const location = useLocation();

  const navItems = [
    { href: "/", label: "Problems", icon: LayoutDashboard },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ];

  return (
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

        {/* Navigation */}
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

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary border border-border">
            <Zap className="h-4 w-4 text-medium" />
            <span className="text-sm font-medium">1,247</span>
            <span className="text-xs text-muted-foreground">pts</span>
          </div>
          
          <button className="relative p-2 rounded-full bg-secondary border border-border hover:bg-accent transition-colors">
            <User className="h-5 w-5" />
            <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-easy border-2 border-background" />
          </button>
        </div>
      </div>
    </header>
  );
}
