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
  CheckCircle2,
  Play,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
    role: "Software Engineer @ Google",
    rating: 5
  },
  {
    quote: "The best platform for interview prep. Clean UI, great problems, and the leaderboard keeps me motivated.",
    author: "Marcus Johnson",
    role: "Senior Developer @ Stripe",
    rating: 5
  },
  {
    quote: "I went from struggling with arrays to solving hard DP problems in 3 months. Incredible platform!",
    author: "Priya Sharma",
    role: "Full Stack Developer",
    rating: 5
  }
];

const codeLines = [
  { text: "def ", highlight: "primary" },
  { text: "twoSum", highlight: "easy" },
  { text: "(nums, target):", highlight: "none" },
];

function AnimatedCounter({ value, label, delay }: { value: string; label: string; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={cn(
        "text-center transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      )}
    >
      <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function FloatingElement({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <div 
      className={cn("animate-float", className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

export default function Landing() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Master algorithms. Ace interviews.";
  const currentYear = new Date().getFullYear();
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Enhanced floating background elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px] animate-pulse-glow" />
        <div className="absolute top-1/2 -right-32 w-[400px] h-[400px] bg-easy/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] bg-medium/15 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: "3s" }} />
        <div className="absolute top-10 right-1/4 w-[250px] h-[250px] bg-hard/10 rounded-full blur-[80px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
        
        {/* Rotating gradient ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
          <div className="w-full h-full rounded-full border border-primary/30 animate-rotate-slow" />
        </div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "80px 80px"
          }}
        />

        {/* Floating code symbols */}
        <FloatingElement className="absolute top-20 left-[10%] text-4xl text-primary/20 font-mono" delay={0}>
          {"{ }"}
        </FloatingElement>
        <FloatingElement className="absolute top-40 right-[15%] text-3xl text-easy/20 font-mono" delay={1}>
          {"< />"}
        </FloatingElement>
        <FloatingElement className="absolute bottom-32 left-[20%] text-4xl text-medium/20 font-mono" delay={2}>
          {"( )"}
        </FloatingElement>
        <FloatingElement className="absolute bottom-48 right-[25%] text-3xl text-hard/20 font-mono" delay={1.5}>
          {"[ ]"}
        </FloatingElement>
      </div>

      {/* Header with glass effect */}
      <header className="relative z-10 border-b border-border/30 bg-background/60 backdrop-blur-2xl sticky top-0">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl group-hover:bg-primary/50 transition-all duration-500" />
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-primary via-primary to-primary/80 shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all duration-300">
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
                "px-5 py-2.5 rounded-xl text-sm font-medium",
                "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground",
                "hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5",
                "transition-all duration-300"
              )}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 container pt-24 pb-36">
        <div className="max-w-5xl mx-auto text-center">
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-secondary via-secondary to-secondary/80 border border-border/50 mb-8 opacity-0 animate-fade-in shadow-lg" style={{ animationDelay: "0.1s" }}>
            <div className="relative">
              <Sparkles className="h-4 w-4 text-primary animate-bounce-subtle" />
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Now with AI-powered learning
            </span>
            <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold">New</span>
          </div>

          {/* Main heading with staggered animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            <span className="opacity-0 animate-fade-in-up inline-block" style={{ animationDelay: "0.2s" }}>
              Master{" "}
            </span>
            <span className="text-gradient opacity-0 animate-fade-in-up inline-block" style={{ animationDelay: "0.3s" }}>
              Coding
            </span>
            <br />
            <span className="text-muted-foreground opacity-0 animate-fade-in-up inline-block" style={{ animationDelay: "0.4s" }}>
              One Problem at a Time
            </span>
          </h1>

          {/* Typing animation subtitle */}
          <div className="h-8 mb-10 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <p className="text-lg md:text-xl text-primary font-mono">
              {typedText}
              <span className="animate-blink ml-0.5">|</span>
            </p>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 opacity-0 animate-fade-in" style={{ animationDelay: "0.5s" }}>
            Level up your algorithmic thinking with curated problems, real-time code execution, 
            and AI-powered hints. Join thousands of developers preparing for their dream jobs.
          </p>

          {/* CTA Buttons with enhanced hover effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <Link
              to="/auth"
              className={cn(
                "group flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold",
                "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground",
                "hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1",
                "transition-all duration-300 relative overflow-hidden"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <Play className="h-5 w-5 fill-current" />
              Start Coding Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/auth"
              className={cn(
                "group flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold",
                "bg-secondary/80 border-2 border-border/50",
                "hover:border-primary/50 hover:bg-secondary hover:-translate-y-1",
                "transition-all duration-300 backdrop-blur-sm"
              )}
            >
              <Users className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Hero visual - Enhanced Code editor mockup */}
        <div className="mt-24 max-w-5xl mx-auto opacity-0 animate-scale-in" style={{ animationDelay: "0.8s" }}>
          <div className="relative group">
            {/* Enhanced glow effects */}
            <div className="absolute -inset-6 bg-gradient-to-r from-primary/30 via-easy/30 to-medium/30 blur-3xl rounded-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-easy to-medium rounded-2xl opacity-20 blur-sm" />
            
            <div className="relative rounded-2xl border border-border/50 bg-card/90 backdrop-blur-xl overflow-hidden shadow-2xl">
              {/* Browser header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-secondary/30">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-medium/80 hover:bg-medium transition-colors cursor-pointer" />
                  <div className="w-3 h-3 rounded-full bg-easy/80 hover:bg-easy transition-colors cursor-pointer" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1.5 rounded-lg bg-background/60 text-xs text-muted-foreground border border-border/30">
                    🔒 pacaltower.com/problem/two-sum
                  </div>
                </div>
              </div>

              {/* Editor content */}
              <div className="grid md:grid-cols-2 divide-x divide-border/50">
                {/* Problem description */}
                <div className="p-6 space-y-4 bg-gradient-to-br from-background/50 to-transparent">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-easy/20 text-easy border border-easy/20">Easy</span>
                    <span className="text-sm text-muted-foreground">Arrays • Hash Table</span>
                  </div>
                  <h3 className="text-xl font-bold">Two Sum</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Given an array of integers <code className="px-2 py-1 rounded-lg bg-secondary/80 text-xs font-mono border border-border/30">nums</code> and 
                    an integer <code className="px-2 py-1 rounded-lg bg-secondary/80 text-xs font-mono border border-border/30">target</code>, 
                    return indices of the two numbers such that they add up to target.
                  </p>
                  <div className="pt-4 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-easy" />
                      <span>42.5k Accepted</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 text-primary" />
                      <span>85.2k Submissions</span>
                    </div>
                  </div>
                </div>

                {/* Code editor with syntax highlighting */}
                <div className="p-4 bg-gradient-to-br from-background to-secondary/20">
                  <div className="font-mono text-sm space-y-1.5">
                    <div className="flex">
                      <span className="text-primary font-medium">def</span>
                      <span className="text-easy ml-1 font-medium">twoSum</span>
                      <span className="text-muted-foreground">(nums, target):</span>
                    </div>
                    <div className="pl-4 text-muted-foreground/60 italic"># Your solution here</div>
                    <div className="pl-4">
                      <span className="text-primary">seen</span>
                      <span className="text-muted-foreground"> = </span>
                      <span className="text-medium">{"{}"}</span>
                    </div>
                    <div className="pl-4">
                      <span className="text-primary font-medium">for</span>
                      <span className="text-foreground"> i, num </span>
                      <span className="text-primary font-medium">in</span>
                      <span className="text-foreground"> enumerate(nums):</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-foreground">complement = target - num</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-primary font-medium">if</span>
                      <span className="text-foreground"> complement </span>
                      <span className="text-primary font-medium">in</span>
                      <span className="text-foreground"> seen:</span>
                    </div>
                    <div className="pl-12">
                      <span className="text-primary font-medium">return</span>
                      <span className="text-foreground"> [seen[complement], i]</span>
                    </div>
                    <div className="pl-8">
                      <span className="text-foreground">seen[num] = i</span>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <div className="h-5 w-0.5 bg-primary animate-blink rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom status with animation */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-border/50 bg-gradient-to-r from-easy/10 via-transparent to-transparent">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 text-sm text-easy font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    All tests passed
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="px-2 py-1 rounded-md bg-secondary/50 text-muted-foreground">Runtime: 52ms</span>
                  <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">Beats 94.2%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with staggered counters */}
      <section className="relative z-10 border-y border-border/50 bg-gradient-to-r from-secondary/50 via-secondary/30 to-secondary/50 backdrop-blur-sm">
        <div className="container py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <AnimatedCounter
                key={stat.label}
                value={stat.value}
                label={stat.label}
                delay={200 + index * 150}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section with enhanced cards */}
      <section className="relative z-10 container py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 opacity-0 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Everything you need to <span className="text-gradient">succeed</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg opacity-0 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            A complete platform designed to take your coding skills from beginner to interview-ready.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={cn(
                "group p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm",
                "hover:border-primary/50 hover:bg-card/80 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10",
                "transition-all duration-500",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials with enhanced styling */}
      <section className="relative z-10 container py-28">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Loved by <span className="text-gradient">developers</span>
          </h2>
          <p className="text-muted-foreground text-lg">Join thousands who transformed their coding careers</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.author}
              className={cn(
                "group p-8 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm",
                "hover:border-primary/30 hover:bg-card/80 hover:-translate-y-1",
                "transition-all duration-300",
                "opacity-0 animate-fade-in-up"
              )}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Star rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary via-easy to-medium flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section with enhanced effects */}
      <section className="relative z-10 container py-28">
        <div className="relative rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden">
          {/* Animated background effects */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-easy/20 animate-gradient-x" style={{ backgroundSize: "200% 200%" }} />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/30 blur-[100px] rounded-full animate-pulse-glow" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-easy/30 blur-[100px] rounded-full animate-pulse-glow" style={{ animationDelay: "2s" }} />

          <div className="relative px-8 py-20 md:px-16 md:py-24 text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-bounce-subtle">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Start your journey today</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Ready to <span className="text-gradient">level up</span>?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-10 text-lg">
              Join PacalTower for free and start solving problems that will prepare you for any technical interview.
            </p>

            <Link
              to="/auth"
              className={cn(
                "group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-xl font-semibold",
                "bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground",
                "hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1",
                "transition-all duration-300 relative overflow-hidden"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              Get Started — It's Free
              <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 bg-secondary/20">
        <div className="container py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-lg shadow-primary/20">
                <Code2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-gradient">PacalTower</span>
            </div>
            <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground md:flex-row md:gap-4">
              <Link to="https://www.pascaltower.com/privacy" className="hover:text-foreground hover:underline">
                Privacy Policy
              </Link>
              <span>© {currentYear} PacalTower. Built for developers, by developers.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
