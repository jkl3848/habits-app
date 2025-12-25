import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useHabitsStore } from "../../stores/habits";
import { storage } from "../../utils/storage";
import type { DailyEntry } from "../../types";

// Mock storage
vi.mock("../../utils/storage", () => ({
  storage: {
    getEntries: vi.fn(),
    saveEntries: vi.fn(),
    getEntry: vi.fn(),
    saveEntry: vi.fn(),
    getSettings: vi.fn(),
    saveSettings: vi.fn(),
    clearAll: vi.fn(),
  },
}));

describe("habits store", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  describe("initialize", () => {
    it("should load data from storage", async () => {
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

      vi.mocked(storage.getEntries).mockResolvedValue(mockEntries);
      vi.mocked(storage.getSettings).mockResolvedValue(null);

      const store = useHabitsStore();
      await store.initialize();

      expect(store.entries).toEqual(mockEntries);
    });

    it("should create default settings if none exist", async () => {
      vi.mocked(storage.getEntries).mockResolvedValue([]);
      vi.mocked(storage.getSettings).mockResolvedValue(null);

      const store = useHabitsStore();
      await store.initialize();

      expect(storage.saveSettings).toHaveBeenCalled();
      expect(store.settings.tags.length).toBeGreaterThan(0);
    });
  });

  describe("saveEntry", () => {
    it("should create new entry", async () => {
      const store = useHabitsStore();
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

      await store.saveEntry(newEntry);

      expect(storage.saveEntry).toHaveBeenCalledWith(newEntry);
      expect(store.entries).toContainEqual(newEntry);
    });

    it("should update existing entry", async () => {
      const store = useHabitsStore();
      const entry: DailyEntry = {
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

      await store.saveEntry(entry);

      const updatedEntry = { ...entry, feelings: ["2"] };
      await store.saveEntry(updatedEntry);

      expect(store.entries).toHaveLength(1);
      expect(store.entries[0]).toEqual(updatedEntry);
    });
  });

  describe("getEntry", () => {
    it("should return entry by date", async () => {
      const store = useHabitsStore();
      const entry: DailyEntry = {
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

      await store.saveEntry(entry);

      const result = store.getEntry("2025-01-01");
      expect(result).toEqual(entry);
    });

    it("should return undefined for non-existent date", () => {
      const store = useHabitsStore();
      const result = store.getEntry("2025-01-01");
      expect(result).toBeUndefined();
    });
  });

  describe("getEntriesInRange", () => {
    it("should return entries within date range", async () => {
      const store = useHabitsStore();
      const entries: DailyEntry[] = [
        {
          id: "entry-1",
          date: "2025-01-01",
          feelings: [],
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
          date: "2025-01-05",
          feelings: [],
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
          id: "entry-3",
          date: "2025-01-10",
          feelings: [],
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

      for (const entry of entries) {
        await store.saveEntry(entry);
      }

      const result = store.getEntriesInRange("2025-01-02", "2025-01-08");
      expect(result).toHaveLength(1);
      expect(result[0]?.date).toBe("2025-01-05");
    });

    it("should return empty array for range with no entries", () => {
      const store = useHabitsStore();
      const result = store.getEntriesInRange("2025-01-01", "2025-01-05");
      expect(result).toEqual([]);
    });
  });

  describe("updateSettings", () => {
    it("should update partial settings", async () => {
      const store = useHabitsStore();
      await store.updateSettings({ reminderTime: "21:00" });

      expect(storage.saveSettings).toHaveBeenCalled();
      expect(store.settings.reminderTime).toBe("21:00");
    });
  });

  describe("tag management", () => {
    it("should add new tag", async () => {
      const store = useHabitsStore();
      const newTag = { id: "new-tag", text: "Excited", color: "#ff00ff" };

      await store.addTag(newTag);

      expect(store.tags).toContainEqual(newTag);
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should update existing tag", async () => {
      const store = useHabitsStore();
      const tagId = store.tags[0]!.id;

      await store.updateTag(tagId, { text: "Amazing" });

      expect(store.tags[0]?.text).toBe("Amazing");
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should delete tag", async () => {
      const store = useHabitsStore();
      const initialCount = store.tags.length;
      const tagId = store.tags[0]!.id;

      await store.deleteTag(tagId);

      expect(store.tags).toHaveLength(initialCount - 1);
      expect(storage.saveSettings).toHaveBeenCalled();
    });
  });

  describe("custom checkbox management", () => {
    it("should add new checkbox", async () => {
      const store = useHabitsStore();
      const newCheckbox = { id: "cb-1", text: "Exercised", enabled: true };

      await store.addCustomCheckbox(newCheckbox);

      expect(store.settings.customCheckboxes).toContainEqual(newCheckbox);
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should update existing checkbox", async () => {
      const store = useHabitsStore();
      const checkbox = { id: "cb-1", text: "Exercised", enabled: true };
      await store.addCustomCheckbox(checkbox);

      await store.updateCustomCheckbox("cb-1", { text: "Worked Out" });

      const updated = store.settings.customCheckboxes.find(
        (cb: any) => cb.id === "cb-1"
      );
      expect(updated?.text).toBe("Worked Out");
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should delete checkbox", async () => {
      const store = useHabitsStore();
      const checkbox = { id: "cb-1", text: "Exercised", enabled: true };
      await store.addCustomCheckbox(checkbox);

      await store.deleteCustomCheckbox("cb-1");

      const deleted = store.settings.customCheckboxes.find(
        (cb: any) => cb.id === "cb-1"
      );
      expect(deleted).toBeUndefined();
      expect(storage.saveSettings).toHaveBeenCalled();
    });
  });

  describe("goal management", () => {
    it("should add new goal", async () => {
      const store = useHabitsStore();
      const newGoal = {
        id: "goal-1",
        fieldKey: "didPray",
        label: "Pray daily",
        targetPerWeek: 7,
        targetPerMonth: null,
      };

      await store.addGoal(newGoal);

      expect(store.goals).toContainEqual(newGoal);
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should update existing goal", async () => {
      const store = useHabitsStore();
      const goal = {
        id: "goal-1",
        fieldKey: "didPray",
        label: "Pray daily",
        targetPerWeek: 7,
        targetPerMonth: null,
      };
      await store.addGoal(goal);

      await store.updateGoal("goal-1", { targetPerWeek: 5 });

      const updated = store.goals.find((g: any) => g.id === "goal-1");
      expect(updated?.targetPerWeek).toBe(5);
      expect(storage.saveSettings).toHaveBeenCalled();
    });

    it("should delete goal", async () => {
      const store = useHabitsStore();
      const goal = {
        id: "goal-1",
        fieldKey: "didPray",
        label: "Pray daily",
        targetPerWeek: 7,
        targetPerMonth: null,
      };
      await store.addGoal(goal);

      await store.deleteGoal("goal-1");

      const deleted = store.goals.find((g: any) => g.id === "goal-1");
      expect(deleted).toBeUndefined();
      expect(storage.saveSettings).toHaveBeenCalled();
    });
  });

  describe("computed properties", () => {
    it("should return enabled fields", () => {
      const store = useHabitsStore();
      expect(store.enabledFields).toBeDefined();
      expect(store.enabledFields.feelings).toBe(true);
    });

    it("should return all tags", () => {
      const store = useHabitsStore();
      expect(store.tags).toBeDefined();
      expect(Array.isArray(store.tags)).toBe(true);
    });

    it("should return only enabled checkboxes", async () => {
      const store = useHabitsStore();
      await store.addCustomCheckbox({
        id: "cb-1",
        text: "Enabled",
        enabled: true,
      });
      await store.addCustomCheckbox({
        id: "cb-2",
        text: "Disabled",
        enabled: false,
      });

      expect(store.customCheckboxes).toHaveLength(1);
      expect(store.customCheckboxes[0]?.text).toBe("Enabled");
    });

    it("should return all goals", async () => {
      const store = useHabitsStore();
      await store.addGoal({
        id: "goal-1",
        fieldKey: "didPray",
        label: "Pray",
        targetPerWeek: 5,
        targetPerMonth: null,
      });

      expect(store.goals).toHaveLength(1);
    });
  });
});
