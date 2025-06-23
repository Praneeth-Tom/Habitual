"use client";

import { type Habit } from "@/lib/types";
import { startOfWeek, eachDayOfInterval, format, isToday, isFuture, endOfWeek, isPast } from 'date-fns';
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type HabitTrackerProps = {
  habit: Habit;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
};

export default function HabitTracker({ habit, toggleHabitCompletion }: HabitTrackerProps) {
  const todayDate = new Date();
  const weekStart = startOfWeek(todayDate, { weekStartsOn: 0 }); // Sunday
  const weekDays = eachDayOfInterval({ start: weekStart, end: endOfWeek(todayDate, { weekStartsOn: 0 }) });

  return (
    <TooltipProvider delayDuration={100}>
        <div className="flex justify-between gap-1" aria-label="Habit tracker for the week">
            {weekDays.map((day) => {
            const dateKey = format(day, 'yyyy-MM-dd');
            const completed = habit.completed[dateKey];
            const today = isToday(day);
            const future = isFuture(day);
            const past = isPast(day) && !today;
            const missed = past && !completed;

            const canToggle = today;

            return (
                <Tooltip key={dateKey}>
                <TooltipTrigger asChild>
                    <button
                    disabled={!canToggle}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (canToggle) toggleHabitCompletion(habit.id, day);
                    }}
                    className={cn(
                        "h-10 w-10 aspect-square rounded-md transition-colors flex items-center justify-center text-sm font-semibold",
                        completed ? "text-primary-foreground" : "text-muted-foreground",
                        !completed && "bg-muted",
                        missed && "bg-stripes",
                        canToggle && !completed && "hover:bg-muted/80",
                        !canToggle && "cursor-not-allowed",
                        (future || missed) && "opacity-50"
                    )}
                    style={completed ? { backgroundColor: habit.color } : {}}
                    aria-label={`Mark habit as ${completed ? 'not completed' : 'completed'} for ${format(day, 'MMMM do')}`}
                    >
                    {format(day, 'd')}
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                    {completed && <p className="text-sm font-medium" style={{ color: habit.color }}>Completed</p>}
                    {today && !completed && <p className="text-sm text-muted-foreground">Click to complete</p>}
                    {missed && <p className="text-sm text-muted-foreground">Missed</p>}
                </TooltipContent>
                </Tooltip>
            );
            })}
        </div>
        <div className="mt-2 flex justify-between text-xs" aria-hidden="true">
            {weekDays.map(day => {
                const today = isToday(day);
                return (
                    <div key={format(day, 'E')} className="w-10 flex flex-col items-center">
                        <div
                            className={cn(
                                "rounded-md py-0.5",
                                today ? "font-semibold text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {format(day, 'E')}
                        </div>
                        {today ? (
                            <div className="mt-0.5 h-1.5 w-1.5 rounded-full bg-[hsl(var(--today-dot))]"></div>
                        ) : (
                            <div className="mt-0.5 h-1.5 w-1.5"></div>
                        )}
                    </div>
                )
            })}
        </div>
    </TooltipProvider>
  );
}
