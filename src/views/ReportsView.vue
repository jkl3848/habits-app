<script setup lang="ts">
import { computed } from "vue";
import { useHabitsStore } from "../stores/habits";
import { useStats } from "../composables/useStats";
import { getWeekStart, getWeekEnd, formatDate } from "../utils/dates";

const store = useHabitsStore();

const weekStart = getWeekStart(new Date());
const weekEnd = getWeekEnd(new Date());
const weekStartStr = formatDate(weekStart);
const weekEndStr = formatDate(weekEnd);

const weekEntries = computed(() =>
  store.getEntriesInRange(weekStartStr, weekEndStr)
);

const weekStats = useStats(weekEntries.value, store.goals, store.tags);

const monthStart = computed(() => {
  const now = new Date();
  return formatDate(new Date(now.getFullYear(), now.getMonth(), 1));
});

const monthEnd = computed(() => {
  const now = new Date();
  return formatDate(new Date(now.getFullYear(), now.getMonth() + 1, 0));
});

const monthEntries = computed(() =>
  store.getEntriesInRange(monthStart.value, monthEnd.value)
);

const monthStats = useStats(monthEntries.value, store.goals, store.tags);

function getEncouragementMessage(
  goalsAchieved: number,
  totalGoals: number
): string {
  if (totalGoals === 0)
    return "Set some goals to start tracking your progress!";

  const percentage = (goalsAchieved / totalGoals) * 100;

  if (percentage === 100)
    return "Outstanding! You've achieved all your goals! 🌟";
  if (percentage >= 75) return "Excellent work! You're crushing your goals! 💪";
  if (percentage >= 50) return "Great progress! Keep up the good work! 🎯";
  if (percentage >= 25) return "Nice start! You're on the right track! 🌱";
  return "Every journey starts with a single step. You've got this! 💪";
}

function getTrendMessage(stats: any): string {
  const messages: string[] = [];

  if (
    stats.averageReadingMinutes.value &&
    stats.averageReadingMinutes.value > 20
  ) {
    messages.push("📚 Your reading habit is fantastic!");
  }

  if (
    stats.averageSleepHours.value &&
    parseFloat(stats.averageSleepHours.value) >= 7
  ) {
    messages.push("😴 You're getting great sleep!");
  }

  if (stats.totalEntries.value >= 5) {
    messages.push("✍️ You're consistent with your tracking!");
  }

  return messages.length > 0
    ? messages.join(" ")
    : "Keep building positive habits!";
}
</script>

<template>
  <div class="pb-20 max-w-lg mx-auto">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
      <h1 class="text-2xl font-bold">Your Progress</h1>
      <p class="text-blue-100 mt-1">Keep up the great work!</p>
    </div>

    <div class="p-4 space-y-6">
      <!-- Weekly Report -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">This Week</h2>

        <!-- Entries count -->
        <div class="mb-4">
          <div class="text-sm text-gray-600">Entries logged</div>
          <div class="text-3xl font-bold text-blue-600">
            {{ weekStats.totalEntries.value }}/7
          </div>
        </div>

        <!-- Goals -->
        <div v-if="store.goals.length > 0" class="mb-4">
          <div class="text-sm text-gray-600 mb-2">Goals achieved</div>
          <div class="flex items-center gap-3 mb-2">
            <div class="text-2xl font-bold text-green-600">
              {{ weekStats.goalsAchieved.value }}/{{
                weekStats.totalGoals.value
              }}
            </div>
            <div class="flex-1 bg-gray-200 rounded-full h-3">
              <div
                class="bg-green-500 h-3 rounded-full transition-all"
                :style="{
                  width: `${
                    (weekStats.goalsAchieved.value /
                      weekStats.totalGoals.value) *
                    100
                  }%`,
                }"
              />
            </div>
          </div>
          <div class="text-sm text-gray-700 italic">
            {{
              getEncouragementMessage(
                weekStats.goalsAchieved.value,
                weekStats.totalGoals.value
              )
            }}
          </div>
        </div>

        <!-- Goal Progress Details -->
        <div
          v-if="weekStats.goalProgress.value.length > 0"
          class="space-y-3 mb-4"
        >
          <div
            v-for="progress in weekStats.goalProgress.value"
            :key="progress.goal.id"
            class="bg-gray-50 rounded-lg p-3"
          >
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-semibold text-gray-700">{{
                progress.goal.label
              }}</span>
              <span
                class="text-sm font-medium"
                :class="progress.achieved ? 'text-green-600' : 'text-gray-600'"
              >
                {{ progress.count }}/{{ progress.target }}
              </span>
            </div>
            <div class="bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all"
                :class="progress.achieved ? 'bg-green-500' : 'bg-blue-500'"
                :style="{ width: `${Math.min(progress.percentage, 100)}%` }"
              />
            </div>
          </div>
        </div>

        <!-- Averages -->
        <div class="space-y-2 pt-4 border-t border-gray-200">
          <div
            v-if="weekStats.averageReadingMinutes.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg reading</span>
            <span class="font-semibold"
              >{{ weekStats.averageReadingMinutes.value }} min</span
            >
          </div>
          <div
            v-if="weekStats.averageCalories.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg calories</span>
            <span class="font-semibold">{{
              weekStats.averageCalories.value
            }}</span>
          </div>
          <div
            v-if="weekStats.averageSleepHours.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg sleep</span>
            <span class="font-semibold"
              >{{ weekStats.averageSleepHours.value }} hrs</span
            >
          </div>
        </div>

        <!-- Mood Distribution -->
        <div
          v-if="weekStats.moodDistributionWithLabels.value.length > 0"
          class="pt-4 border-t border-gray-200 mt-4"
        >
          <div class="text-sm font-semibold text-gray-600 mb-3">
            How you felt
          </div>
          <div class="space-y-2">
            <div
              v-for="item in weekStats.moodDistributionWithLabels.value"
              :key="item.tag?.id"
              class="flex items-center gap-3"
            >
              <div
                class="w-4 h-4 rounded-full"
                :style="{ backgroundColor: item.tag?.color }"
              />
              <div class="flex-1 flex items-center gap-2">
                <span class="text-sm text-gray-700">{{ item.tag?.text }}</span>
                <div class="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    class="h-2 rounded-full"
                    :style="{
                      width: `${item.percentage}%`,
                      backgroundColor: item.tag?.color,
                    }"
                  />
                </div>
                <span class="text-xs text-gray-500">{{ item.count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Trend message -->
        <div class="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
          {{ getTrendMessage(weekStats) }}
        </div>
      </div>

      <!-- Monthly Report -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">This Month</h2>

        <!-- Entries count -->
        <div class="mb-4">
          <div class="text-sm text-gray-600">Entries logged</div>
          <div class="text-3xl font-bold text-purple-600">
            {{ monthStats.totalEntries.value }}
          </div>
        </div>

        <!-- Goals -->
        <div v-if="store.goals.length > 0" class="mb-4">
          <div class="text-sm text-gray-600 mb-2">Goals achieved</div>
          <div class="flex items-center gap-3 mb-2">
            <div class="text-2xl font-bold text-green-600">
              {{ monthStats.goalsAchieved.value }}/{{
                monthStats.totalGoals.value
              }}
            </div>
            <div class="flex-1 bg-gray-200 rounded-full h-3">
              <div
                class="bg-green-500 h-3 rounded-full transition-all"
                :style="{
                  width: `${
                    (monthStats.goalsAchieved.value /
                      monthStats.totalGoals.value) *
                    100
                  }%`,
                }"
              />
            </div>
          </div>
        </div>

        <!-- Averages -->
        <div class="space-y-2 pt-4 border-t border-gray-200">
          <div
            v-if="monthStats.averageReadingMinutes.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg reading</span>
            <span class="font-semibold"
              >{{ monthStats.averageReadingMinutes.value }} min</span
            >
          </div>
          <div
            v-if="monthStats.averageCalories.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg calories</span>
            <span class="font-semibold">{{
              monthStats.averageCalories.value
            }}</span>
          </div>
          <div
            v-if="monthStats.averageSleepHours.value !== null"
            class="flex justify-between"
          >
            <span class="text-gray-600">Avg sleep</span>
            <span class="font-semibold"
              >{{ monthStats.averageSleepHours.value }} hrs</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
