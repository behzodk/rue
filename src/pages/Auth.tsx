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
  const { signInWithGithub, signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeProvider, setActiveProvider] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGithubLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    setActiveProvider("github");
    try {
      await signInWithGithub();
    } catch (authError) {
      setIsSubmitting(false);
      setActiveProvider(null);
      setError(authError instanceof Error ? authError.message : "GitHub sign-in failed.");
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsSubmitting(true);
    setActiveProvider("google");
    try {
      await signInWithGoogle();
    } catch (authError) {
      setIsSubmitting(false);
      setActiveProvider(null);
      setError(authError instanceof Error ? authError.message : "Google sign-in failed.");
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
                Sign in to PacalTower
              </h2>
              <p className="text-muted-foreground">
                Continue with your preferred provider.
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
                {isSubmitting && activeProvider === "github"
                  ? "Redirecting to GitHub..."
                  : "Continue with GitHub"}
              </button>
              <button
                onClick={handleGoogleLogin}
                disabled={isSubmitting}
                className={cn(
                  "w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl",
                  "bg-secondary border border-border",
                  "hover:bg-accent transition-colors font-medium",
                  isSubmitting && "opacity-70 cursor-not-allowed"
                )}
              >
                <svg viewBox="0 0 533.5 544.3" className="h-5 w-5">
                  <path
                    fill="#4285f4"
                    d="M533.5 278.4c0-17.4-1.6-34.2-4.7-50.5H272v95.6h147.1c-6.3 33.6-25 62.1-53.5 81.1v67.5h86.5c50.6-46.6 81.4-115.2 81.4-193.7z"
                  />
                  <path
                    fill="#34a853"
                    d="M272 544.3c72.6 0 133.5-24 178-65.1l-86.5-67.5c-24.1 16.2-55 25.8-91.5 25.8-70.3 0-129.8-47.4-151.1-111.1H33.4v69.9c44.3 88.1 135.8 148.9 238.6 148.9z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M120.9 326.4c-10.5-31.6-10.5-65.8 0-97.4V159.1H33.4c-36.4 72.8-36.4 159.5 0 232.3l87.5-69.9z"
                  />
                  <path
                    fill="#ea4335"
                    d="M272 107.7c39.5-.6 77.5 13.9 106.3 40.7l79.1-79.1C413.3 24.7 343.4-1.5 272 0 169.2 0 77.7 60.8 33.4 148.9l87.5 69.9C142.2 155.1 201.7 107.7 272 107.7z"
                  />
                </svg>
                {isSubmitting && activeProvider === "google"
                  ? "Redirecting to Google..."
                  : "Continue with Google"}
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
