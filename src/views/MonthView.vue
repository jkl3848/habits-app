<script setup lang="ts">
import { ref, computed } from "vue";
import { useHabitsStore } from "../stores/habits";
import { getMonthDates, formatDate, getMonthYear } from "../utils/dates";
import DayDetailModal from "../components/DayDetailModal.vue";

const store = useHabitsStore();

const currentYear = ref(new Date().getFullYear());
const currentMonth = ref(new Date().getMonth());
const selectedDate = ref<string | null>(null);

const monthDates = computed(() =>
  getMonthDates(currentYear.value, currentMonth.value)
);

const monthTitle = computed(() => {
  const date = new Date(currentYear.value, currentMonth.value, 1);
  return getMonthYear(date);
});

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  const startDay = firstDay.getDay();

  // Pad with empty days before the first day of month
  const days = Array(startDay).fill(null);

  // Add all days of the month
  monthDates.value.forEach((date) => {
    const dateStr = formatDate(date);
    const entry = store.getEntry(dateStr);
    const feelings = entry
      ? entry.feelings.map((tagId) => store.tags.find((t) => t.id === tagId))
      : [];

    days.push({
      date: dateStr,
      dayNumber: date.getDate(),
      entry,
      feelings: feelings.filter(Boolean),
    });
  });

  return days;
});

function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}

function currentMonthView() {
  currentYear.value = new Date().getFullYear();
  currentMonth.value = new Date().getMonth();
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
      <h1 class="text-2xl font-bold">Month Overview</h1>
      <div class="flex items-center justify-between mt-4">
        <button
          @click="previousMonth"
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
          @click="currentMonthView"
          class="text-sm px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-400 transition"
        >
          {{ monthTitle }}
        </button>

        <button
          @click="nextMonth"
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

    <!-- Calendar -->
    <div class="p-4">
      <!-- Day headers -->
      <div class="grid grid-cols-7 gap-2 mb-2">
        <div class="text-center text-xs font-semibold text-gray-600">Sun</div>
        <div class="text-center text-xs font-semibold text-gray-600">Mon</div>
        <div class="text-center text-xs font-semibold text-gray-600">Tue</div>
        <div class="text-center text-xs font-semibold text-gray-600">Wed</div>
        <div class="text-center text-xs font-semibold text-gray-600">Thu</div>
        <div class="text-center text-xs font-semibold text-gray-600">Fri</div>
        <div class="text-center text-xs font-semibold text-gray-600">Sat</div>
      </div>

      <!-- Calendar grid -->
      <div class="grid grid-cols-7 gap-2">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          class="aspect-square"
        >
          <div
            v-if="day"
            @click="openDayDetail(day.date)"
            class="w-full h-full bg-white rounded-lg shadow-sm flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition p-1"
          >
            <div class="text-sm font-semibold text-gray-800">
              {{ day.dayNumber }}
            </div>
            <div class="flex gap-0.5 mt-1">
              <div
                v-for="feeling in day.feelings.slice(0, 3)"
                :key="feeling?.id"
                class="w-2 h-2 rounded-full"
                :style="{ backgroundColor: feeling?.color }"
              />
            </div>
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
