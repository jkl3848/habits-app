<script setup lang="ts">
import { computed } from "vue";
import { useHabitsStore } from "../stores/habits";
import { calculateSleepHours, formatTime } from "../utils/dates";

const props = defineProps<{
  date: string;
}>();

const emit = defineEmits<{
  close: [];
}>();

const store = useHabitsStore();

const entry = computed(() => store.getEntry(props.date));

const feelings = computed(() => {
  if (!entry.value) return [];
  return entry.value.feelings
    .map((tagId) => store.tags.find((t) => t.id === tagId))
    .filter(Boolean);
});

const sleepHours = computed(() => {
  if (!entry.value?.bedTime || !entry.value?.wakeTime) return null;
  return calculateSleepHours(entry.value.bedTime, entry.value.wakeTime).toFixed(
    1
  );
});

const customCheckboxEntries = computed(() => {
  if (!entry.value) return [];
  return store.customCheckboxes
    .map((cb) => ({
      ...cb,
      checked: entry.value?.customCheckboxes[cb.id] || false,
    }))
    .filter((cb) => cb.checked);
});
</script>

<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50"
    @click.self="emit('close')"
  >
    <div
      class="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-y-auto animate-slide-up"
    >
      <!-- Header -->
      <div
        class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between"
      >
        <h2 class="text-xl font-bold text-gray-800">{{ date }}</h2>
        <button
          @click="emit('close')"
          class="p-2 hover:bg-gray-100 rounded-full transition"
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div v-if="entry" class="p-6 space-y-4">
        <!-- Feelings -->
        <div v-if="feelings.length > 0">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">How I felt</h3>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="feeling in feelings"
              :key="feeling?.id"
              class="px-3 py-1 rounded-full text-white text-sm font-medium"
              :style="{ backgroundColor: feeling?.color }"
            >
              {{ feeling?.text }}
            </span>
          </div>
        </div>

        <!-- Sleep -->
        <div v-if="entry.bedTime && entry.wakeTime">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Sleep</h3>
          <div class="bg-gray-50 rounded-lg p-3 space-y-1">
            <div class="flex justify-between">
              <span class="text-gray-600">Bed time:</span>
              <span class="font-medium">{{ formatTime(entry.bedTime) }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Wake time:</span>
              <span class="font-medium">{{ formatTime(entry.wakeTime) }}</span>
            </div>
            <div
              class="flex justify-between border-t border-gray-200 pt-1 mt-1"
            >
              <span class="text-gray-600">Total:</span>
              <span class="font-medium">{{ sleepHours }} hours</span>
            </div>
          </div>
        </div>

        <!-- Calories -->
        <div v-if="entry.calories !== null">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Nutrition</h3>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between mb-2">
              <span class="text-gray-600">Calories:</span>
              <span class="font-medium">{{ entry.calories }}</span>
            </div>
            <div v-if="entry.foodsEaten" class="text-sm text-gray-700">
              {{ entry.foodsEaten }}
            </div>
          </div>
        </div>

        <!-- Reading -->
        <div v-if="entry.readingMinutes !== null">
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Reading</h3>
          <div class="bg-gray-50 rounded-lg p-3">
            <span class="font-medium">{{ entry.readingMinutes }} minutes</span>
          </div>
        </div>

        <!-- Activities -->
        <div
          v-if="
            entry.didPray ||
            entry.didReadBible ||
            customCheckboxEntries.length > 0
          "
        >
          <h3 class="text-sm font-semibold text-gray-600 mb-2">Activities</h3>
          <div class="space-y-2">
            <div v-if="entry.didPray" class="flex items-center text-gray-700">
              <svg
                class="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Prayed
            </div>
            <div
              v-if="entry.didReadBible"
              class="flex items-center text-gray-700"
            >
              <svg
                class="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Read the Bible
            </div>
            <div
              v-for="cb in customCheckboxEntries"
              :key="cb.id"
              class="flex items-center text-gray-700"
            >
              <svg
                class="w-5 h-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ cb.text }}
            </div>
          </div>
        </div>
      </div>

      <div v-else class="p-6 text-center text-gray-500">
        No entry for this date
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}
</style>
