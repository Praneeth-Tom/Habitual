export interface Habit {
  id: string;
  name: string;
  completed: Record<string, boolean>; // date string 'YYYY-MM-DD' -> boolean
}
