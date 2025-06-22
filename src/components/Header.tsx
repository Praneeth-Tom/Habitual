import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { Plus } from "lucide-react";

type HeaderProps = {
  onAddHabit: () => void;
};

export default function Header({ onAddHabit }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="ml-auto flex items-center gap-2">
        <Button onClick={onAddHabit} variant="ghost" size="icon" aria-label="Add Habit">
          <Plus />
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
