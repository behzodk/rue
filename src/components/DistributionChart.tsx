import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface DistributionChartProps {
  userValue: number;
  distribution: number[];
  label: string;
  unit: string;
}

export function DistributionChart({ userValue, distribution, label, unit }: DistributionChartProps) {
  const maxValue = Math.max(...distribution);
  const userBucket = Math.floor(userValue / 10);
  
  const percentile = useMemo(() => {
    let below = 0;
    for (let i = 0; i < userBucket; i++) {
      below += distribution[i];
    }
    const total = distribution.reduce((a, b) => a + b, 0);
    return Math.round((below / total) * 100);
  }, [distribution, userBucket]);

  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">{label}</h3>
          <p className="text-sm text-muted-foreground">Normal Distribution</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{userValue} {unit}</div>
          <div className="text-sm text-easy">Beats {percentile}%</div>
        </div>
      </div>
      
      <div className="flex items-end gap-0.5 h-24">
        {distribution.map((value, index) => {
          const height = (value / maxValue) * 100;
          const isUserBucket = index === userBucket;
          
          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-1"
            >
              <div
                className={cn(
                  "w-full rounded-t transition-all",
                  isUserBucket 
                    ? "bg-primary glow-primary" 
                    : "bg-muted-foreground/20"
                )}
                style={{ height: `${height}%` }}
              />
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0 {unit}</span>
        <span>{distribution.length * 10} {unit}</span>
      </div>
    </div>
  );
}
