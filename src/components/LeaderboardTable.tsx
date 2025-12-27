import { cn } from "@/lib/utils";
import { Trophy, Medal, Award, TrendingUp, TrendingDown, Minus } from "lucide-react";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  score: number;
  solved: number;
  streak: number;
  change?: number;
  runtime?: string;
  memory?: string;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  showProblemStats?: boolean;
  highlightUser?: string;
}

export function LeaderboardTable({ entries, showProblemStats, highlightUser }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-muted-foreground font-mono">{rank}</span>;
    }
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-easy" />;
    return <TrendingDown className="h-4 w-4 text-hard" />;
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground w-16">Rank</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">User</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-24">Score</th>
            {showProblemStats ? (
              <>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-24">Runtime</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-24">Memory</th>
              </>
            ) : (
              <>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-24">Solved</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-24">Streak</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground w-20">Change</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, index) => (
            <tr
              key={entry.rank}
              className={cn(
                "border-b border-border last:border-0 transition-colors",
                highlightUser === entry.username && "bg-primary/10",
                "hover:bg-muted/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <td className="py-4 px-4">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(entry.rank)}
                </div>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-semibold">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={cn(
                      "font-medium",
                      entry.rank <= 3 && "text-primary"
                    )}>
                      {entry.username}
                    </div>
                    {entry.rank === 1 && (
                      <div className="text-xs text-yellow-500">Champion</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <span className="font-bold text-lg">{entry.score.toLocaleString()}</span>
              </td>
              {showProblemStats ? (
                <>
                  <td className="py-4 px-4 text-center">
                    <span className="text-easy font-mono">{entry.runtime}</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="text-muted-foreground font-mono">{entry.memory}</span>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded-full bg-easy/10 text-easy text-sm font-medium">
                      {entry.solved}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="px-2 py-1 rounded-full bg-medium/10 text-medium text-sm font-medium">
                      🔥 {entry.streak}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-1">
                      {getChangeIcon(entry.change)}
                      {entry.change !== 0 && (
                        <span className={cn(
                          "text-sm",
                          entry.change && entry.change > 0 ? "text-easy" : "text-hard"
                        )}>
                          {Math.abs(entry.change || 0)}
                        </span>
                      )}
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
