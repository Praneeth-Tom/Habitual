import { type Habit } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import HabitTracker from "@/components/HabitTracker";
import { Button } from "@/components/ui/button";
import { Pencil, X } from "lucide-react";
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

type HabitCardProps = {
  habit: Habit;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  deleteHabit: (habitId: string) => void;
  onEdit: (habit: Habit) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
};

export default function HabitCard({ habit, toggleHabitCompletion, deleteHabit, onEdit, isExpanded, onToggleExpand }: HabitCardProps) {
  return (
    <Card 
      className={cn("flex flex-col transition-all hover:shadow-lg acrylic cursor-pointer")}
      onClick={onToggleExpand}
    >
      <CardHeader className="flex-row items-start justify-between">
        <div className="flex flex-1 items-center gap-3 pr-4">
            <span className="text-2xl h-6 w-6 flex items-center justify-center shrink-0">{habit.icon}</span>
            <CardTitle>{habit.name}</CardTitle>
        </div>
        <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => onEdit(habit)}>
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit habit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                  <X className="h-4 w-4" />
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
        {isExpanded ? (
          <HabitCalendar habit={habit} toggleHabitCompletion={toggleHabitCompletion} />
        ) : (
          <HabitTracker habit={habit} toggleHabitCompletion={toggleHabitCompletion} />
        )}
      </CardContent>
    </Card>
  );
}
