<script setup lang="ts">
import { ref, computed } from "vue";
import { useHabitsStore } from "../stores/habits";
import {
  getWeekStart,
  getWeekDates,
  formatDate,
  getDayName,
} from "../utils/dates";
import DayDetailModal from "../components/DayDetailModal.vue";

const store = useHabitsStore();

const currentWeekStart = ref(getWeekStart(new Date()));
const selectedDate = ref<string | null>(null);

const weekDates = computed(() => getWeekDates(currentWeekStart.value));

const weekEntries = computed(() => {
  return weekDates.value.map((date) => {
    const dateStr = formatDate(date);
    const entry = store.getEntry(dateStr);
    return {
      date: dateStr,
      dayName: getDayName(date),
      entry,
      feelings: entry
        ? entry.feelings.map((tagId) => store.tags.find((t) => t.id === tagId))
        : [],
    };
  });
});

function previousWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() - 7);
  currentWeekStart.value = newDate;
}

function nextWeek() {
  const newDate = new Date(currentWeekStart.value);
  newDate.setDate(newDate.getDate() + 7);
  currentWeekStart.value = newDate;
}

function currentWeek() {
  currentWeekStart.value = getWeekStart(new Date());
}

function openDayDetail(dateStr: string) {
  selectedDate.value = dateStr;
}

function closeDayDetail() {
  selectedDate.value = null;
}
</script>

<template>
  <div class="pb-20 max-w-lg mx-auto">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
      <h1 class="text-2xl font-bold">Week Overview</h1>
      <div class="flex items-center justify-between mt-4">
        <button
          @click="previousWeek"
          class="p-2 hover:bg-blue-500 rounded-lg transition"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          @click="currentWeek"
          class="text-sm px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition"
        >
          This Week
        </button>

        <button
          @click="nextWeek"
          class="p-2 hover:bg-blue-500 rounded-lg transition"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Week Grid -->
    <div class="p-4 space-y-3">
      <div
        v-for="day in weekEntries"
        :key="day.date"
        @click="openDayDetail(day.date)"
        class="bg-white rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition"
      >
        <div class="flex items-center justify-between">
          <div>
            <div class="text-sm text-gray-500">{{ day.dayName }}</div>
            <div class="font-semibold text-gray-800">{{ day.date }}</div>
          </div>

          <div class="flex gap-2">
            <div v-if="day.entry" class="flex gap-1">
              <span
                v-for="feeling in day.feelings"
                :key="feeling?.id"
                class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shadow"
                :style="{ backgroundColor: feeling?.color }"
              >
                {{ feeling?.text[0] }}
              </span>
            </div>
            <div v-else class="text-gray-400 text-sm">No entry</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Day Detail Modal -->
    <DayDetailModal
      v-if="selectedDate"
      :date="selectedDate"
      @close="closeDayDetail"
    />
  </div>
</template>
