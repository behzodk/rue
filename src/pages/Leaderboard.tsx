import { useState } from "react";
import { Header } from "@/components/Header";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/LeaderboardTable";
import { StatsCard } from "@/components/StatsCard";
import { cn } from "@/lib/utils";
import { Trophy, Users, Target, Flame, TrendingUp } from "lucide-react";

const leaderboardData: LeaderboardEntry[] = [
  { rank: 1, username: "algorithm_master", score: 15420, solved: 842, streak: 45, change: 2 },
  { rank: 2, username: "code_ninja", score: 14890, solved: 798, streak: 32, change: -1 },
  { rank: 3, username: "byte_wizard", score: 14350, solved: 756, streak: 28, change: 1 },
  { rank: 4, username: "data_crusher", score: 13920, solved: 721, streak: 21, change: 0 },
  { rank: 5, username: "logic_lord", score: 13450, solved: 698, streak: 19, change: 3 },
  { rank: 6, username: "syntax_samurai", score: 12980, solved: 672, streak: 15, change: -2 },
  { rank: 7, username: "recursive_rex", score: 12540, solved: 645, streak: 12, change: 1 },
  { rank: 8, username: "hash_hero", score: 12100, solved: 618, streak: 10, change: 0 },
  { rank: 9, username: "pointer_pro", score: 11680, solved: 591, streak: 8, change: -1 },
  { rank: 10, username: "stack_star", score: 11250, solved: 564, streak: 7, change: 2 },
  { rank: 11, username: "queue_queen", score: 10820, solved: 537, streak: 6, change: 0 },
  { rank: 12, username: "tree_titan", score: 10390, solved: 510, streak: 5, change: 1 },
  { rank: 13, username: "graph_guru", score: 9960, solved: 483, streak: 4, change: -1 },
  { rank: 14, username: "dp_dynamo", score: 9530, solved: 456, streak: 3, change: 0 },
  { rank: 15, username: "sort_sage", score: 9100, solved: 429, streak: 2, change: 1 },
];

const timeFilters = ["All Time", "This Month", "This Week", "Today"];

export default function Leaderboard() {
  const [selectedTime, setSelectedTime] = useState("All Time");
  const currentUser = "developer_dan";
  const currentUserRank = 47;
  const currentUserStats = { score: 5420, solved: 234, streak: 7 };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero */}
        <div className="relative mb-8 p-6 rounded-2xl border border-border bg-gradient-to-br from-card to-background overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-3xl rounded-full" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 blur-3xl rounded-full" />
          
          <div className="relative flex items-center gap-4">
            <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Global <span className="text-gradient">Leaderboard</span>
              </h1>
              <p className="text-muted-foreground">
                Compete with developers worldwide and climb the ranks
              </p>
            </div>
          </div>
        </div>

        {/* Your Stats */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Your Standing
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Your Rank"
              value={`#${currentUserRank}`}
              subtitle="Global ranking"
              icon={Trophy}
              trend={{ value: 5, isPositive: true }}
            />
            <StatsCard
              title="Total Score"
              value={currentUserStats.score.toLocaleString()}
              subtitle="points"
              icon={Target}
            />
            <StatsCard
              title="Problems Solved"
              value={currentUserStats.solved}
              subtitle="problems"
              icon={TrendingUp}
              trend={{ value: 12, isPositive: true }}
            />
            <StatsCard
              title="Current Streak"
              value={currentUserStats.streak}
              subtitle="days"
              icon={Flame}
            />
          </div>
        </div>

        {/* Time Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedTime(filter)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                selectedTime === filter
                  ? "bg-primary text-primary-foreground glow-primary"
                  : "bg-secondary hover:bg-accent border border-border"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Leaderboard Table */}
        <LeaderboardTable 
          entries={leaderboardData} 
          highlightUser={currentUser}
        />

        {/* Load More */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2.5 rounded-lg text-sm font-medium bg-secondary border border-border hover:bg-accent transition-colors">
            Load More
          </button>
        </div>
      </main>
    </div>
  );
}
