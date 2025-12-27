import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Play } from "lucide-react";

export interface TestCase {
  id: number;
  input: string;
  expected: string;
  output?: string;
  status: "pending" | "running" | "passed" | "failed";
}

interface TestCasePanelProps {
  testCases: TestCase[];
  className?: string;
}

export function TestCasePanel({ testCases, className }: TestCasePanelProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {testCases.map((testCase, index) => (
        <div
          key={testCase.id}
          className={cn(
            "p-3 rounded-lg border transition-all",
            testCase.status === "passed" && "border-easy/50 bg-easy/5",
            testCase.status === "failed" && "border-hard/50 bg-hard/5",
            testCase.status === "running" && "border-medium/50 bg-medium/5",
            testCase.status === "pending" && "border-border bg-card"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Test Case {index + 1}</span>
            <StatusIcon status={testCase.status} />
          </div>
          
          <div className="space-y-2 text-xs font-mono">
            <div>
              <span className="text-muted-foreground">Input: </span>
              <span className="text-foreground">{testCase.input}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Expected: </span>
              <span className="text-foreground">{testCase.expected}</span>
            </div>
            {testCase.output !== undefined && (
              <div>
                <span className="text-muted-foreground">Output: </span>
                <span className={cn(
                  testCase.status === "passed" ? "text-easy" : "text-hard"
                )}>
                  {testCase.output}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: TestCase["status"] }) {
  switch (status) {
    case "passed":
      return <CheckCircle2 className="h-4 w-4 text-easy" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-hard" />;
    case "running":
      return <Clock className="h-4 w-4 text-medium animate-pulse" />;
    default:
      return <Play className="h-4 w-4 text-muted-foreground" />;
  }
}
