import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { 
  Code2, 
  Github
} from "lucide-react";

export default function Auth() {
  const currentYear = new Date().getFullYear();
  const { signInWithGithub } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await signInWithGithub();
    } catch (authError) {
      setIsSubmitting(false);
      setError(authError instanceof Error ? authError.message : "GitHub sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-easy/20" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-easy/20 rounded-full blur-3xl" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />

        {/* Content */}
        <div className="relative flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors" />
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">PacalTower</span>
          </Link>

          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Unlock your
              <br />
              <span className="text-gradient">coding potential</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md">
              Join thousands of developers mastering algorithms and data structures with our AI-powered platform.
            </p>
            
            {/* Feature highlights */}
            <div className="space-y-3 pt-4">
              {[
                "500+ curated problems",
                "AI-powered hints & explanations",
                "Real-time code execution",
                "Global leaderboards"
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            © {currentYear} PacalTower. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Code2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-gradient">PacalTower</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="hidden lg:flex justify-end p-4">
          <ThemeToggle />
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md space-y-8">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Sign in with GitHub
              </h2>
              <p className="text-muted-foreground">
                GitHub authentication is the only enabled sign-in method right now.
              </p>
            </div>

            {/* GitHub sign-in */}
            <div className="space-y-3">
              <button
                onClick={handleGithubLogin}
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl",
                  "bg-secondary border border-border",
                  "hover:bg-accent transition-colors font-medium",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                <Github className="h-5 w-5" />
                {isSubmitting ? "Redirecting to GitHub..." : "Continue with GitHub"}
              </button>
            </div>
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
