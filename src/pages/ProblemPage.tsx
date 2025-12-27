import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TestCasePanel, type TestCase } from "@/components/TestCasePanel";
import { DifficultyBadge, type Difficulty } from "@/components/DifficultyBadge";
import { SubmissionCard, type Submission } from "@/components/SubmissionCard";
import { LearnWithAI } from "@/components/LearnWithAI";
import { cn } from "@/lib/utils";
import { 
  ArrowLeft, 
  Play, 
  Send, 
  RotateCcw, 
  BookOpen, 
  MessageSquare,
  ChevronDown,
  Clock,
  CheckCircle2,
  Lightbulb,
  Terminal,
  Bot,
  Trophy
} from "lucide-react";

// Sample problem data
const problemData = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy" as Difficulty,
  category: "Arrays",
  description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: "Because nums[1] + nums[2] == 6, we return [1, 2]."
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: null
    }
  ],
  constraints: [
    "2 <= nums.length <= 10⁴",
    "-10⁹ <= nums[i] <= 10⁹",
    "-10⁹ <= target <= 10⁹",
    "Only one valid answer exists."
  ],
  hints: [
    "A brute force approach would be to check every pair of numbers.",
    "Can you think of a way to use a hash map to speed this up?",
    "What if you store each number's index as you iterate?"
  ],
  acceptance: 49.2,
  submissions: "12.4M",
  likes: 45892,
};

const sampleSubmissions: Submission[] = [
  { id: "1", status: "accepted", language: "JavaScript", runtime: "52 ms", memory: "42.1 MB", timestamp: "2 hours ago", percentile: 95.47 },
  { id: "2", status: "wrong_answer", language: "JavaScript", runtime: "-", memory: "-", timestamp: "3 hours ago" },
  { id: "3", status: "accepted", language: "Python", runtime: "45 ms", memory: "16.2 MB", timestamp: "1 day ago", percentile: 87.32 },
  { id: "4", status: "time_limit", language: "JavaScript", runtime: "-", memory: "-", timestamp: "1 day ago" },
  { id: "5", status: "accepted", language: "TypeScript", runtime: "48 ms", memory: "44.8 MB", timestamp: "2 days ago", percentile: 91.15 },
];

const starterCode: Record<string, string> = {
  javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
    // Your code here
    
}`,
  typescript: `function twoSum(nums: number[], target: number): number[] {
    // Your code here
    
}`,
  python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        pass`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
        
    }
}`,
  cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
        
    }
};`,
  go: `func twoSum(nums []int, target int) []int {
    // Your code here
    
}`,
  rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        // Your code here
        
    }
}`,
};

export default function ProblemPage() {
  const { id } = useParams();
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(starterCode.javascript);
  const [activeTab, setActiveTab] = useState<"description" | "submissions" | "ai">("description");
  const [showHints, setShowHints] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { id: 1, input: "[2,7,11,15], 9", expected: "[0,1]", status: "pending" },
    { id: 2, input: "[3,2,4], 6", expected: "[1,2]", status: "pending" },
    { id: 3, input: "[3,3], 6", expected: "[0,1]", status: "pending" },
  ]);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setCode(starterCode[newLanguage] || starterCode.javascript);
  };

  const handleReset = () => {
    setCode(starterCode[language] || starterCode.javascript);
    setTestCases(testCases.map(tc => ({ ...tc, status: "pending", output: undefined })));
    setConsoleOutput([]);
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOutput(["Running tests..."]);
    
    for (let i = 0; i < testCases.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      setTestCases(prev => prev.map((tc, idx) => 
        idx === i ? { ...tc, status: "running" } : tc
      ));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const passed = Math.random() > 0.3;
      setTestCases(prev => prev.map((tc, idx) => 
        idx === i ? { 
          ...tc, 
          status: passed ? "passed" : "failed",
          output: passed ? tc.expected : "[0,0]"
        } : tc
      ));
      setConsoleOutput(prev => [...prev, `Test ${i + 1}: ${passed ? "PASSED ✓" : "FAILED ✗"}`]);
    }
    
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsRunning(true);
    setConsoleOutput(["Submitting solution..."]);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConsoleOutput(prev => [...prev, "Runtime: 52 ms, faster than 95.47% of submissions", "Memory: 42.1 MB, less than 65.23% of submissions", "", "✓ Accepted"]);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Problem Header */}
      <div className="border-b border-border bg-card shrink-0">
        <div className="container py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to="/" 
              className="p-2 rounded-lg hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground font-mono">#{problemData.id}</span>
                <h1 className="text-lg font-semibold">{problemData.title}</h1>
                <DifficultyBadge difficulty={problemData.difficulty} />
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span>{problemData.category}</span>
                <span>•</span>
                <span>{problemData.acceptance}% acceptance</span>
                <span>•</span>
                <span>{problemData.submissions} submissions</span>
              </div>
            </div>
          </div>
          <Link
            to={`/problem/${id}/leaderboard`}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-secondary border border-border hover:bg-accent transition-colors"
          >
            <Trophy className="h-4 w-4 text-yellow-500" />
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Main Content - Split View */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Panel - Problem Description */}
        <div className="lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-border min-h-[50vh] lg:min-h-0 lg:h-full">
          {/* Tabs */}
          <div className="shrink-0 border-b border-border bg-card">
            <div className="flex">
              {[
                { id: "description", label: "Description", icon: BookOpen },
                { id: "submissions", label: "Submissions", icon: Clock },
                { id: "ai", label: "Learn with AI", icon: Bot },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Independent Scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
            {activeTab === "description" && (
              <div className="p-6 space-y-6">
                {/* Problem Statement */}
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                    {problemData.description}
                  </p>
                </div>

                {/* Examples */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Examples
                  </h3>
                  {problemData.examples.map((example, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/50 border border-border space-y-2">
                      <div className="font-mono text-sm">
                        <span className="text-muted-foreground">Input: </span>
                        <span className="text-foreground">{example.input}</span>
                      </div>
                      <div className="font-mono text-sm">
                        <span className="text-muted-foreground">Output: </span>
                        <span className="text-primary">{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Explanation: </span>
                          {example.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Constraints */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Constraints
                  </h3>
                  <ul className="space-y-1.5">
                    {problemData.constraints.map((constraint, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <span className="text-primary mt-1">•</span>
                        <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">
                          {constraint}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Hints */}
                <div className="space-y-3">
                  <button
                    onClick={() => setShowHints(!showHints)}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Lightbulb className="h-4 w-4" />
                    Hints ({problemData.hints.length})
                    <ChevronDown className={cn("h-4 w-4 transition-transform", showHints && "rotate-180")} />
                  </button>
                  {showHints && (
                    <div className="space-y-2 animate-fade-in">
                      {problemData.hints.map((hint, index) => (
                        <div key={index} className="p-3 rounded-lg bg-medium/10 border border-medium/20 text-sm">
                          <span className="font-medium text-medium">Hint {index + 1}: </span>
                          {hint}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "submissions" && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Your Submissions</h3>
                  <span className="text-sm text-muted-foreground">{sampleSubmissions.length} total</span>
                </div>
                {sampleSubmissions.map((submission) => (
                  <SubmissionCard
                    key={submission.id}
                    submission={submission}
                    onClick={() => window.location.href = `/problem/${id}/submission/${submission.id}`}
                  />
                ))}
              </div>
            )}

            {activeTab === "ai" && (
              <LearnWithAI problemTitle={problemData.title} />
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="lg:w-1/2 flex flex-col min-h-[50vh] lg:min-h-0">
          {/* Editor Toolbar */}
          <div className="shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-card">
            <LanguageSelector value={language} onChange={handleLanguageChange} />
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                title="Reset code"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 overflow-auto scrollbar-thin">
            <CodeEditor
              value={code}
              onChange={setCode}
              language={language}
              className="h-full min-h-[300px] rounded-none border-0"
            />
          </div>

          {/* Test Cases & Console */}
          <div className="shrink-0 h-48 lg:h-56 border-t border-border flex flex-col bg-card">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium bg-secondary">
                <CheckCircle2 className="h-4 w-4" />
                Testcases
              </button>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent">
                <Terminal className="h-4 w-4" />
                Console
              </button>
            </div>
            <div className="flex-1 overflow-auto scrollbar-thin p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TestCasePanel testCases={testCases} />
                <div className="p-3 rounded-lg bg-muted/50 border border-border font-mono text-xs overflow-auto">
                  {consoleOutput.length > 0 ? (
                    consoleOutput.map((line, i) => (
                      <div key={i} className={cn(
                        "leading-relaxed",
                        line.includes("PASSED") && "text-easy",
                        line.includes("FAILED") && "text-hard",
                        line.includes("Accepted") && "text-easy font-bold"
                      )}>
                        {line}
                      </div>
                    ))
                  ) : (
                    <span className="text-muted-foreground">Console output will appear here...</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 flex items-center justify-between px-4 py-3 border-t border-border bg-card">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <MessageSquare className="h-4 w-4" />
              <span className="hidden sm:inline">Discuss</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRun}
                disabled={isRunning}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "bg-secondary border border-border hover:bg-accent",
                  isRunning && "opacity-50 cursor-not-allowed"
                )}
              >
                <Play className="h-4 w-4" />
                Run
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  "bg-primary text-primary-foreground hover:bg-primary/90 glow-primary",
                  isRunning && "opacity-50 cursor-not-allowed"
                )}
              >
                <Send className="h-4 w-4" />
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
