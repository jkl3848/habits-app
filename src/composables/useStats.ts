import { computed } from "vue";
import type { DailyEntry, Goal, Tag } from "../types";
import { calculateSleepHours } from "../utils/dates";

export function useStats(entries: DailyEntry[], goals: Goal[], tags: Tag[]) {
  const totalEntries = computed(() => entries.length);

  const averageReadingMinutes = computed(() => {
    const validEntries = entries.filter((e) => e.readingMinutes !== null);
    if (validEntries.length === 0) return null;
    const sum = validEntries.reduce(
      (acc, e) => acc + (e.readingMinutes || 0),
      0
    );
    return Math.round(sum / validEntries.length);
  });

  const averageCalories = computed(() => {
    const validEntries = entries.filter((e) => e.calories !== null);
    if (validEntries.length === 0) return null;
    const sum = validEntries.reduce((acc, e) => acc + (e.calories || 0), 0);
    return Math.round(sum / validEntries.length);
  });

  const averageSleepHours = computed(() => {
    const validEntries = entries.filter((e) => e.bedTime && e.wakeTime);
    if (validEntries.length === 0) return null;
    const sum = validEntries.reduce((acc, e) => {
      if (e.bedTime && e.wakeTime) {
        return acc + calculateSleepHours(e.bedTime, e.wakeTime);
      }
      return acc;
    }, 0);
    return (sum / validEntries.length).toFixed(1);
  });

  const moodDistribution = computed(() => {
    const distribution: Record<string, number> = {};
    entries.forEach((entry) => {
      entry.feelings.forEach((tagId) => {
        distribution[tagId] = (distribution[tagId] || 0) + 1;
      });
    });
    return distribution;
  });

  const moodDistributionWithLabels = computed(() => {
    const dist = moodDistribution.value;
    return Object.entries(dist).map(([tagId, count]) => {
      const tag = tags.find((t) => t.id === tagId);
      return {
        tag,
        count,
        percentage: Math.round((count / totalEntries.value) * 100),
      };
    });
  });

  const goalsAchieved = computed(() => {
    let achieved = 0;
    goals.forEach((goal) => {
      let count = 0;
      entries.forEach((entry) => {
        if (goal.fieldKey === "didPray" && entry.didPray) count++;
        else if (goal.fieldKey === "didReadBible" && entry.didReadBible)
          count++;
        else if (entry.customCheckboxes[goal.fieldKey]) count++;
      });

      const targetCount = goal.targetPerWeek || goal.targetPerMonth || 0;
      if (count >= targetCount) achieved++;
    });
    return achieved;
  });

  const totalGoals = computed(() => goals.length);

  const goalProgress = computed(() => {
    return goals.map((goal) => {
      let count = 0;
      entries.forEach((entry) => {
        if (goal.fieldKey === "didPray" && entry.didPray) count++;
        else if (goal.fieldKey === "didReadBible" && entry.didReadBible)
          count++;
        else if (entry.customCheckboxes[goal.fieldKey]) count++;
      });

      const target = goal.targetPerWeek || goal.targetPerMonth || 0;
      return {
        goal,
        count,
        target,
        percentage: target > 0 ? Math.round((count / target) * 100) : 0,
        achieved: count >= target,
      };
    });
  });

  return {
    totalEntries,
    averageReadingMinutes,
    averageCalories,
    averageSleepHours,
    moodDistribution,
    moodDistributionWithLabels,
    goalsAchieved,
    totalGoals,
    goalProgress,
  };
}
