"use client";

import { type Habit } from "@/lib/types";
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, isFuture, getDay, isPast } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HabitCalendarProps = {
  habit: Habit;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitCalendar({ habit, toggleHabitCompletion }: HabitCalendarProps) {
  const todayDate = new Date();
  const monthStart = startOfMonth(todayDate);
  const monthEnd = endOfMonth(todayDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const startingDayOfWeek = getDay(monthStart);
  const placeholders = Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`placeholder-${i}`} />);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
        {WEEK_DAYS.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1" aria-label={`Habit tracker for ${format(todayDate, 'MMMM')}`}>
        {placeholders}
        {monthDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const completed = habit.completed[dateKey];
          const today = isToday(day);
          const future = isFuture(day);
          const past = isPast(day) && !today;
          const missed = past && !completed;

          const canToggle = !future;

          return (
            <Tooltip key={dateKey}>
              <TooltipTrigger asChild>
                <button
                  disabled={!canToggle}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canToggle) {
                      toggleHabitCompletion(habit.id, day)
                    }
                  }}
                  className={cn(
                    "h-8 w-8 aspect-square rounded-md transition-colors flex items-center justify-center text-sm font-semibold",
                    completed ? "text-primary-foreground" : "text-muted-foreground",
                    !completed && "bg-muted",
                    missed && "bg-stripes",
                    canToggle && !completed && "hover:bg-muted/80",
                    !canToggle && "cursor-not-allowed",
                    (future || missed) && "opacity-50",
                    today && "ring-2 ring-accent"
                  )}
                  style={completed ? { backgroundColor: habit.color } : {}}
                  aria-label={`Mark habit as ${completed ? 'not completed' : 'completed'} for ${format(day, 'MMMM do')}`}
                >
                  {format(day, 'd')}
                </button>
              </TooltipTrigger>
              <TooltipContent onClick={(e) => e.stopPropagation()}>
                 <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                 {completed && <p className="text-sm font-medium" style={{ color: habit.color }}>Completed</p>}
                 {canToggle && !completed && <p className="text-sm text-muted-foreground">Click to complete</p>}
                 {missed && <p className="text-sm text-muted-foreground">Missed</p>}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
