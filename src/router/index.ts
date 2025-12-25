import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "today",
      component: () => import("../views/TodayView.vue"),
    },
    {
      path: "/week",
      name: "week",
      component: () => import("../views/WeekView.vue"),
    },
    {
      path: "/month",
      name: "month",
      component: () => import("../views/MonthView.vue"),
    },
    {
      path: "/reports",
      name: "reports",
      component: () => import("../views/ReportsView.vue"),
    },
    {
      path: "/settings",
      name: "settings",
      component: () => import("../views/SettingsView.vue"),
    },
  ],
});

export default router;
