import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "relative p-3 md:p-5 rounded-lg md:rounded-xl border border-border bg-card overflow-hidden group",
        "hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs md:text-sm text-muted-foreground truncate">{title}</p>
            <p className="text-xl md:text-3xl font-bold mt-0.5 md:mt-1 text-foreground">{value}</p>
            {subtitle && (
              <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5 md:mt-1 truncate">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-1.5 md:p-2.5 rounded-md md:rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0",
            iconClassName
          )}>
            <Icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1 mt-2 md:mt-3">
            <span className={cn(
              "text-[10px] md:text-xs font-medium",
              trend.isPositive ? "text-easy" : "text-hard"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-[10px] md:text-xs text-muted-foreground hidden sm:inline">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
