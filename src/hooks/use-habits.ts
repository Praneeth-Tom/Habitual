"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Habit } from '@/lib/types';
import { format } from 'date-fns';

const STORAGE_KEY = 'habitual-habits';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHabits = localStorage.getItem(STORAGE_KEY);
      if (storedHabits) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedHabits = JSON.parse(storedHabits).map((habit: any) => ({
            ...habit,
            color: habit.color || '#79b4b7' // Default color for habits stored before this change
        }));
        setHabits(parsedHabits);
      }
    } catch (error) {
      console.error("Failed to load habits from local storage", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
      } catch (error) {
        console.error("Failed to save habits to local storage", error);
      }
    }
  }, [habits, isLoaded]);

  const addHabit = useCallback((name: string, color: string) => {
    if (name.trim() === '') return;
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      completed: {},
    };
    setHabits(prevHabits => [...prevHabits, newHabit]);
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setHabits(prevHabits =>
      prevHabits.map(habit => {
        if (habit.id === habitId) {
          const newCompleted = { ...habit.completed };
          if (newCompleted[dateKey]) {
            delete newCompleted[dateKey];
          } else {
            newCompleted[dateKey] = true;
          }
          return { ...habit, completed: newCompleted };
        }
        return habit;
      })
    );
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
  }, []);

  return { habits, addHabit, toggleHabitCompletion, deleteHabit, isLoaded };
}
