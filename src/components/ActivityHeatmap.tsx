import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
  data: { date: string; count: number }[];
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const weeks = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364);
    
    const weeksArray: { date: Date; count: number }[][] = [];
    let currentWeek: { date: Date; count: number }[] = [];
    
    const dataMap = new Map(data.map(d => [d.date, d.count]));
    
    for (let i = 0; i <= 364; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      
      currentWeek.push({ date, count });
      
      if (date.getDay() === 6 || i === 364) {
        weeksArray.push(currentWeek);
        currentWeek = [];
      }
    }
    
    return weeksArray;
  }, [data]);

  const getIntensity = (count: number) => {
    if (count === 0) return "bg-muted/30";
    if (count <= 2) return "bg-primary/30";
    if (count <= 4) return "bg-primary/50";
    if (count <= 6) return "bg-primary/70";
    return "bg-primary";
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const totalSubmissions = data.reduce((acc, d) => acc + d.count, 0);
  const maxStreak = useMemo(() => {
    let max = 0, current = 0;
    const sorted = [...data].sort((a, b) => a.date.localeCompare(b.date));
    sorted.forEach(d => {
      if (d.count > 0) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 0;
      }
    });
    return max;
  }, [data]);

  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activity</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{totalSubmissions} submissions in the last year</span>
          <span>Max streak: {maxStreak} days</span>
        </div>
      </div>
      
      <div className="overflow-x-auto scrollbar-thin">
        <div className="inline-flex flex-col gap-1 min-w-max">
          {/* Month labels */}
          <div className="flex ml-8 mb-1">
            {weeks.map((week, weekIndex) => {
              const firstDay = week[0]?.date;
              if (firstDay && firstDay.getDate() <= 7) {
                return (
                  <span
                    key={weekIndex}
                    className="text-xs text-muted-foreground"
                    style={{ width: '13px', marginRight: '2px' }}
                  >
                    {months[firstDay.getMonth()]}
                  </span>
                );
              }
              return <span key={weekIndex} style={{ width: '13px', marginRight: '2px' }} />;
            })}
          </div>
          
          {/* Grid */}
          <div className="flex gap-0.5">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 mr-1">
              {days.map((day, i) => (
                <div key={i} className="h-[13px] flex items-center">
                  {i % 2 === 1 && (
                    <span className="text-xs text-muted-foreground w-6">{day}</span>
                  )}
                </div>
              ))}
            </div>
            
            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-0.5">
                {week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={cn(
                      "w-[13px] h-[13px] rounded-sm transition-colors hover:ring-1 hover:ring-primary",
                      getIntensity(day.count)
                    )}
                    title={`${day.date.toDateString()}: ${day.count} submissions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4">
        <span className="text-xs text-muted-foreground">Less</span>
        {[0, 2, 4, 6, 8].map((level) => (
          <div
            key={level}
            className={cn("w-[13px] h-[13px] rounded-sm", getIntensity(level))}
          />
        ))}
        <span className="text-xs text-muted-foreground">More</span>
      </div>
    </div>
  );
}
