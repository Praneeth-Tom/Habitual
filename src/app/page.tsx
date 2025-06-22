"use client";

import { useHabits } from "@/hooks/use-habits";
import Header from "@/components/Header";
import HabitGrid from "@/components/HabitGrid";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { habits, addHabit, toggleHabitCompletion, deleteHabit, isLoaded } = useHabits();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header addHabit={addHabit} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {!isLoaded ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : habits.length > 0 ? (
          <HabitGrid
            habits={habits}
            toggleHabitCompletion={toggleHabitCompletion}
            deleteHabit={deleteHabit}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                You have no habits
              </h3>
              <p className="text-sm text-muted-foreground">
                Start by adding a new habit to track.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const CardSkeleton = () => (
    <div className="flex flex-col space-y-3">
        <div className="flex flex-col rounded-lg border bg-card text-card-foreground shadow-sm p-6 pt-0">
            <div className="flex flex-row items-start justify-between pt-6">
                <div>
                    <Skeleton className="h-6 w-32 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-8" />
            </div>
            <div className="p-6 pt-6">
                <div className="flex justify-between gap-1">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-10 w-10 rounded-md" />
                    ))}
                </div>
                <div className="mt-2 flex justify-between">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-4 w-10 rounded-md" />
                    ))}
                </div>
            </div>
        </div>
    </div>
);
