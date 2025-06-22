import { type Habit } from "@/lib/types";
import HabitCard from "@/components/HabitCard";
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

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
    <SortableContext items={habits.map(h => h.id)} strategy={rectSortingStrategy}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
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
    </SortableContext>
  );
}
