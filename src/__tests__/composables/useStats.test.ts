import { describe, it, expect } from "vitest";
import { useStats } from "../../composables/useStats";
import type { DailyEntry, Goal, Tag } from "../../types";

describe("useStats", () => {
  const mockTags: Tag[] = [
    { id: "1", text: "Great", color: "#22c55e" },
    { id: "2", text: "Good", color: "#3b82f6" },
    { id: "3", text: "Ok", color: "#eab308" },
  ];

  const mockEntries: DailyEntry[] = [
    {
      id: "entry-1",
      date: "2025-01-01",
      feelings: ["1", "2"],
      bedTime: "22:00",
      wakeTime: "06:00",
      calories: 2000,
      foodsEaten: "Test food",
      readingMinutes: 30,
      didPray: true,
      didReadBible: true,
      customCheckboxes: { custom1: true },
    },
    {
      id: "entry-2",
      date: "2025-01-02",
      feelings: ["2"],
      bedTime: "23:00",
      wakeTime: "07:00",
      calories: 1800,
      foodsEaten: "More food",
      readingMinutes: 45,
      didPray: false,
      didReadBible: true,
      customCheckboxes: { custom1: false },
    },
    {
      id: "entry-3",
      date: "2025-01-03",
      feelings: ["1"],
      bedTime: "22:30",
      wakeTime: "06:30",
      calories: 2200,
      foodsEaten: "Even more food",
      readingMinutes: 20,
      didPray: true,
      didReadBible: false,
      customCheckboxes: { custom1: true },
    },
  ];

  const mockGoals: Goal[] = [
    {
      id: "goal-1",
      fieldKey: "didPray",
      label: "Pray daily",
      targetPerWeek: 2,
      targetPerMonth: null,
    },
    {
      id: "goal-2",
      fieldKey: "didReadBible",
      label: "Read Bible",
      targetPerWeek: 2,
      targetPerMonth: null,
    },
    {
      id: "goal-3",
      fieldKey: "custom1",
      label: "Custom activity",
      targetPerWeek: 2,
      targetPerMonth: null,
    },
  ];

  describe("totalEntries", () => {
    it("should count total entries", () => {
      const stats = useStats(mockEntries, [], mockTags);
      expect(stats.totalEntries.value).toBe(3);
    });

    it("should return 0 for empty entries", () => {
      const stats = useStats([], [], mockTags);
      expect(stats.totalEntries.value).toBe(0);
    });
  });

  describe("averageReadingMinutes", () => {
    it("should calculate average reading minutes", () => {
      const stats = useStats(mockEntries, [], mockTags);
      const expected = Math.round((30 + 45 + 20) / 3);
      expect(stats.averageReadingMinutes.value).toBe(expected);
    });

    it("should return null when no valid entries", () => {
      const entriesWithoutReading: DailyEntry[] = [
        { ...mockEntries[0]!, readingMinutes: null },
        { ...mockEntries[1]!, readingMinutes: null },
      ];
      const stats = useStats(entriesWithoutReading, [], mockTags);
      expect(stats.averageReadingMinutes.value).toBeNull();
    });

    it("should exclude null values from calculation", () => {
      const mixedEntries: DailyEntry[] = [
        mockEntries[0]!, // 30
        { ...mockEntries[1]!, readingMinutes: null }, // null
        mockEntries[2]!, // 20
      ];
      const stats = useStats(mixedEntries, [], mockTags);
      const expected = Math.round((30 + 20) / 2);
      expect(stats.averageReadingMinutes.value).toBe(expected);
    });
  });

  describe("averageCalories", () => {
    it("should calculate average calories", () => {
      const stats = useStats(mockEntries, [], mockTags);
      const expected = Math.round((2000 + 1800 + 2200) / 3);
      expect(stats.averageCalories.value).toBe(expected);
    });

    it("should return null when no valid entries", () => {
      const entriesWithoutCalories: DailyEntry[] = [
        { ...mockEntries[0]!, calories: null },
        { ...mockEntries[1]!, calories: null },
      ];
      const stats = useStats(entriesWithoutCalories, [], mockTags);
      expect(stats.averageCalories.value).toBeNull();
    });

    it("should exclude null values from calculation", () => {
      const mixedEntries: DailyEntry[] = [
        mockEntries[0]!, // 2000
        { ...mockEntries[1]!, calories: null }, // null
        mockEntries[2]!, // 2200
      ];
      const stats = useStats(mixedEntries, [], mockTags);
      const expected = Math.round((2000 + 2200) / 2);
      expect(stats.averageCalories.value).toBe(expected);
    });
  });

  describe("averageSleepHours", () => {
    it("should calculate average sleep hours", () => {
      const stats = useStats(mockEntries, [], mockTags);
      const result = parseFloat(stats.averageSleepHours.value!);
      expect(result).toBeCloseTo(8, 0); // All entries are 8 hours
    });

    it("should return null when no valid entries", () => {
      const entriesWithoutSleep: DailyEntry[] = [
        { ...mockEntries[0]!, bedTime: null, wakeTime: null },
      ];
      const stats = useStats(entriesWithoutSleep, [], mockTags);
      expect(stats.averageSleepHours.value).toBeNull();
    });

    it("should handle overnight sleep correctly", () => {
      const entriesWithOvernightSleep: DailyEntry[] = [
        { ...mockEntries[0]!, bedTime: "23:00", wakeTime: "07:00" }, // 8 hours
      ];
      const stats = useStats(entriesWithOvernightSleep, [], mockTags);
      expect(stats.averageSleepHours.value).toBe("8.0");
    });
  });

  describe("moodDistribution", () => {
    it("should count tag occurrences", () => {
      const stats = useStats(mockEntries, [], mockTags);
      const dist = stats.moodDistribution.value;
      expect(dist["1"]).toBe(2); // Tag 1 appears twice
      expect(dist["2"]).toBe(2); // Tag 2 appears twice
    });

    it("should handle multiple tags per entry", () => {
      const entryWithMultipleTags: DailyEntry[] = [
        { ...mockEntries[0]!, feelings: ["1", "2", "3"] },
      ];
      const stats = useStats(entryWithMultipleTags, [], mockTags);
      const dist = stats.moodDistribution.value;
      expect(dist["1"]).toBe(1);
      expect(dist["2"]).toBe(1);
      expect(dist["3"]).toBe(1);
    });

    it("should return empty object for entries without feelings", () => {
      const entriesWithoutFeelings: DailyEntry[] = [
        { ...mockEntries[0]!, feelings: [] },
      ];
      const stats = useStats(entriesWithoutFeelings, [], mockTags);
      const dist = stats.moodDistribution.value;
      expect(Object.keys(dist)).toHaveLength(0);
    });
  });

  describe("moodDistributionWithLabels", () => {
    it("should include tag details and percentages", () => {
      const stats = useStats(mockEntries, [], mockTags);
      const dist = stats.moodDistributionWithLabels.value;

      expect(dist).toHaveLength(2); // Only tags 1 and 2 are used
      const tag1Item = dist.find((item: any) => item.tag?.id === "1");
      expect(tag1Item?.count).toBe(2);
      expect(tag1Item?.percentage).toBe(Math.round((2 / 3) * 100));
    });
  });

  describe("goalsAchieved", () => {
    it("should count met goals", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      // Prayer: 2/2 ✓, Bible: 2/2 ✓, Custom: 2/2 ✓
      expect(stats.goalsAchieved.value).toBe(3);
    });

    it("should handle goals with different field types", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      expect(stats.goalsAchieved.value).toBe(3);
    });

    it("should return 0 when no goals are met", () => {
      const highGoals: Goal[] = [{ ...mockGoals[0]!, targetPerWeek: 10 }];
      const stats = useStats(mockEntries, highGoals, mockTags);
      expect(stats.goalsAchieved.value).toBe(0);
    });
  });

  describe("totalGoals", () => {
    it("should return total goal count", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      expect(stats.totalGoals.value).toBe(3);
    });

    it("should return 0 when no goals exist", () => {
      const stats = useStats(mockEntries, [], mockTags);
      expect(stats.totalGoals.value).toBe(0);
    });
  });

  describe("goalProgress", () => {
    it("should calculate progress for each goal", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      const progress = stats.goalProgress.value;

      expect(progress).toHaveLength(3);

      const prayerProgress = progress.find(
        (p: any) => p.goal.fieldKey === "didPray"
      );
      expect(prayerProgress?.count).toBe(2);
      expect(prayerProgress?.target).toBe(2);
      expect(prayerProgress?.achieved).toBe(true);
    });

    it("should show achieved status when target is met", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      const progress = stats.goalProgress.value;

      const achieved = progress.filter((p: any) => p.achieved);
      expect(achieved).toHaveLength(3);
    });

    it("should calculate percentage correctly", () => {
      const stats = useStats(mockEntries, mockGoals, mockTags);
      const progress = stats.goalProgress.value;

      const prayerProgress = progress.find(
        (p: any) => p.goal.fieldKey === "didPray"
      );
      expect(prayerProgress?.percentage).toBe(100);
    });

    it("should handle goals exceeding target", () => {
      const lowGoal: Goal[] = [{ ...mockGoals[0]!, targetPerWeek: 1 }];
      const stats = useStats(mockEntries, lowGoal, mockTags);
      const progress = stats.goalProgress.value;

      expect(progress[0]!.count).toBe(2); // Did it 2 times
      expect(progress[0]!.achieved).toBe(true); // Exceeds target of 1
    });

    it("should handle zero target gracefully", () => {
      const zeroGoal: Goal[] = [
        { ...mockGoals[0]!, targetPerWeek: 0, targetPerMonth: 0 },
      ];
      const stats = useStats(mockEntries, zeroGoal, mockTags);
      const progress = stats.goalProgress.value;

      expect(progress[0]!.percentage).toBe(0);
    });
  });
});
