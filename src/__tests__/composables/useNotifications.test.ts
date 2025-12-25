import { describe, it, expect, beforeEach, vi } from "vitest";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Capacitor } from "@capacitor/core";
import { useNotifications } from "../../composables/useNotifications";

// Mock Capacitor
vi.mock("@capacitor/core", () => ({
  Capacitor: {
    isNativePlatform: vi.fn(),
  },
}));

// Mock Local Notifications
vi.mock("@capacitor/local-notifications", () => ({
  LocalNotifications: {
    requestPermissions: vi.fn(),
    schedule: vi.fn(),
    checkPermissions: vi.fn(),
    cancel: vi.fn(),
  },
}));

describe("useNotifications", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("requestPermissions", () => {
    it("should request permissions on native platform", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(LocalNotifications.requestPermissions).mockResolvedValue({
        display: "granted",
      });

      const { requestPermissions } = useNotifications();
      const result = await requestPermissions();

      expect(result).toBe(true);
      expect(LocalNotifications.requestPermissions).toHaveBeenCalled();
    });

    it("should return false on web platform", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

      const { requestPermissions } = useNotifications();
      const result = await requestPermissions();

      expect(result).toBe(false);
      expect(LocalNotifications.requestPermissions).not.toHaveBeenCalled();
    });

    it("should return false if permissions denied", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(LocalNotifications.requestPermissions).mockResolvedValue({
        display: "denied",
      });

      const { requestPermissions } = useNotifications();
      const result = await requestPermissions();

      expect(result).toBe(false);
    });
  });

  describe("scheduleDailyReminder", () => {
    it("should schedule reminder on native platform", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({
        display: "granted",
      });
      vi.mocked(LocalNotifications.cancel).mockResolvedValue();
      vi.mocked(LocalNotifications.schedule).mockResolvedValue({
        notifications: [],
      });

      const { scheduleDailyReminder } = useNotifications();
      await scheduleDailyReminder("20:00");

      expect(LocalNotifications.checkPermissions).toHaveBeenCalled();
      expect(LocalNotifications.cancel).toHaveBeenCalled();
      expect(LocalNotifications.schedule).toHaveBeenCalled();
    });

    it("should not schedule on web platform", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

      const { scheduleDailyReminder } = useNotifications();
      await scheduleDailyReminder("20:00");

      expect(LocalNotifications.schedule).not.toHaveBeenCalled();
    });

    it("should not schedule if permissions denied", async () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);
      vi.mocked(LocalNotifications.checkPermissions).mockResolvedValue({
        display: "denied",
      });

      const { scheduleDailyReminder } = useNotifications();
      await scheduleDailyReminder("20:00");

      expect(LocalNotifications.schedule).not.toHaveBeenCalled();
    });
  });

  describe("isNativePlatform", () => {
    it("should return true on native platform", () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(true);

      const { isNativePlatform } = useNotifications();

      expect(isNativePlatform).toBe(true);
    });

    it("should return false on web platform", () => {
      vi.mocked(Capacitor.isNativePlatform).mockReturnValue(false);

      const { isNativePlatform } = useNotifications();

      expect(isNativePlatform).toBe(false);
    });
  });
});
