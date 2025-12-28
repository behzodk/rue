import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { 
  CalendarDays, 
  Target, 
  Flame,
  Trophy,
  CheckCircle2
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

// Mock activity data
const activityData: Record<string, { problems: number; streak: boolean }> = {
  "2024-12-01": { problems: 3, streak: true },
  "2024-12-02": { problems: 2, streak: true },
  "2024-12-03": { problems: 5, streak: true },
  "2024-12-04": { problems: 1, streak: true },
  "2024-12-05": { problems: 4, streak: true },
  "2024-12-08": { problems: 2, streak: false },
  "2024-12-09": { problems: 3, streak: true },
  "2024-12-10": { problems: 1, streak: true },
  "2024-12-15": { problems: 2, streak: false },
  "2024-12-16": { problems: 4, streak: true },
  "2024-12-17": { problems: 3, streak: true },
  "2024-12-18": { problems: 2, streak: true },
  "2024-12-19": { problems: 5, streak: true },
  "2024-12-20": { problems: 1, streak: true },
  "2024-12-21": { problems: 3, streak: true },
  "2024-12-22": { problems: 2, streak: true },
  "2024-12-23": { problems: 4, streak: true },
  "2024-12-24": { problems: 2, streak: true },
  "2024-12-25": { problems: 1, streak: true },
  "2024-12-26": { problems: 3, streak: true },
  "2024-12-27": { problems: 2, streak: true },
  "2024-12-28": { problems: 1, streak: true },
};

interface DailyGoal {
  target: number;
  completed: number;
}

const dailyGoal: DailyGoal = {
  target: 3,
  completed: 1
};

const upcomingContests = [
  { id: 1, name: "Weekly Contest 380", date: "Dec 29", time: "8:00 AM" },
  { id: 2, name: "Biweekly Contest 120", date: "Jan 1", time: "8:00 AM" },
];

interface DashboardCalendarProps {
  isMobile?: boolean;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function CalendarContent() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const formatDateKey = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getActivityForDate = (d: Date) => {
    const key = formatDateKey(d);
    return activityData[key];
  };

  const modifiers = {
    hasActivity: (d: Date) => !!getActivityForDate(d),
    highActivity: (d: Date) => {
      const activity = getActivityForDate(d);
      return activity ? activity.problems >= 3 : false;
    },
  };

  const modifiersClassNames = {
    hasActivity: "bg-primary/20 text-primary font-medium",
    highActivity: "bg-primary text-primary-foreground font-bold",
  };

  return (
    <div className="space-y-4">
      {/* Calendar Card */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Activity</h3>
            <p className="text-xs text-muted-foreground">Track your progress</p>
          </div>
        </div>

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          modifiers={modifiers}
          modifiersClassNames={modifiersClassNames}
          className="rounded-lg border-0 p-0 pointer-events-auto"
          classNames={{
            months: "flex flex-col",
            month: "space-y-2",
            caption: "flex justify-center pt-1 relative items-center mb-2",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              "inline-flex items-center justify-center rounded-md",
              "hover:bg-accent"
            ),
            nav_button_previous: "absolute left-0",
            nav_button_next: "absolute right-0",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
            row: "flex w-full mt-1",
            cell: "text-center text-xs p-0 relative",
            day: cn(
              "h-8 w-8 p-0 font-normal rounded-md",
              "hover:bg-accent inline-flex items-center justify-center",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            ),
            day_selected: "bg-primary text-primary-foreground hover:bg-primary",
            day_today: "ring-1 ring-primary/50",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
          }}
        />

        {/* Activity Legend */}
        <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary/20" />
            <span className="text-xs text-muted-foreground">Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-primary" />
            <span className="text-xs text-muted-foreground">3+ Problems</span>
          </div>
        </div>
      </div>

      {/* Daily Goal */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Daily Goal</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {dailyGoal.completed}/{dailyGoal.target} problems
          </span>
        </div>

        <div className="h-2 bg-secondary rounded-full overflow-hidden mb-3">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
            style={{ width: `${(dailyGoal.completed / dailyGoal.target) * 100}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          {[...Array(dailyGoal.target)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 h-8 rounded-lg flex items-center justify-center transition-all",
                i < dailyGoal.completed
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}
            >
              {i < dailyGoal.completed ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span className="text-xs">{i + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Streak */}
      <div className="p-4 rounded-xl border border-border bg-gradient-to-br from-medium/10 to-medium/5">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-medium/20">
            <Flame className="h-6 w-6 text-medium" />
          </div>
          <div>
            <div className="text-2xl font-bold">7 Days</div>
            <p className="text-xs text-muted-foreground">Current Streak 🔥</p>
          </div>
        </div>
      </div>

      {/* Upcoming Contests */}
      <div className="p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="h-4 w-4 text-medium" />
          <span className="font-medium text-sm">Upcoming Contests</span>
        </div>

        <div className="space-y-2">
          {upcomingContests.map((contest) => (
            <div
              key={contest.id}
              className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
            >
              <p className="text-sm font-medium">{contest.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{contest.date}</span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs text-primary">{contest.time}</span>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-3 py-2 text-sm text-primary hover:underline">
          View All Contests →
        </button>
      </div>
    </div>
  );
}

export function DashboardCalendar({ isMobile, isOpen, onOpenChange }: DashboardCalendarProps) {
  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[320px] sm:w-[380px] overflow-y-auto">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Activity & Stats
            </SheetTitle>
          </SheetHeader>
          <CalendarContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-24">
        <CalendarContent />
      </div>
    </aside>
  );
}

export function CalendarTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
        "bg-card border border-border hover:bg-accent transition-all",
        "xl:hidden"
      )}
    >
      <CalendarDays className="h-4 w-4" />
      <span className="hidden sm:inline">Activity</span>
    </button>
  );
}
