import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { LeaderboardTable, type LeaderboardEntry } from "@/components/LeaderboardTable";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { DistributionChart } from "@/components/DistributionChart";
import { cn } from "@/lib/utils";
import { ArrowLeft, Trophy, Clock, Database, Zap } from "lucide-react";

const problemLeaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "speed_demon", score: 100, solved: 0, streak: 0, runtime: "0 ms", memory: "38.2 MB" },
  { rank: 2, username: "quick_coder", score: 99, solved: 0, streak: 0, runtime: "1 ms", memory: "38.4 MB" },
  { rank: 3, username: "fast_finger", score: 98, solved: 0, streak: 0, runtime: "2 ms", memory: "38.1 MB" },
  { rank: 4, username: "algorithm_ace", score: 97, solved: 0, streak: 0, runtime: "3 ms", memory: "38.5 MB" },
  { rank: 5, username: "code_flash", score: 96, solved: 0, streak: 0, runtime: "4 ms", memory: "38.3 MB" },
  { rank: 6, username: "swift_solver", score: 95, solved: 0, streak: 0, runtime: "5 ms", memory: "38.6 MB" },
  { rank: 7, username: "ninja_noder", score: 94, solved: 0, streak: 0, runtime: "6 ms", memory: "38.4 MB" },
  { rank: 8, username: "turbo_typer", score: 93, solved: 0, streak: 0, runtime: "7 ms", memory: "38.7 MB" },
  { rank: 9, username: "rapid_runtime", score: 92, solved: 0, streak: 0, runtime: "8 ms", memory: "38.5 MB" },
  { rank: 10, username: "blitz_binary", score: 91, solved: 0, streak: 0, runtime: "9 ms", memory: "38.8 MB" },
];

// Sample distribution data
const runtimeDistribution = [5, 12, 45, 120, 280, 450, 380, 220, 95, 35, 15, 8];
const memoryDistribution = [3, 8, 25, 85, 180, 320, 410, 280, 140, 55, 20, 12];

export default function ProblemLeaderboard() {
  const { id } = useParams();
  
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Back + Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link 
            to={`/problem/${id}`}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h1 className="text-2xl font-bold">Problem Leaderboard</h1>
              <DifficultyBadge difficulty="Easy" />
            </div>
            <p className="text-muted-foreground mt-1">
              #{id} - Two Sum • Top solutions by runtime and memory
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4" />
              <span className="text-sm">Fastest Runtime</span>
            </div>
            <div className="text-2xl font-bold text-easy">0 ms</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Database className="h-4 w-4" />
              <span className="text-sm">Best Memory</span>
            </div>
            <div className="text-2xl font-bold text-primary">38.1 MB</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Avg Runtime</span>
            </div>
            <div className="text-2xl font-bold">52 ms</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Total Solutions</span>
            </div>
            <div className="text-2xl font-bold">12.4M</div>
          </div>
        </div>

        {/* Distribution Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <DistributionChart
            userValue={52}
            distribution={runtimeDistribution}
            label="Runtime Distribution"
            unit="ms"
          />
          <DistributionChart
            userValue={42}
            distribution={memoryDistribution}
            label="Memory Distribution"
            unit="MB"
          />
        </div>

        {/* Leaderboard */}
        <h2 className="text-lg font-semibold mb-4">Top Solutions</h2>
        <LeaderboardTable 
          entries={problemLeaderboard} 
          showProblemStats
        />
      </main>
    </div>
  );
}
