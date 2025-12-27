import { cn } from "@/lib/utils";
import { DifficultyBadge, type Difficulty } from "./DifficultyBadge";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export interface Problem {
  id: number;
  title: string;
  difficulty: Difficulty;
  category: string;
  acceptance: number;
  status: "solved" | "attempted" | "unsolved";
}

interface ProblemCardProps {
  problem: Problem;
  index: number;
}

export function ProblemCard({ problem, index }: ProblemCardProps) {
  const statusIcon = {
    solved: <CheckCircle2 className="h-4 w-4 text-easy" />,
    attempted: <Clock className="h-4 w-4 text-medium" />,
    unsolved: <Circle className="h-4 w-4 text-muted-foreground" />,
  };

  return (
    <Link
      to={`/problem/${problem.id}`}
      className={cn(
        "group relative block p-4 rounded-lg border border-border bg-card",
        "hover:border-primary/40 hover:bg-accent/50 transition-all duration-300",
        "animate-slide-up"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {statusIcon[problem.status]}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-mono">
                #{problem.id}
              </span>
              <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                {problem.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">{problem.category}</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground">{problem.acceptance}% acceptance</span>
            </div>
          </div>
        </div>
        
        <DifficultyBadge difficulty={problem.difficulty} />
      </div>
    </Link>
  );
}
