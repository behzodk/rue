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
  const bucketSize = 10;
  const userBucket = Math.min(Math.floor(userValue / bucketSize), distribution.length - 1);
  
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
      
      <div className="flex items-end gap-1 h-20">
        {distribution.map((value, index) => {
          const normalizedHeight = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const isUserBucket = index === userBucket;
          
          return (
            <div
              key={index}
              className="flex-1 relative"
              style={{ height: '100%' }}
            >
              <div
                className={cn(
                  "absolute bottom-0 left-0 right-0 rounded-t transition-all",
                  isUserBucket 
                    ? "bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]" 
                    : "bg-muted-foreground/30"
                )}
                style={{ 
                  height: `${Math.max(normalizedHeight, 3)}%`,
                }}
              />
            </div>
          );
        })}
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0 {unit}</span>
        <span>{distribution.length * bucketSize} {unit}</span>
      </div>
    </div>
  );
}
