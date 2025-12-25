export interface Tag {
  id: string;
  text: string;
  color: string;
}

export interface CustomCheckbox {
  id: string;
  text: string;
  enabled: boolean;
}

export interface DailyEntry {
  id: string;
  date: string; // ISO date string
  feelings: string[]; // Array of tag IDs
  bedTime: string | null;
  wakeTime: string | null;
  calories: number | null;
  foodsEaten: string;
  readingMinutes: number | null;
  didPray: boolean;
  didReadBible: boolean;
  customCheckboxes: Record<string, boolean>; // checkbox ID -> checked status
}

export interface Goal {
  id: string;
  fieldKey: string; // e.g., 'didPray', 'didReadBible', or custom checkbox ID
  label: string;
  targetPerWeek: number | null;
  targetPerMonth: number | null;
}

export interface Settings {
  tags: Tag[];
  customCheckboxes: CustomCheckbox[];
  goals: Goal[];
  reminderTime: string; // HH:MM format
  fieldsEnabled: {
    feelings: boolean;
    sleep: boolean;
    calories: boolean;
    reading: boolean;
    prayer: boolean;
    bible: boolean;
  };
}

export interface WeeklyStats {
  weekStart: string;
  entries: number;
  goalsAchieved: number;
  totalGoals: number;
  averageReadingMinutes: number | null;
  averageCalories: number | null;
  averageSleep: number | null;
  moodDistribution: Record<string, number>;
}

export interface MonthlyStats {
  month: string; // YYYY-MM
  entries: number;
  goalsAchieved: number;
  totalGoals: number;
  averageReadingMinutes: number | null;
  averageCalories: number | null;
  averageSleep: number | null;
  moodDistribution: Record<string, number>;
}
