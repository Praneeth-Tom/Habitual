import { type Habit } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HabitTracker from "@/components/HabitTracker";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import HabitCalendar from "./HabitCalendar";
import { cn } from "@/lib/utils";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type HabitCardProps = {
  habit: Habit;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  deleteHabit: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export default function HabitCard({ habit, toggleHabitCompletion, deleteHabit, onEdit, isExpanded, onToggleExpand }: HabitCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: habit.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card 
        className={cn("group flex flex-col transition-all duration-500 ease-in-out hover:shadow-lg acrylic cursor-grab")}
        onClick={onToggleExpand}
      >
        <CardHeader className="flex-row items-center justify-between">
          <div className="flex flex-1 items-center gap-3 pr-4">
              <span className="text-2xl h-6 w-6 flex items-center justify-center shrink-0">{habit.icon}</span>
              <CardTitle>{habit.name}</CardTitle>
          </div>
          <div className="flex items-center space-x-1 md:opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onEdit(habit)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit habit</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete habit</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="acrylic" onClick={(e) => e.stopPropagation()}>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your habit
                    and all its tracking data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteHabit(habit.id)} variant="destructive">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col justify-end">
          <div className={cn("grid transition-all duration-500 ease-in-out", isExpanded ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100")}>
              <div className="overflow-hidden">
                  <HabitTracker habit={habit} toggleHabitCompletion={toggleHabitCompletion} />
              </div>
          </div>
          <div className={cn("grid transition-all duration-500 ease-in-out", isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <div className="overflow-hidden">
                  <HabitCalendar habit={habit} toggleHabitCompletion={toggleHabitCompletion} />
              </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
