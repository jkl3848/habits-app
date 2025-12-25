<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useHabitsStore } from "../stores/habits";
import { getTodayString, formatDate } from "../utils/dates";
import type { DailyEntry } from "../types";

const store = useHabitsStore();
const today = getTodayString();

const feelings = ref<string[]>([]);
const bedTime = ref<string>("");
const wakeTime = ref<string>("");
const calories = ref<number | null>(null);
const foodsEaten = ref<string>("");
const readingMinutes = ref<number | null>(null);
const didPray = ref(false);
const didReadBible = ref(false);
const customCheckboxes = ref<Record<string, boolean>>({});

const isSaved = ref(false);
const showSuccess = ref(false);

const enabledCustomCheckboxes = computed(() => store.customCheckboxes);

onMounted(() => {
  // Load today's entry if it exists
  const existingEntry = store.getEntry(today);
  if (existingEntry) {
    feelings.value = [...existingEntry.feelings];
    bedTime.value = existingEntry.bedTime || "";
    wakeTime.value = existingEntry.wakeTime || "";
    calories.value = existingEntry.calories;
    foodsEaten.value = existingEntry.foodsEaten;
    readingMinutes.value = existingEntry.readingMinutes;
    didPray.value = existingEntry.didPray;
    didReadBible.value = existingEntry.didReadBible;
    customCheckboxes.value = { ...existingEntry.customCheckboxes };
    isSaved.value = true;
  } else {
    // Initialize custom checkboxes
    enabledCustomCheckboxes.value.forEach((cb) => {
      customCheckboxes.value[cb.id] = false;
    });
  }
});

function toggleFeeling(tagId: string) {
  const index = feelings.value.indexOf(tagId);
  if (index >= 0) {
    feelings.value.splice(index, 1);
  } else {
    feelings.value.push(tagId);
  }
}

async function saveEntry() {
  const entry: DailyEntry = {
    id: `entry-${today}`,
    date: today,
    feelings: feelings.value,
    bedTime: bedTime.value || null,
    wakeTime: wakeTime.value || null,
    calories: calories.value,
    foodsEaten: foodsEaten.value,
    readingMinutes: readingMinutes.value,
    didPray: didPray.value,
    didReadBible: didReadBible.value,
    customCheckboxes: customCheckboxes.value,
  };

  await store.saveEntry(entry);
  isSaved.value = true;
  showSuccess.value = true;
  setTimeout(() => {
    showSuccess.value = false;
  }, 2000);
}
</script>

<template>
  <div class="pb-20 max-w-lg mx-auto">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
      <h1 class="text-2xl font-bold">Today's Entry</h1>
      <p class="text-blue-100 mt-1">{{ formatDate(new Date(today)) }}</p>
    </div>

    <!-- Success Message -->
    <transition name="fade">
      <div
        v-if="showSuccess"
        class="mx-4 mt-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow"
      >
        ✓ Entry saved successfully!
      </div>
    </transition>

    <!-- Form -->
    <form @submit.prevent="saveEntry" class="p-4 space-y-6">
      <!-- Feelings -->
      <div v-if="store.enabledFields.feelings">
        <label class="block text-sm font-semibold text-gray-700 mb-3"
          >Today I felt</label
        >
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tag in store.tags"
            :key="tag.id"
            type="button"
            @click="toggleFeeling(tag.id)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all"
            :class="
              feelings.includes(tag.id)
                ? 'ring-2 ring-offset-2 shadow-md scale-105'
                : 'opacity-70 hover:opacity-100'
            "
            :style="{
              backgroundColor: tag.color,
              color: '#fff',
              '--tw-ring-color': feelings.includes(tag.id)
                ? tag.color
                : 'transparent',
            }"
          >
            {{ tag.text }}
          </button>
        </div>
      </div>

      <!-- Sleep -->
      <div v-if="store.enabledFields.sleep" class="space-y-4">
        <div>
          <label
            for="bedTime"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            I went to bed at
          </label>
          <input
            id="bedTime"
            v-model="bedTime"
            type="time"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            for="wakeTime"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            I woke up at
          </label>
          <input
            id="wakeTime"
            v-model="wakeTime"
            type="time"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Calories -->
      <div v-if="store.enabledFields.calories" class="space-y-4">
        <div>
          <label
            for="calories"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            Today I ate (calories)
          </label>
          <input
            id="calories"
            v-model.number="calories"
            type="number"
            placeholder="0"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label
            for="foods"
            class="block text-sm font-semibold text-gray-700 mb-2"
          >
            Foods eaten
          </label>
          <textarea
            id="foods"
            v-model="foodsEaten"
            rows="3"
            placeholder="What did you eat today?"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <!-- Reading -->
      <div v-if="store.enabledFields.reading">
        <label
          for="reading"
          class="block text-sm font-semibold text-gray-700 mb-2"
        >
          Today I read for (minutes)
        </label>
        <input
          id="reading"
          v-model.number="readingMinutes"
          type="number"
          placeholder="0"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <!-- Prayer -->
      <div v-if="store.enabledFields.prayer" class="flex items-center">
        <input
          id="prayer"
          v-model="didPray"
          type="checkbox"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="prayer" class="ml-3 text-sm font-semibold text-gray-700">
          I prayed today
        </label>
      </div>

      <!-- Bible -->
      <div v-if="store.enabledFields.bible" class="flex items-center">
        <input
          id="bible"
          v-model="didReadBible"
          type="checkbox"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label for="bible" class="ml-3 text-sm font-semibold text-gray-700">
          I read the Bible today
        </label>
      </div>

      <!-- Custom Checkboxes -->
      <div
        v-for="checkbox in enabledCustomCheckboxes"
        :key="checkbox.id"
        class="flex items-center"
      >
        <input
          :id="checkbox.id"
          v-model="customCheckboxes[checkbox.id]"
          type="checkbox"
          class="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          :for="checkbox.id"
          class="ml-3 text-sm font-semibold text-gray-700"
        >
          {{ checkbox.text }}
        </label>
      </div>

      <!-- Save Button -->
      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
      >
        {{ isSaved ? "Update Entry" : "Save Entry" }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
