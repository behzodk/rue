import { useState } from "react";
import { Header } from "@/components/Header";
import { ProblemCard, type Problem } from "@/components/ProblemCard";
import { StatsCard } from "@/components/StatsCard";
import { DifficultyBadge, type Difficulty } from "@/components/DifficultyBadge";
import { LearningPathwaysSidebar } from "@/components/LearningPathwaysSidebar";
import { DashboardCalendar } from "@/components/DashboardCalendar";
import { cn } from "@/lib/utils";
import { 
  Target, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Zap,
  ArrowRight
} from "lucide-react";

// Sample problem data
const sampleProblems: Problem[] = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", acceptance: 49.2, status: "solved" },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", acceptance: 40.1, status: "solved" },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "String", acceptance: 33.8, status: "attempted" },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Binary Search", acceptance: 36.1, status: "unsolved" },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Dynamic Programming", acceptance: 32.4, status: "unsolved" },
  { id: 6, title: "Zigzag Conversion", difficulty: "Medium", category: "String", acceptance: 44.5, status: "unsolved" },
  { id: 7, title: "Reverse Integer", difficulty: "Medium", category: "Math", acceptance: 27.5, status: "solved" },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", category: "String", acceptance: 16.6, status: "unsolved" },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", category: "Math", acceptance: 53.5, status: "solved" },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", category: "Dynamic Programming", acceptance: 28.2, status: "unsolved" },
  { id: 11, title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers", acceptance: 54.3, status: "attempted" },
  { id: 12, title: "Integer to Roman", difficulty: "Medium", category: "Math", acceptance: 61.2, status: "unsolved" },
];

const categories = ["All", "Arrays", "String", "Linked List", "Dynamic Programming", "Binary Search", "Math", "Two Pointers"];
const difficulties: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const statuses = ["All", "Solved", "Attempted", "Unsolved"];

export default function Dashboard() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProblems = sampleProblems.filter((problem) => {
    const matchesSearch = problem.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || problem.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "All" || problem.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === "All" || problem.status === selectedStatus.toLowerCase();
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const solvedCount = sampleProblems.filter((p) => p.status === "solved").length;
  const attemptedCount = sampleProblems.filter((p) => p.status === "attempted").length;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Three Column Layout */}
        <div className="flex gap-6">
          {/* Left Sidebar - Learning Pathways */}
          <LearningPathwaysSidebar />

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Welcome Banner */}
            <div className="relative mb-6 p-6 rounded-2xl border border-border bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
              {/* Background Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-easy/10 blur-3xl rounded-full" />
              <div className="absolute top-10 right-20 w-32 h-32 bg-medium/10 blur-2xl rounded-full" />
              
              {/* Grid Pattern */}
              <div className="absolute inset-0 opacity-5">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
              
              <div className="relative flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    <span className="text-xs font-medium text-primary uppercase tracking-wider">Daily Progress</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    Welcome back, <span className="text-gradient">Developer</span>
                  </h1>
                  <p className="text-muted-foreground max-w-lg">
                    You've solved {solvedCount} problems. Keep pushing to reach your daily goal!
                  </p>
                </div>

                {/* Quick Action */}
                <div className="hidden lg:flex items-center gap-3">
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Random Problem</p>
                        <p className="text-xs text-muted-foreground">Feeling lucky?</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              <StatsCard
                title="Problems Solved"
                value={solvedCount}
                subtitle={`of ${sampleProblems.length} total`}
                icon={CheckCircle2}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Current Streak"
                value="7"
                subtitle="days"
                icon={Flame}
                iconClassName="bg-medium/20"
              />
              <StatsCard
                title="Accuracy"
                value="78%"
                subtitle="submissions"
                icon={Target}
              />
              <StatsCard
                title="Time Spent"
                value="24h"
                subtitle="this week"
                icon={Clock}
                trend={{ value: 8, isPositive: true }}
              />
            </div>

            {/* Filters Section */}
            <div className="mb-5 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search problems..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2.5 rounded-xl text-sm",
                      "bg-card border border-border",
                      "placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50",
                      "transition-all"
                    )}
                  />
                </div>

                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
                    "bg-card border border-border hover:bg-accent transition-all",
                    showFilters && "bg-primary/10 border-primary/30 text-primary"
                  )}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="p-4 rounded-xl border border-border bg-card animate-fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {/* Difficulty Filter */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                        Difficulty
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {difficulties.map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setSelectedDifficulty(diff)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                              selectedDifficulty === diff
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-secondary hover:bg-accent"
                            )}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                        Category
                      </label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg text-sm",
                          "bg-secondary border border-border",
                          "focus:outline-none focus:ring-2 focus:ring-primary/50"
                        )}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wider">
                        Status
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {statuses.map((status) => (
                          <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                              selectedStatus === status
                                ? "bg-primary text-primary-foreground shadow-md"
                                : "bg-secondary hover:bg-accent"
                            )}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Problem List */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Problem Set
                  <span className="text-xs font-normal text-muted-foreground">
                    ({filteredProblems.length})
                  </span>
                </h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <DifficultyBadge difficulty="Easy" />
                    <span>{sampleProblems.filter(p => p.difficulty === "Easy").length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DifficultyBadge difficulty="Medium" />
                    <span>{sampleProblems.filter(p => p.difficulty === "Medium").length}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DifficultyBadge difficulty="Hard" />
                    <span>{sampleProblems.filter(p => p.difficulty === "Hard").length}</span>
                  </div>
                </div>
              </div>

              {filteredProblems.length > 0 ? (
                <div className="space-y-2">
                  {filteredProblems.map((problem, index) => (
                    <ProblemCard key={problem.id} problem={problem} index={index} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center rounded-xl border border-dashed border-border bg-card/50">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground">No problems found matching your criteria.</p>
                  <button 
                    onClick={() => {
                      setSearch("");
                      setSelectedCategory("All");
                      setSelectedDifficulty("All");
                      setSelectedStatus("All");
                    }}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Calendar */}
          <DashboardCalendar />
        </div>
      </main>
    </div>
  );
}
