<script setup lang="ts">
import { onMounted } from "vue";
import { useHabitsStore } from "./stores/habits";
import { useNotifications } from "./composables/useNotifications";
import NavigationBar from "./components/NavigationBar.vue";

const store = useHabitsStore();
const notifications = useNotifications();

onMounted(async () => {
  await store.initialize();

  // Schedule daily reminder notification
  if (notifications.isNativePlatform) {
    await notifications.scheduleDailyReminder(store.settings.reminderTime);
  }
});
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <router-view />
    <NavigationBar />
  </div>
</template>

<style scoped></style>
