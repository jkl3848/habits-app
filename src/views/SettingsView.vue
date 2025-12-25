<script setup lang="ts">
import { ref, computed } from "vue";
import { useHabitsStore } from "../stores/habits";
import { useNotifications } from "../composables/useNotifications";
import type { Tag, CustomCheckbox, Goal } from "../types";

const store = useHabitsStore();
const notifications = useNotifications();

// Active section
const activeSection = ref<
  "tags" | "fields" | "checkboxes" | "goals" | "reminder"
>("fields");

// Tag management
const showTagModal = ref(false);
const editingTag = ref<Tag | null>(null);
const tagText = ref("");
const tagColor = ref("#3b82f6");

// Custom checkbox management
const showCheckboxModal = ref(false);
const editingCheckbox = ref<CustomCheckbox | null>(null);
const checkboxText = ref("");

// Goal management
const showGoalModal = ref(false);
const editingGoal = ref<Goal | null>(null);
const goalFieldKey = ref("");
const goalLabel = ref("");
const goalTargetWeek = ref<number | null>(null);
const goalTargetMonth = ref<number | null>(null);

// Available fields for goals
const availableFields = computed(() => {
  const fields = [];
  if (store.enabledFields.prayer)
    fields.push({ key: "didPray", label: "Prayer" });
  if (store.enabledFields.bible)
    fields.push({ key: "didReadBible", label: "Bible Reading" });
  store.customCheckboxes
    .filter((cb) => cb.enabled)
    .forEach((cb) => {
      fields.push({ key: cb.id, label: cb.text });
    });
  return fields;
});

// Reminder time
const reminderTime = computed({
  get: () => store.settings.reminderTime,
  set: async (value: string) => {
    await store.updateSettings({ reminderTime: value });
    // Schedule notification with new time
    await notifications.scheduleDailyReminder(value);
  },
});

// Field toggles
async function toggleField(field: keyof typeof store.settings.fieldsEnabled) {
  const newValue = !store.enabledFields[field];
  await store.updateSettings({
    fieldsEnabled: {
      ...store.settings.fieldsEnabled,
      [field]: newValue,
    },
  });
}

// Tag methods
function openTagModal(tag?: Tag) {
  if (tag) {
    editingTag.value = tag;
    tagText.value = tag.text;
    tagColor.value = tag.color;
  } else {
    editingTag.value = null;
    tagText.value = "";
    tagColor.value = "#3b82f6";
  }
  showTagModal.value = true;
}

function closeTagModal() {
  showTagModal.value = false;
  editingTag.value = null;
  tagText.value = "";
  tagColor.value = "#3b82f6";
}

async function saveTag() {
  if (!tagText.value.trim()) return;

  if (editingTag.value) {
    await store.updateTag(editingTag.value.id, {
      text: tagText.value.trim(),
      color: tagColor.value,
    });
  } else {
    await store.addTag({
      id: Date.now().toString(),
      text: tagText.value.trim(),
      color: tagColor.value,
    });
  }
  closeTagModal();
}

async function deleteTag(tagId: string) {
  if (confirm("Are you sure you want to delete this tag?")) {
    await store.deleteTag(tagId);
  }
}

// Checkbox methods
function openCheckboxModal(checkbox?: CustomCheckbox) {
  if (checkbox) {
    editingCheckbox.value = checkbox;
    checkboxText.value = checkbox.text;
  } else {
    editingCheckbox.value = null;
    checkboxText.value = "";
  }
  showCheckboxModal.value = true;
}

function closeCheckboxModal() {
  showCheckboxModal.value = false;
  editingCheckbox.value = null;
  checkboxText.value = "";
}

async function saveCheckbox() {
  if (!checkboxText.value.trim()) return;

  if (editingCheckbox.value) {
    await store.updateCustomCheckbox(editingCheckbox.value.id, {
      text: checkboxText.value.trim(),
    });
  } else {
    await store.addCustomCheckbox({
      id: Date.now().toString(),
      text: checkboxText.value.trim(),
      enabled: true,
    });
  }
  closeCheckboxModal();
}

async function toggleCheckbox(checkboxId: string, enabled: boolean) {
  await store.updateCustomCheckbox(checkboxId, { enabled });
}

async function deleteCheckbox(checkboxId: string) {
  if (confirm("Are you sure you want to delete this custom checkbox?")) {
    await store.deleteCustomCheckbox(checkboxId);
  }
}

// Goal methods
function openGoalModal(goal?: Goal) {
  if (goal) {
    editingGoal.value = goal;
    goalFieldKey.value = goal.fieldKey;
    goalLabel.value = goal.label;
    goalTargetWeek.value = goal.targetPerWeek;
    goalTargetMonth.value = goal.targetPerMonth;
  } else {
    editingGoal.value = null;
    goalFieldKey.value = "";
    goalLabel.value = "";
    goalTargetWeek.value = null;
    goalTargetMonth.value = null;
  }
  showGoalModal.value = true;
}

function closeGoalModal() {
  showGoalModal.value = false;
  editingGoal.value = null;
  goalFieldKey.value = "";
  goalLabel.value = "";
  goalTargetWeek.value = null;
  goalTargetMonth.value = null;
}

async function saveGoal() {
  if (!goalFieldKey.value || !goalLabel.value.trim()) return;
  if (goalTargetWeek.value === null && goalTargetMonth.value === null) return;

  if (editingGoal.value) {
    await store.updateGoal(editingGoal.value.id, {
      fieldKey: goalFieldKey.value,
      label: goalLabel.value.trim(),
      targetPerWeek: goalTargetWeek.value,
      targetPerMonth: goalTargetMonth.value,
    });
  } else {
    await store.addGoal({
      id: Date.now().toString(),
      fieldKey: goalFieldKey.value,
      label: goalLabel.value.trim(),
      targetPerWeek: goalTargetWeek.value,
      targetPerMonth: goalTargetMonth.value,
    });
  }
  closeGoalModal();
}

async function deleteGoal(goalId: string) {
  if (confirm("Are you sure you want to delete this goal?")) {
    await store.deleteGoal(goalId);
  }
}
</script>

<template>
  <div class="pb-20 max-w-lg mx-auto">
    <!-- Header -->
    <div class="bg-blue-600 text-white p-6 rounded-b-3xl shadow-lg">
      <h1 class="text-2xl font-bold">Settings</h1>
      <p class="text-blue-100 mt-1">Customize your tracking</p>
    </div>

    <!-- Section tabs -->
    <div class="px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto">
      <div class="flex gap-2 min-w-max">
        <button
          @click="activeSection = 'fields'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="
            activeSection === 'fields'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
        >
          Fields
        </button>
        <button
          @click="activeSection = 'tags'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="
            activeSection === 'tags'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
        >
          Mood Tags
        </button>
        <button
          @click="activeSection = 'checkboxes'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="
            activeSection === 'checkboxes'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
        >
          Custom Items
        </button>
        <button
          @click="activeSection = 'goals'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="
            activeSection === 'goals'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
        >
          Goals
        </button>
        <button
          @click="activeSection = 'reminder'"
          class="px-4 py-2 rounded-lg text-sm font-medium transition"
          :class="
            activeSection === 'reminder'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          "
        >
          Reminder
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Fields Section -->
      <div v-if="activeSection === 'fields'" class="space-y-3">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold text-gray-800 mb-3">
            Enable/Disable Fields
          </h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-gray-700">How I felt</span>
              <button
                @click="toggleField('feelings')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.feelings ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.feelings
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Sleep tracking</span>
              <button
                @click="toggleField('sleep')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.sleep ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.sleep
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Calories & food</span>
              <button
                @click="toggleField('calories')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.calories ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.calories
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Reading minutes</span>
              <button
                @click="toggleField('reading')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.reading ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.reading
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Prayer</span>
              <button
                @click="toggleField('prayer')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.prayer ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.prayer
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-gray-700">Bible reading</span>
              <button
                @click="toggleField('bible')"
                class="w-12 h-6 rounded-full transition"
                :class="
                  store.enabledFields.bible ? 'bg-blue-600' : 'bg-gray-300'
                "
              >
                <div
                  class="w-5 h-5 bg-white rounded-full shadow transition transform"
                  :class="
                    store.enabledFields.bible
                      ? 'translate-x-6'
                      : 'translate-x-0.5'
                  "
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div v-if="activeSection === 'tags'" class="space-y-3">
        <button
          @click="openTagModal()"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          + Add New Tag
        </button>

        <div
          v-for="tag in store.tags"
          :key="tag.id"
          class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 rounded-full"
              :style="{ backgroundColor: tag.color }"
            />
            <span class="font-medium text-gray-800">{{ tag.text }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="openTagModal(tag)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="deleteTag(tag.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Custom Checkboxes Section -->
      <div v-if="activeSection === 'checkboxes'" class="space-y-3">
        <button
          @click="openCheckboxModal()"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          + Add Custom Item
        </button>

        <div
          v-for="checkbox in store.settings.customCheckboxes"
          :key="checkbox.id"
          class="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between"
        >
          <div class="flex items-center gap-3">
            <input
              type="checkbox"
              :checked="checkbox.enabled"
              @change="toggleCheckbox(checkbox.id, !checkbox.enabled)"
              class="w-5 h-5 text-blue-600 border-gray-300 rounded"
            />
            <span class="font-medium text-gray-800">{{ checkbox.text }}</span>
          </div>
          <div class="flex gap-2">
            <button
              @click="openCheckboxModal(checkbox)"
              class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              @click="deleteCheckbox(checkbox.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Goals Section -->
      <div v-if="activeSection === 'goals'" class="space-y-3">
        <button
          @click="openGoalModal()"
          class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          + Add New Goal
        </button>

        <div
          v-for="goal in store.goals"
          :key="goal.id"
          class="bg-white rounded-xl shadow-sm p-4"
        >
          <div class="flex items-start justify-between mb-2">
            <div>
              <div class="font-medium text-gray-800">{{ goal.label }}</div>
              <div class="text-sm text-gray-600 mt-1">
                <span v-if="goal.targetPerWeek"
                  >{{ goal.targetPerWeek }}x per week</span
                >
                <span v-if="goal.targetPerWeek && goal.targetPerMonth">
                  •
                </span>
                <span v-if="goal.targetPerMonth"
                  >{{ goal.targetPerMonth }}x per month</span
                >
              </div>
            </div>
            <div class="flex gap-2">
              <button
                @click="openGoalModal(goal)"
                class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                @click="deleteGoal(goal.id)"
                class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Reminder Section -->
      <div v-if="activeSection === 'reminder'" class="space-y-3">
        <div class="bg-white rounded-xl shadow-sm p-4">
          <h3 class="font-semibold text-gray-800 mb-3">Daily Reminder Time</h3>
          <input
            v-model="reminderTime"
            type="time"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p class="text-sm text-gray-600 mt-2">
            You'll receive a notification at this time each day to fill out your
            entry.
          </p>
        </div>
      </div>
    </div>

    <!-- Tag Modal -->
    <div
      v-if="showTagModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeTagModal"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ editingTag ? "Edit Tag" : "New Tag" }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Tag Text</label
            >
            <input
              v-model="tagText"
              type="text"
              placeholder="e.g., Happy"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Color</label
            >
            <input
              v-model="tagColor"
              type="color"
              class="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="closeTagModal"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              @click="saveTag"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkbox Modal -->
    <div
      v-if="showCheckboxModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeCheckboxModal"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ editingCheckbox ? "Edit Item" : "New Item" }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Item Text</label
            >
            <input
              v-model="checkboxText"
              type="text"
              placeholder="e.g., Today I exercised"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="closeCheckboxModal"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              @click="saveCheckbox"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Goal Modal -->
    <div
      v-if="showGoalModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeGoalModal"
    >
      <div class="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-4">
          {{ editingGoal ? "Edit Goal" : "New Goal" }}
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Activity</label
            >
            <select
              v-model="goalFieldKey"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select an activity</option>
              <option
                v-for="field in availableFields"
                :key="field.key"
                :value="field.key"
              >
                {{ field.label }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Goal Label</label
            >
            <input
              v-model="goalLabel"
              type="text"
              placeholder="e.g., Pray regularly"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Target per Week</label
            >
            <input
              v-model.number="goalTargetWeek"
              type="number"
              placeholder="e.g., 5"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2"
              >Target per Month</label
            >
            <input
              v-model.number="goalTargetMonth"
              type="number"
              placeholder="e.g., 20"
              min="0"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="closeGoalModal"
              class="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              @click="saveGoal"
              class="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
