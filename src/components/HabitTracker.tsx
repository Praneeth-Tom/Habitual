"use client";

import { type Habit } from "@/lib/types";
import { startOfWeek, eachDayOfInterval, format, isToday, isFuture, endOfWeek } from 'date-fns';
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

            const canToggle = today;

            return (
                <Tooltip key={dateKey}>
                <TooltipTrigger asChild>
                    <button
                    disabled={!canToggle}
                    onClick={() => canToggle && toggleHabitCompletion(habit.id, day)}
                    className={cn(
                        "h-10 w-10 aspect-square rounded-md transition-colors",
                        completed ? "bg-primary hover:bg-primary/90" : "bg-muted",
                        canToggle && !completed && "hover:bg-muted/80",
                        today && "ring-2 ring-accent ring-offset-2 ring-offset-background",
                        !canToggle && "cursor-not-allowed",
                        future && "opacity-50"
                    )}
                    aria-label={`Mark habit as ${completed ? 'not completed' : 'completed'} for ${format(day, 'MMMM do')}`}
                    >
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="font-medium">{format(day, 'MMMM d, yyyy')}</p>
                    {completed && <p className="text-sm text-primary">Completed</p>}
                    {today && !completed && <p className="text-sm text-muted-foreground">Click to complete</p>}
                </TooltipContent>
                </Tooltip>
            );
            })}
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground" aria-hidden="true">
            {weekDays.map(day => (
                <div key={format(day, 'E')} className="w-10 text-center">{format(day, 'E')}</div>
            ))}
        </div>
    </TooltipProvider>
  );
}
