import { useState } from "react";
import { Header } from "@/components/Header";
import { ProblemCard, type Problem } from "@/components/ProblemCard";
import { StatsCard } from "@/components/StatsCard";
import { DifficultyBadge, type Difficulty } from "@/components/DifficultyBadge";
import { cn } from "@/lib/utils";
import { 
  Target, 
  Flame, 
  CheckCircle2, 
  Clock, 
  Search,
  Filter,
  ChevronDown
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

      <main className="container py-8">
        {/* Hero Section */}
        <div className="relative mb-8 p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-easy/10 blur-3xl rounded-full" />
          
          <div className="relative">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome back, <span className="text-gradient">Developer</span>
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Continue your coding journey. You've solved {solvedCount} problems so far. Keep pushing!
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        <div className="mb-6 space-y-4">
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
                  "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm",
                  "bg-secondary border border-border",
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
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium",
                "bg-secondary border border-border hover:bg-accent transition-colors",
                showFilters && "bg-accent border-primary/30"
              )}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={cn("h-4 w-4 transition-transform", showFilters && "rotate-180")} />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="p-4 rounded-lg border border-border bg-card animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Difficulty Filter */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Difficulty
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {difficulties.map((diff) => (
                      <button
                        key={diff}
                        onClick={() => setSelectedDifficulty(diff)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-sm transition-colors",
                          selectedDifficulty === diff
                            ? "bg-primary text-primary-foreground"
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
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-md text-sm",
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
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Status
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <button
                        key={status}
                        onClick={() => setSelectedStatus(status)}
                        className={cn(
                          "px-3 py-1.5 rounded-md text-sm transition-colors",
                          selectedStatus === status
                            ? "bg-primary text-primary-foreground"
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
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Problem Set
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                ({filteredProblems.length} problems)
              </span>
            </h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
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
            filteredProblems.map((problem, index) => (
              <ProblemCard key={problem.id} problem={problem} index={index} />
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No problems found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
