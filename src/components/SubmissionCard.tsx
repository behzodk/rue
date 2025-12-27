import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, Clock, Zap, Database, Code2 } from "lucide-react";

export interface Submission {
  id: string;
  status: "accepted" | "wrong_answer" | "time_limit" | "runtime_error";
  language: string;
  runtime: string;
  memory: string;
  timestamp: string;
  percentile?: number;
}

interface SubmissionCardProps {
  submission: Submission;
  onClick?: () => void;
}

export function SubmissionCard({ submission, onClick }: SubmissionCardProps) {
  const statusConfig = {
    accepted: {
      icon: CheckCircle2,
      label: "Accepted",
      className: "text-easy bg-easy/10 border-easy/20",
      iconClass: "text-easy",
    },
    wrong_answer: {
      icon: XCircle,
      label: "Wrong Answer",
      className: "text-hard bg-hard/10 border-hard/20",
      iconClass: "text-hard",
    },
    time_limit: {
      icon: Clock,
      label: "Time Limit Exceeded",
      className: "text-medium bg-medium/10 border-medium/20",
      iconClass: "text-medium",
    },
    runtime_error: {
      icon: XCircle,
      label: "Runtime Error",
      className: "text-hard bg-hard/10 border-hard/20",
      iconClass: "text-hard",
    },
  };

  const config = statusConfig[submission.status];
  const Icon = config.icon;

  return (
    <div
      onClick={onClick}
      className={cn(
        "group p-4 rounded-xl border transition-all cursor-pointer",
        "bg-card hover:shadow-lg hover:scale-[1.01]",
        "border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg", config.className)}>
            <Icon className={cn("h-5 w-5", config.iconClass)} />
          </div>
          <div>
            <div className={cn("font-semibold", config.iconClass)}>
              {config.label}
            </div>
            <div className="text-sm text-muted-foreground">
              {submission.timestamp}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{submission.language}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Zap className="h-4 w-4 text-primary" />
            <span>{submission.runtime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Database className="h-4 w-4 text-muted-foreground" />
            <span>{submission.memory}</span>
          </div>
          {submission.status === "accepted" && submission.percentile && (
            <div className="px-3 py-1 rounded-full bg-easy/10 text-easy text-sm font-medium">
              Beats {submission.percentile}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
