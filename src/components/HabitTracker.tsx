
"use client";

import { useState } from "react";
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
  const [animationOrigins, setAnimationOrigins] = useState<Record<string, string>>({});

  const handleDayClick = (e: React.MouseEvent<HTMLButtonElement>, day: Date) => {
      e.stopPropagation();
      if (!isToday(day)) return;

      const dateKey = format(day, 'yyyy-MM-dd');

      if (!habit.completed[dateKey]) { // Only set origin on completion
          const button = e.currentTarget;
          const rect = button.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          const atTop = y < rect.height / 3;
          const atBottom = y > (rect.height * 2) / 3;
          const atLeft = x < rect.width / 3;
          const atRight = x > (rect.width * 2) / 3;

          let origin = '50% 50%';
          if (atTop && atLeft) origin = '0% 0%';
          else if (atTop && atRight) origin = '100% 0%';
          else if (atBottom && atLeft) origin = '0% 100%';
          else if (atBottom && atRight) origin = '100% 100%';
          else if (atTop) origin = '50% 0%';
          else if (atBottom) origin = '50% 100%';
          else if (atLeft) origin = '0% 50%';
          else if (atRight) origin = '100% 50%';
          
          setAnimationOrigins(prev => ({ ...prev, [dateKey]: origin }));
      }

      toggleHabitCompletion(habit.id, day);
  };


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
                        onClick={(e) => handleDayClick(e, day)}
                        className={cn(
                            "relative overflow-hidden h-10 w-10 aspect-square rounded-md flex items-center justify-center text-sm font-semibold group",
                            !canToggle && "cursor-not-allowed",
                            (future || missed) && "opacity-50"
                        )}
                        aria-label={`Mark habit as ${completed ? 'not completed' : 'completed'} for ${format(day, 'MMMM do')}`}
                    >
                        <div className={cn(
                            "absolute inset-0 transition-opacity",
                            completed ? 'opacity-0' : 'opacity-100',
                            missed ? "bg-stripes" : "bg-muted",
                            canToggle && !completed && "group-hover:bg-muted/80"
                        )} />
                        <div
                          className="absolute inset-0 transition-[clip-path] duration-300 ease-in-out"
                          style={{
                              backgroundColor: habit.color,
                              clipPath: completed ? `circle(142% at ${animationOrigins[dateKey] || '50% 50%'})` : `circle(0% at ${animationOrigins[dateKey] || '50% 50%'})`,
                          }}
                        />
                        <span className={cn(
                            "relative z-10 transition-colors",
                            completed ? "text-primary-foreground" : "text-muted-foreground"
                        )}>
                            {format(day, 'd')}
                        </span>
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
