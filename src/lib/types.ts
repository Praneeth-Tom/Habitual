export interface Habit {
  id: string;
  name: string;
  color: string;
  icon: string;
  completed: Record<string, boolean>; // date string 'YYYY-MM-DD' -> boolean
}
