import { type Habit } from "@/lib/types";
import HabitCard from "@/components/HabitCard";

type HabitGridProps = {
  habits: Habit[];
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  deleteHabit: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  expandedHabitId: string | null;
  onToggleExpand: (habitId: string) => void;
};

export default function HabitGrid({ habits, toggleHabitCompletion, deleteHabit, onEdit, expandedHabitId, onToggleExpand }: HabitGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          toggleHabitCompletion={toggleHabitCompletion}
          deleteHabit={deleteHabit}
          onEdit={onEdit}
          isExpanded={expandedHabitId === habit.id}
          onToggleExpand={() => onToggleExpand(habit.id)}
        />
      ))}
    </div>
  );
}
