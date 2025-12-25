import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { DailyEntry, Settings, Tag, CustomCheckbox, Goal } from "../types";
import { storage } from "../utils/storage";

const DEFAULT_TAGS: Tag[] = [
  { id: "1", text: "Great", color: "#22c55e" },
  { id: "2", text: "Good", color: "#3b82f6" },
  { id: "3", text: "Ok", color: "#eab308" },
  { id: "4", text: "Bad", color: "#f97316" },
  { id: "5", text: "Terrible", color: "#ef4444" },
];

const DEFAULT_SETTINGS: Settings = {
  tags: DEFAULT_TAGS,
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

export const useHabitsStore = defineStore("habits", () => {
  // State
  const entries = ref<DailyEntry[]>([]);
  const settings = ref<Settings>(DEFAULT_SETTINGS);
  const isLoading = ref(false);

  // Computed
  const enabledFields = computed(() => settings.value.fieldsEnabled);
  const tags = computed(() => settings.value.tags);
  const customCheckboxes = computed(() =>
    settings.value.customCheckboxes.filter((cb) => cb.enabled)
  );
  const goals = computed(() => settings.value.goals);

  // Actions
  async function initialize() {
    isLoading.value = true;
    try {
      const loadedEntries = await storage.getEntries();
      entries.value = loadedEntries;

      const loadedSettings = await storage.getSettings();
      if (loadedSettings) {
        settings.value = loadedSettings;
      } else {
        await storage.saveSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error("Failed to initialize store:", error);
    } finally {
      isLoading.value = false;
    }
  }

  async function saveEntry(entry: DailyEntry) {
    await storage.saveEntry(entry);
    const index = entries.value.findIndex((e) => e.date === entry.date);
    if (index >= 0) {
      entries.value[index] = entry;
    } else {
      entries.value.push(entry);
    }
  }

  function getEntry(date: string): DailyEntry | undefined {
    return entries.value.find((e) => e.date === date);
  }

  function getEntriesInRange(startDate: string, endDate: string): DailyEntry[] {
    return entries.value.filter(
      (e) => e.date >= startDate && e.date <= endDate
    );
  }

  async function updateSettings(newSettings: Partial<Settings>) {
    settings.value = { ...settings.value, ...newSettings };
    await storage.saveSettings(settings.value);
  }

  async function addTag(tag: Tag) {
    settings.value.tags.push(tag);
    await storage.saveSettings(settings.value);
  }

  async function updateTag(tagId: string, updates: Partial<Tag>) {
    const index = settings.value.tags.findIndex((t) => t.id === tagId);
    if (index >= 0) {
      settings.value.tags[index] = {
        ...settings.value.tags[index],
        ...updates,
      } as Tag;
      await storage.saveSettings(settings.value);
    }
  }

  async function deleteTag(tagId: string) {
    settings.value.tags = settings.value.tags.filter((t) => t.id !== tagId);
    await storage.saveSettings(settings.value);
  }

  async function addCustomCheckbox(checkbox: CustomCheckbox) {
    settings.value.customCheckboxes.push(checkbox);
    await storage.saveSettings(settings.value);
  }

  async function updateCustomCheckbox(
    checkboxId: string,
    updates: Partial<CustomCheckbox>
  ) {
    const index = settings.value.customCheckboxes.findIndex(
      (cb) => cb.id === checkboxId
    );
    if (index >= 0) {
      settings.value.customCheckboxes[index] = {
        ...settings.value.customCheckboxes[index],
        ...updates,
      } as CustomCheckbox;
      await storage.saveSettings(settings.value);
    }
  }

  async function deleteCustomCheckbox(checkboxId: string) {
    settings.value.customCheckboxes = settings.value.customCheckboxes.filter(
      (cb) => cb.id !== checkboxId
    );
    await storage.saveSettings(settings.value);
  }

  async function addGoal(goal: Goal) {
    settings.value.goals.push(goal);
    await storage.saveSettings(settings.value);
  }

  async function updateGoal(goalId: string, updates: Partial<Goal>) {
    const index = settings.value.goals.findIndex((g) => g.id === goalId);
    if (index >= 0) {
      settings.value.goals[index] = {
        ...settings.value.goals[index],
        ...updates,
      } as Goal;
      await storage.saveSettings(settings.value);
    }
  }

  async function deleteGoal(goalId: string) {
    settings.value.goals = settings.value.goals.filter((g) => g.id !== goalId);
    await storage.saveSettings(settings.value);
  }

  return {
    // State
    entries,
    settings,
    isLoading,
    // Computed
    enabledFields,
    tags,
    customCheckboxes,
    goals,
    // Actions
    initialize,
    saveEntry,
    getEntry,
    getEntriesInRange,
    updateSettings,
    addTag,
    updateTag,
    deleteTag,
    addCustomCheckbox,
    updateCustomCheckbox,
    deleteCustomCheckbox,
    addGoal,
    updateGoal,
    deleteGoal,
  };
});
