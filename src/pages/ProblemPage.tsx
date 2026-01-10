import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TestCasePanel, type TestCase } from "@/components/TestCasePanel";
import { DifficultyBadge, type Difficulty } from "@/components/DifficultyBadge";
import { SubmissionCard, type Submission } from "@/components/SubmissionCard";
import { LearnWithAI } from "@/components/LearnWithAI";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
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
  Trophy,
  Search,
  Sparkles
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Problem = {
  id: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
};

type ProblemSection = {
  id: string;
  section_type: "statement" | "image" | "video" | "example" | "constraint" | "hint";
  position: number;
  content: {
    html?: string;
    items?: Array<Record<string, string>>;
  };
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
  const navigate = useNavigate();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [sections, setSections] = useState<ProblemSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
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

  useEffect(() => {
    const loadProblem = async () => {
      if (!id) return;
      setIsLoading(true);
      setLoadError(null);
      const { data: problemData, error: problemError } = await supabase
        .from("problems")
        .select("id, title, difficulty, tags")
        .eq("id", id)
        .single();
      if (problemError) {
        setIsLoading(false);
        setLoadError(problemError.message);
        return;
      }

      const { data: sectionData, error: sectionError } = await supabase
        .from("problem_sections")
        .select("id, section_type, position, content")
        .eq("problem_id", id)
        .order("position", { ascending: true });
      if (sectionError) {
        setIsLoading(false);
        setLoadError(sectionError.message);
        return;
      }
      setProblem(problemData as Problem);
      setSections((sectionData ?? []) as ProblemSection[]);
      setIsLoading(false);
    };

    void loadProblem();
  }, [id]);

  const problemCategory = useMemo(() => problem?.tags?.[0] ?? "General", [problem?.tags]);
  const prepareStatementHtml = (html: string) => {
    if (typeof window === "undefined") return html;
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    doc.querySelectorAll("a").forEach((anchor) => {
      anchor.setAttribute("target", "_blank");
      anchor.setAttribute("rel", "noreferrer");
    });
    return doc.body.innerHTML;
  };

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
                <span className="text-muted-foreground font-mono">#{problem?.id ?? "—"}</span>
                <h1 className="text-lg font-semibold">{problem?.title ?? "Loading problem"}</h1>
                {problem?.difficulty && <DifficultyBadge difficulty={problem.difficulty} />}
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                <span>{problemCategory}</span>
                <span>•</span>
                <span>—% acceptance</span>
                <span>•</span>
                <span>— submissions</span>
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
            <div className="flex items-center justify-between">
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
              
              {/* Search Tutorials Button with Tooltip */}
              <TooltipProvider delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => navigate("/tutorials")}
                      className="mr-3 flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary/50 border border-border hover:bg-accent hover:border-primary/30 transition-all duration-200 group"
                    >
                      <Search className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                      <span className="hidden sm:inline text-muted-foreground group-hover:text-foreground transition-colors">Search Tutorials</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="bottom" 
                    className="max-w-xs p-4 bg-popover border border-border shadow-xl"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-medium">
                        <Sparkles className="h-4 w-4" />
                        <span>Pro tip!</span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Try <span className="text-foreground font-medium">Learn with AI</span> mode first! It adapts to your level and guides you step-by-step instead of just showing solutions.
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab("ai");
                        }}
                        className="mt-1 text-xs text-primary hover:underline"
                      >
                        → Start learning with AI
                      </button>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Tab Content - Independent Scroll */}
          <div className="flex-1 overflow-y-auto scrollbar-thin min-h-0">
            {activeTab === "description" && (
              <div className="p-6 space-y-6">
                {isLoading && <p className="text-sm text-muted-foreground">Loading problem...</p>}
                {loadError && <p className="text-sm text-destructive">{loadError}</p>}
                {!isLoading &&
                  !loadError &&
                  sections.map((section) => {
                    if (section.section_type === "statement") {
                      return (
                        <div
                          key={section.id}
                          className={cn(
                            "prose prose-sm max-w-none text-foreground",
                            "[&_a]:text-sky-600 [&_a]:underline dark:[&_a]:text-sky-400",
                            "[&_.inline-variable]:rounded [&_.inline-variable]:bg-muted [&_.inline-variable]:px-1.5 [&_.inline-variable]:py-0.5",
                            "[&_.inline-variable]:font-mono [&_.inline-variable]:text-xs [&_.inline-variable]:text-primary",
                          )}
                          dangerouslySetInnerHTML={{
                            __html: prepareStatementHtml(section.content.html ?? ""),
                          }}
                        />
                      );
                    }

                    if (section.section_type === "image") {
                      const items = section.content.items ?? [];
                      return (
                        <div key={section.id} className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Images
                          </h3>
                          <div className="grid grid-cols-2 gap-3">
                            {items.map((item, index) => (
                              <div
                                key={`${section.id}-image-${index}`}
                                className="rounded-lg border border-border bg-muted/50 overflow-hidden"
                              >
                                {item.url && (
                                  <img
                                    src={item.url}
                                    alt={item.caption || `Image ${index + 1}`}
                                    className="h-40 w-full object-cover"
                                  />
                                )}
                                {item.caption && (
                                  <p className="px-3 py-2 text-xs text-muted-foreground">{item.caption}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (section.section_type === "video") {
                      const items = section.content.items ?? [];
                      return (
                        <div key={section.id} className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Videos
                          </h3>
                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <div
                                key={`${section.id}-video-${index}`}
                                className="p-3 rounded-lg bg-muted/50 border border-border text-sm"
                              >
                                <a
                                  href={item.url ?? "#"}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-sky-600 underline dark:text-sky-400"
                                >
                                  {item.caption || `Video link ${index + 1}`}
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }

                    if (section.section_type === "example") {
                      const items = section.content.items ?? [];
                      return (
                        <div key={section.id} className="space-y-4">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Examples
                          </h3>
                          {items.map((example, index) => (
                            <div
                              key={`${section.id}-example-${index}`}
                              className="p-4 rounded-lg bg-muted/50 border border-border space-y-2"
                            >
                              <div className="font-mono text-sm">
                                <span className="text-muted-foreground">Input: </span>
                                <span className="text-foreground">{example.input ?? "—"}</span>
                              </div>
                              <div className="font-mono text-sm">
                                <span className="text-muted-foreground">Output: </span>
                                <span className="text-primary">{example.output ?? "—"}</span>
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
                      );
                    }

                    if (section.section_type === "constraint") {
                      const items = section.content.items ?? [];
                      return (
                        <div key={section.id} className="space-y-3">
                          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                            Constraints
                          </h3>
                          <ul className="space-y-1.5">
                            {items.map((item, index) => (
                              <li key={`${section.id}-constraint-${index}`} className="flex items-start gap-2 text-sm">
                                <span className="text-primary mt-1">•</span>
                                <code className="text-foreground bg-muted px-1.5 py-0.5 rounded">
                                  {typeof item === "string" ? item : item.text ?? "—"}
                                </code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }

                    if (section.section_type === "hint") {
                      const items = section.content.items ?? [];
                      return (
                        <div key={section.id} className="space-y-3">
                          <button
                            onClick={() => setShowHints(!showHints)}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Lightbulb className="h-4 w-4" />
                            Hints ({items.length})
                            <ChevronDown className={cn("h-4 w-4 transition-transform", showHints && "rotate-180")} />
                          </button>
                          {showHints && (
                            <div className="space-y-2 animate-fade-in">
                              {items.map((item, index) => (
                                <div
                                  key={`${section.id}-hint-${index}`}
                                  className="p-3 rounded-lg bg-medium/10 border border-medium/20 text-sm"
                                >
                                  <span className="font-medium text-medium">Hint {index + 1}: </span>
                                  {typeof item === "string" ? item : item.text ?? "—"}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return null;
                  })}
                {!isLoading && !loadError && sections.length === 0 && (
                  <p className="text-sm text-muted-foreground">No sections available.</p>
                )}
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
              <LearnWithAI problemTitle={problem?.title ?? "Problem"} />
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
