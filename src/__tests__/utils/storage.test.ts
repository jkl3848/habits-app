import { describe, it, expect, beforeEach } from "vitest";
import { storage } from "../../utils/storage";
import type { DailyEntry, Settings } from "../../types";

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

globalThis.localStorage = localStorageMock as any;

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("getEntries", () => {
    it("should return empty array when no data exists", async () => {
      const entries = await storage.getEntries();
      expect(entries).toEqual([]);
    });

    it("should return existing entries", async () => {
      const mockEntries: DailyEntry[] = [
        {
          id: "entry-1",
          date: "2025-01-01",
          feelings: ["1"],
          bedTime: "22:00",
          wakeTime: "06:00",
          calories: 2000,
          foodsEaten: "Test food",
          readingMinutes: 30,
          didPray: true,
          didReadBible: true,
          customCheckboxes: {},
        },
      ];
      localStorage.setItem("habits_entries", JSON.stringify(mockEntries));

      const entries = await storage.getEntries();
      expect(entries).toEqual(mockEntries);
    });
  });

  describe("saveEntries", () => {
    it("should save entries to localStorage", async () => {
      const mockEntries: DailyEntry[] = [
        {
          id: "entry-1",
          date: "2025-01-01",
          feelings: ["1"],
          bedTime: null,
          wakeTime: null,
          calories: null,
          foodsEaten: "",
          readingMinutes: null,
          didPray: false,
          didReadBible: false,
          customCheckboxes: {},
        },
      ];

      await storage.saveEntries(mockEntries);
      const saved = localStorage.getItem("habits_entries");
      expect(JSON.parse(saved!)).toEqual(mockEntries);
    });
  });

  describe("getEntry", () => {
    it("should return null when entry does not exist", async () => {
      const entry = await storage.getEntry("2025-01-01");
      expect(entry).toBeNull();
    });

    it("should return correct entry by date", async () => {
      const mockEntries: DailyEntry[] = [
        {
          id: "entry-1",
          date: "2025-01-01",
          feelings: ["1"],
          bedTime: null,
          wakeTime: null,
          calories: null,
          foodsEaten: "",
          readingMinutes: null,
          didPray: false,
          didReadBible: false,
          customCheckboxes: {},
        },
        {
          id: "entry-2",
          date: "2025-01-02",
          feelings: ["2"],
          bedTime: null,
          wakeTime: null,
          calories: null,
          foodsEaten: "",
          readingMinutes: null,
          didPray: false,
          didReadBible: false,
          customCheckboxes: {},
        },
      ];
      localStorage.setItem("habits_entries", JSON.stringify(mockEntries));

      const entry = await storage.getEntry("2025-01-02");
      expect(entry).toEqual(mockEntries[1]);
    });
  });

  describe("saveEntry", () => {
    it("should create new entry", async () => {
      const newEntry: DailyEntry = {
        id: "entry-1",
        date: "2025-01-01",
        feelings: ["1"],
        bedTime: null,
        wakeTime: null,
        calories: null,
        foodsEaten: "",
        readingMinutes: null,
        didPray: false,
        didReadBible: false,
        customCheckboxes: {},
      };

      await storage.saveEntry(newEntry);
      const entries = await storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(newEntry);
    });

    it("should update existing entry", async () => {
      const originalEntry: DailyEntry = {
        id: "entry-1",
        date: "2025-01-01",
        feelings: ["1"],
        bedTime: null,
        wakeTime: null,
        calories: null,
        foodsEaten: "",
        readingMinutes: null,
        didPray: false,
        didReadBible: false,
        customCheckboxes: {},
      };
      await storage.saveEntry(originalEntry);

      const updatedEntry: DailyEntry = {
        ...originalEntry,
        feelings: ["2", "3"],
        didPray: true,
      };
      await storage.saveEntry(updatedEntry);

      const entries = await storage.getEntries();
      expect(entries).toHaveLength(1);
      expect(entries[0]).toEqual(updatedEntry);
    });
  });

  describe("getSettings", () => {
    it("should return null when no settings exist", async () => {
      const settings = await storage.getSettings();
      expect(settings).toBeNull();
    });

    it("should return saved settings", async () => {
      const mockSettings: Settings = {
        tags: [{ id: "1", text: "Happy", color: "#00ff00" }],
        customCheckboxes: [],
        goals: [],
        reminderTime: "20:00",
        fieldsEnabled: {
          feelings: true,
          sleep: true,
          calories: true,
          reading: true,
          prayer: true,
          bible: true,
        },
      };
      localStorage.setItem("habits_settings", JSON.stringify(mockSettings));

      const settings = await storage.getSettings();
      expect(settings).toEqual(mockSettings);
    });
  });

  describe("saveSettings", () => {
    it("should save settings to localStorage", async () => {
      const mockSettings: Settings = {
        tags: [{ id: "1", text: "Happy", color: "#00ff00" }],
        customCheckboxes: [],
        goals: [],
        reminderTime: "20:00",
        fieldsEnabled: {
          feelings: true,
          sleep: true,
          calories: true,
          reading: true,
          prayer: true,
          bible: true,
        },
      };

      await storage.saveSettings(mockSettings);
      const saved = localStorage.getItem("habits_settings");
      expect(JSON.parse(saved!)).toEqual(mockSettings);
    });
  });

  describe("clearAll", () => {
    it("should remove all data", async () => {
      localStorage.setItem("habits_entries", JSON.stringify([]));
      localStorage.setItem("habits_settings", JSON.stringify({}));

      await storage.clearAll();

      expect(localStorage.getItem("habits_entries")).toBeNull();
      expect(localStorage.getItem("habits_settings")).toBeNull();
    });
  });
});
