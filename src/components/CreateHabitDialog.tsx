"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { Habit } from '@/lib/types';


type HabitDialogProps = {
  addHabit: (name: string, color: string, icon: string) => void;
  updateHabit: (id: string, name: string, color: string, icon: string) => void;
  habitToEdit: Habit | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const PREDEFINED_COLORS = [
  "#0d9eff", // primary
  "#987b96", // accent
  "#f87171", // red-400
  "#fb923c", // orange-400
  "#4ade80", // green-400
  "#60a5fa", // blue-400
  "#a78bfa", // violet-400
  "#facc15", // yellow-400
];

export const PREDEFINED_EMOJIS = [
  "📖", "🛌", "💼", "🚲", "🏋️", "🍎", "❤️", "🧠", "💻", "🖊️", "🎵", "🎬", "😊", "🧘", "🎨", "✍️", "🏃", "💧", "💰", "🧹", "🌱"
];

export function CreateHabitDialog({ addHabit, updateHabit, habitToEdit, isOpen, onOpenChange }: HabitDialogProps) {
  const [habitName, setHabitName] = useState("");
  const [selectedColor, setSelectedColor] = useState(PREDEFINED_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(PREDEFINED_EMOJIS[12]);
  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  
  const isEditMode = !!habitToEdit;

  useEffect(() => {
    if (isOpen) {
      if (isEditMode) {
        setHabitName(habitToEdit.name);
        setSelectedColor(habitToEdit.color);
        setSelectedIcon(habitToEdit.icon);
      } else {
        // Reset form for create mode
        setHabitName("");
        setSelectedColor(PREDEFINED_COLORS[0]);
        setSelectedIcon(PREDEFINED_EMOJIS[12]);
      }
    }
  }, [isOpen, isEditMode, habitToEdit]);


  const handleSubmit = () => {
    if (habitName.trim()) {
      if (isEditMode) {
        updateHabit(habitToEdit.id, habitName.trim(), selectedColor, selectedIcon);
      } else {
        addHabit(habitName.trim(), selectedColor, selectedIcon);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] acrylic">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit habit' : 'Create a new habit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={habitName}
                onChange={(e) => setHabitName(e.target.value)}
                className="col-span-3"
                placeholder="e.g. Read for 15 minutes"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">
                Icon
              </Label>
              <div className="col-span-3">
                <Popover open={isIconPickerOpen} onOpenChange={setIsIconPickerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-2xl">
                      {selectedIcon}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-2" align="start">
                    <div className="grid grid-cols-7 gap-2">
                      {PREDEFINED_EMOJIS.map((emoji) => (
                        <Button
                          key={emoji}
                          variant={selectedIcon === emoji ? "default" : "outline"}
                          size="icon"
                          className="text-xl"
                          onClick={() => {
                            setSelectedIcon(emoji);
                            setIsIconPickerOpen(false);
                          }}
                        >
                          {emoji}
                        </Button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Color
              </Label>
              <div className="col-span-3 flex flex-wrap gap-3">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cn(
                      "h-6 w-6 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                      selectedColor === color && "ring-2 ring-ring ring-offset-2 ring-offset-background"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!habitName.trim()}>
              {isEditMode ? 'Save Changes' : 'Create Habit'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
