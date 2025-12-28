import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  BookOpen, 
  Trophy, 
  Zap, 
  Brain, 
  Code2, 
  Layers,
  ChevronRight,
  Lock,
  CheckCircle2,
  Star,
  TrendingUp
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Pathway {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  progress: number;
  totalProblems: number;
  completedProblems: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  isLocked?: boolean;
  color: string;
}

const pathways: Pathway[] = [
  {
    id: "arrays-101",
    title: "Arrays Mastery",
    description: "Master array manipulation techniques",
    icon: Layers,
    progress: 75,
    totalProblems: 12,
    completedProblems: 9,
    difficulty: "Beginner",
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: "two-pointers",
    title: "Two Pointers",
    description: "Learn the two pointer technique",
    icon: Zap,
    progress: 40,
    totalProblems: 8,
    completedProblems: 3,
    difficulty: "Beginner",
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "dp-intro",
    title: "Dynamic Programming",
    description: "Introduction to DP concepts",
    icon: Brain,
    progress: 20,
    totalProblems: 15,
    completedProblems: 3,
    difficulty: "Intermediate",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "trees-graphs",
    title: "Trees & Graphs",
    description: "Traverse and manipulate trees",
    icon: Code2,
    progress: 0,
    totalProblems: 18,
    completedProblems: 0,
    difficulty: "Intermediate",
    color: "from-orange-500 to-red-500"
  },
  {
    id: "system-design",
    title: "System Design",
    description: "Design scalable systems",
    icon: Trophy,
    progress: 0,
    totalProblems: 10,
    completedProblems: 0,
    difficulty: "Advanced",
    isLocked: true,
    color: "from-amber-500 to-yellow-500"
  },
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case "Beginner":
      return "text-easy bg-easy/10";
    case "Intermediate":
      return "text-medium bg-medium/10";
    case "Advanced":
      return "text-hard bg-hard/10";
    default:
      return "text-muted-foreground bg-muted";
  }
};

export function LearningPathwaysSidebar() {
  const [selectedPathway, setSelectedPathway] = useState<string | null>("arrays-101");

  return (
    <aside className="w-80 flex-shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* Header */}
        <div className="p-4 rounded-xl border border-border bg-card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Learning Paths</h3>
              <p className="text-xs text-muted-foreground">Curated problem sets</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">3</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Active Paths</p>
            </div>
            <div className="p-3 rounded-lg bg-gradient-to-br from-easy/10 to-easy/5 border border-easy/10">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-easy" />
                <span className="text-sm font-medium">15</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Completed</p>
            </div>
          </div>
        </div>

        {/* Pathways List */}
        <div className="space-y-2">
          {pathways.map((pathway) => (
            <button
              key={pathway.id}
              onClick={() => !pathway.isLocked && setSelectedPathway(pathway.id)}
              className={cn(
                "w-full p-4 rounded-xl border text-left transition-all duration-300",
                "hover:shadow-lg hover:-translate-y-0.5",
                pathway.isLocked 
                  ? "opacity-60 cursor-not-allowed bg-muted/50 border-border" 
                  : selectedPathway === pathway.id
                    ? "border-primary/50 bg-card shadow-md"
                    : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={cn(
                  "p-2.5 rounded-lg bg-gradient-to-br",
                  pathway.color,
                  pathway.isLocked && "opacity-50"
                )}>
                  {pathway.isLocked ? (
                    <Lock className="h-4 w-4 text-white" />
                  ) : (
                    <pathway.icon className="h-4 w-4 text-white" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm truncate">{pathway.title}</h4>
                    {pathway.progress === 100 && (
                      <CheckCircle2 className="h-4 w-4 text-easy flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {pathway.description}
                  </p>

                  {/* Progress */}
                  {!pathway.isLocked && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getDifficultyColor(pathway.difficulty))}>
                          {pathway.difficulty}
                        </span>
                        <span className="text-muted-foreground">
                          {pathway.completedProblems}/{pathway.totalProblems}
                        </span>
                      </div>
                      <Progress value={pathway.progress} className="h-1.5" />
                    </div>
                  )}

                  {pathway.isLocked && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Complete 2 more paths to unlock
                    </p>
                  )}
                </div>

                {/* Arrow */}
                {!pathway.isLocked && (
                  <ChevronRight className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform flex-shrink-0 mt-1",
                    selectedPathway === pathway.id && "text-primary translate-x-0.5"
                  )} />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="p-4 rounded-xl border border-dashed border-primary/30 bg-primary/5">
          <p className="text-sm font-medium text-center mb-2">Want more paths?</p>
          <p className="text-xs text-muted-foreground text-center mb-3">
            Create custom learning paths tailored to your goals
          </p>
          <button className="w-full py-2 px-4 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Create Custom Path
          </button>
        </div>
      </div>
    </aside>
  );
}
