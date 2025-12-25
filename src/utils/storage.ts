import type { DailyEntry, Settings } from "../types";

const STORAGE_KEYS = {
  ENTRIES: "habits_entries",
  SETTINGS: "habits_settings",
} as const;

export const storage = {
  // Entries
  async getEntries(): Promise<DailyEntry[]> {
    const data = localStorage.getItem(STORAGE_KEYS.ENTRIES);
    return data ? JSON.parse(data) : [];
  },

  async saveEntries(entries: DailyEntry[]): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.ENTRIES, JSON.stringify(entries));
  },

  async getEntry(date: string): Promise<DailyEntry | null> {
    const entries = await this.getEntries();
    return entries.find((e) => e.date === date) || null;
  },

  async saveEntry(entry: DailyEntry): Promise<void> {
    const entries = await this.getEntries();
    const index = entries.findIndex((e) => e.date === entry.date);
    if (index >= 0) {
      entries[index] = entry;
    } else {
      entries.push(entry);
    }
    await this.saveEntries(entries);
  },

  // Settings
  async getSettings(): Promise<Settings | null> {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : null;
  },

  async saveSettings(settings: Settings): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Clear all data
  async clearAll(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.ENTRIES);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  },
};
