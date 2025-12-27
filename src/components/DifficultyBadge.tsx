import { cn } from "@/lib/utils";

export type Difficulty = "Easy" | "Medium" | "Hard";

interface DifficultyBadgeProps {
  difficulty: Difficulty;
  className?: string;
}

const difficultyStyles: Record<Difficulty, string> = {
  Easy: "bg-easy/15 text-easy border-easy/30 glow-easy",
  Medium: "bg-medium/15 text-medium border-medium/30 glow-medium",
  Hard: "bg-hard/15 text-hard border-hard/30 glow-hard",
};

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border transition-all",
        difficultyStyles[difficulty],
        className
      )}
    >
      {difficulty}
    </span>
  );
}
