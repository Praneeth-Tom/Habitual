"use client";

import { useState } from 'react';
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
  const [animationOrigins, setAnimationOrigins] = useState<Record<string, string>>({});

  const startingDayOfWeek = getDay(monthStart);
  const placeholders = Array.from({ length: startingDayOfWeek }).map((_, i) => <div key={`placeholder-${i}`} />);
  const totalCompletions = Object.keys(habit.completed).length;

  const handleDayClick = (e: React.MouseEvent<HTMLButtonElement>, day: Date) => {
    e.stopPropagation();
    if (isFuture(day)) return;

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
    <>
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
                    onClick={(e) => handleDayClick(e, day)}
                    className={cn(
                      "relative overflow-hidden h-8 w-8 aspect-square rounded-md flex items-center justify-center text-sm font-semibold group",
                      !canToggle && "cursor-not-allowed",
                      future && "opacity-50",
                      today && "ring-2 ring-accent"
                    )}
                    aria-label={`Mark habit as ${completed ? 'not completed' : 'completed'} for ${format(day, 'MMMM do')}`}
                  >
                    <div className={cn(
                      "absolute inset-0 transition-opacity",
                       completed ? 'opacity-0' : 'opacity-100',
                       missed ? "bg-stripes" : "bg-muted",
                       canToggle && !completed && !missed && "group-hover:bg-muted/80"
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
      <div className="mt-4 px-4 py-3 rounded-lg bg-[#2d2d2d] text-white flex justify-between items-center">
        <span className="font-semibold text-white/80">Total</span>
        <span className="font-bold text-lg">{totalCompletions}</span>
      </div>
    </>
  );
}
