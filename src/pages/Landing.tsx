import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Code2, 
  ArrowRight, 
  Sparkles, 
  Trophy, 
  Users, 
  Zap,
  Brain,
  Layers,
  Terminal,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Brain,
    title: "Learn with AI",
    description: "Get personalized hints and explanations powered by AI to accelerate your learning journey."
  },
  {
    icon: Layers,
    title: "500+ Problems",
    description: "From easy warm-ups to mind-bending challenges across all major DSA topics."
  },
  {
    icon: Terminal,
    title: "Multi-Language",
    description: "Code in Python, JavaScript, TypeScript, Java, C++, Go, Rust and more."
  },
  {
    icon: Trophy,
    title: "Compete & Rank",
    description: "Climb the global leaderboard and compete with developers worldwide."
  }
];

const stats = [
  { value: "50K+", label: "Active Users" },
  { value: "500+", label: "Problems" },
  { value: "1M+", label: "Submissions" },
  { value: "99%", label: "Uptime" }
];

const testimonials = [
  {
    quote: "PacalTower helped me land my dream job at a FAANG company. The AI hints are a game-changer!",
    author: "Sarah Chen",
    role: "Software Engineer @ Google"
  },
  {
    quote: "The best platform for interview prep. Clean UI, great problems, and the leaderboard keeps me motivated.",
    author: "Marcus Johnson",
    role: "Senior Developer @ Stripe"
  },
  {
    quote: "I went from struggling with arrays to solving hard DP problems in 3 months. Incredible platform!",
    author: "Priya Sharma",
    role: "Full Stack Developer"
  }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-easy/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-medium/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border/50 bg-background/50 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl group-hover:bg-primary/30 transition-colors" />
              <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">PacalTower</span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-colors",
                "glow-primary"
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Now with AI-powered learning</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Master <span className="text-gradient">Coding</span>
            <br />
            <span className="text-muted-foreground">One Problem at a Time</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Level up your algorithmic thinking with curated problems, real-time code execution, 
            and AI-powered hints. Join thousands of developers preparing for their dream jobs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/auth"
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-all hover:scale-105",
                "glow-primary"
              )}
            >
              Start Coding Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/auth"
              className={cn(
                "flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold",
                "bg-secondary border border-border",
                "hover:bg-accent transition-all"
              )}
            >
              <Users className="h-5 w-5" />
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Hero visual - Code editor mockup */}
        <div className="mt-20 max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-easy/20 to-medium/20 blur-3xl rounded-3xl" />
            
            <div className="relative rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/60" />
                  <div className="w-3 h-3 rounded-full bg-medium/60" />
                  <div className="w-3 h-3 rounded-full bg-easy/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 rounded-md bg-background/50 text-xs text-muted-foreground">
                    pacaltower.dev/problem/two-sum
                  </div>
                </div>
              </div>

              {/* Editor content */}
              <div className="grid md:grid-cols-2 divide-x divide-border">
                {/* Problem description */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-easy/20 text-easy">Easy</span>
                    <span className="text-sm text-muted-foreground">Arrays • Hash Table</span>
                  </div>
                  <h3 className="text-xl font-bold">Two Sum</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Given an array of integers <code className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">nums</code> and 
                    an integer <code className="px-1.5 py-0.5 rounded bg-secondary text-xs font-mono">target</code>, 
                    return indices of the two numbers such that they add up to target.
                  </p>
                </div>

                {/* Code editor */}
                <div className="p-4 bg-background/50">
                  <div className="font-mono text-sm space-y-1">
                    <div><span className="text-primary">def</span> <span className="text-easy">twoSum</span>(nums, target):</div>
                    <div className="pl-4 text-muted-foreground"># Your solution here</div>
                    <div className="pl-4"><span className="text-primary">seen</span> = {"{}"}</div>
                    <div className="pl-4"><span className="text-primary">for</span> i, num <span className="text-primary">in</span> enumerate(nums):</div>
                    <div className="pl-8">complement = target - num</div>
                    <div className="pl-8"><span className="text-primary">if</span> complement <span className="text-primary">in</span> seen:</div>
                    <div className="pl-12"><span className="text-primary">return</span> [seen[complement], i]</div>
                    <div className="pl-8">seen[num] = i</div>
                    <div className="flex items-center gap-2 mt-4">
                      <div className="h-5 w-0.5 bg-primary animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom status */}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-secondary/30">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs text-easy">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    All tests passed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Runtime: 52ms</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Beats 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-border bg-secondary/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to <span className="text-gradient">succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A complete platform designed to take your coding skills from beginner to interview-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group p-6 rounded-2xl border border-border bg-card",
                "hover:border-primary/50 hover:glow-primary transition-all duration-300",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 container py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Loved by <span className="text-gradient">developers</span>
          </h2>
          <p className="text-muted-foreground">Join thousands who transformed their coding careers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "p-6 rounded-2xl border border-border bg-card",
                "animate-fade-in"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-easy flex items-center justify-center text-primary-foreground font-bold">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container py-24">
        <div className="relative rounded-3xl border border-border bg-card overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-easy/10" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-easy/20 blur-3xl rounded-full" />

          <div className="relative px-8 py-16 md:px-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Start your journey today</span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-gradient">level up</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Join PacalTower for free and start solving problems that will prepare you for any technical interview.
            </p>

            <Link
              to="/auth"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold",
                "bg-primary text-primary-foreground",
                "hover:bg-primary/90 transition-all hover:scale-105",
                "glow-primary"
              )}
            >
              Get Started — It's Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-primary/80">
                <Code2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-gradient">PacalTower</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 PacalTower. Built for developers, by developers.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
