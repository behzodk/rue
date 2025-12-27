import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
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
        "relative p-5 rounded-xl border border-border bg-card overflow-hidden group",
        "hover:border-primary/30 transition-all duration-300",
        className
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn(
            "p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors",
            iconClassName
          )}>
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
        
        {trend && (
          <div className="flex items-center gap-1 mt-3">
            <span className={cn(
              "text-xs font-medium",
              trend.isPositive ? "text-easy" : "text-hard"
            )}>
              {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
            </span>
            <span className="text-xs text-muted-foreground">vs last week</span>
          </div>
        )}
      </div>
    </div>
  );
}
