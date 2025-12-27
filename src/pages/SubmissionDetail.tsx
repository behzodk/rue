import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { DistributionChart } from "@/components/DistributionChart";
import { CodeEditor } from "@/components/CodeEditor";
import { cn } from "@/lib/utils";
import { ArrowLeft, CheckCircle2, Zap, Database, Clock, Code2 } from "lucide-react";

// Sample distribution data
const runtimeDistribution = [5, 12, 45, 120, 280, 450, 380, 220, 95, 35, 15, 8];
const memoryDistribution = [3, 8, 25, 85, 180, 320, 410, 280, 140, 55, 20, 12];

const submittedCode = `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`;

export default function SubmissionDetail() {
  const { id, submissionId } = useParams();

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
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-easy" />
              <h1 className="text-2xl font-bold text-easy">Accepted</h1>
              <DifficultyBadge difficulty="Easy" />
            </div>
            <p className="text-muted-foreground mt-1">
              #{id} - Two Sum • Submitted 2 hours ago
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">Runtime</span>
            </div>
            <div className="text-2xl font-bold">52 ms</div>
            <div className="text-sm text-easy">Beats 95.47%</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Database className="h-4 w-4" />
              <span className="text-sm">Memory</span>
            </div>
            <div className="text-2xl font-bold">42.1 MB</div>
            <div className="text-sm text-easy">Beats 65.23%</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Code2 className="h-4 w-4" />
              <span className="text-sm">Language</span>
            </div>
            <div className="text-2xl font-bold">JavaScript</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Time Complexity</span>
            </div>
            <div className="text-2xl font-bold">O(n)</div>
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

        {/* Submitted Code */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-card border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Submitted Code</h2>
            <span className="text-sm text-muted-foreground">JavaScript</span>
          </div>
          <CodeEditor
            value={submittedCode}
            onChange={() => {}}
            language="javascript"
            className="min-h-[400px]"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Link
            to={`/problem/${id}`}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Try Again
          </Link>
          <Link
            to={`/problem/${id}/leaderboard`}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-secondary border border-border hover:bg-accent transition-colors"
          >
            View Leaderboard
          </Link>
        </div>
      </main>
    </div>
  );
}
