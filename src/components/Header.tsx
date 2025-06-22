import { CreateHabitDialog } from "@/components/CreateHabitDialog";
import { ModeToggle } from "./ModeToggle";

type HeaderProps = {
  addHabit: (name: string, color: string, icon: string) => void;
};

export default function Header({ addHabit }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <div className="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
        <h1 className="text-xl font-bold text-primary">Habitual</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <CreateHabitDialog addHabit={addHabit} />
        <ModeToggle />
      </div>
    </header>
  );
}
