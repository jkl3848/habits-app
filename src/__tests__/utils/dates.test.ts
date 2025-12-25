import { describe, it, expect } from "vitest";
import {
  formatDate,
  parseDate,
  getTodayString,
  getWeekStart,
  getWeekEnd,
  getWeekDates,
  getMonthDates,
  formatTime,
  calculateSleepHours,
  getDayName,
  getMonthName,
  getMonthYear,
} from "../../utils/dates";

describe("dates utility", () => {
  describe("formatDate", () => {
    it("should format Date to ISO string (YYYY-MM-DD)", () => {
      const date = new Date("2025-01-15T12:00:00");
      expect(formatDate(date)).toBe("2025-01-15");
    });

    it("should handle dates at start of year", () => {
      const date = new Date("2025-01-01T00:00:00");
      expect(formatDate(date)).toBe("2025-01-01");
    });

    it("should handle dates at end of year", () => {
      const date = new Date(2025, 11, 31); // December 31, 2025
      expect(formatDate(date)).toBe("2025-12-31");
    });
  });

  describe("parseDate", () => {
    it("should parse date string to Date object", () => {
      const dateStr = "2025-01-15";
      const date = parseDate(dateStr);
      expect(date.getFullYear()).toBe(2025);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(15);
    });
  });

  describe("getTodayString", () => {
    it("should return today's date string", () => {
      const result = getTodayString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe("getWeekStart", () => {
    it("should return Sunday of current week", () => {
      const date = new Date("2025-01-15"); // Wednesday
      const weekStart = getWeekStart(date);
      expect(weekStart.getDay()).toBe(0); // Sunday
    });

    it("should handle Sunday correctly", () => {
      const date = new Date(2025, 0, 12); // January 12, 2025 (Sunday)
      const weekStart = getWeekStart(date);
      expect(formatDate(weekStart)).toBe("2025-01-12");
    });

    it("should handle Monday correctly", () => {
      const date = new Date("2025-01-13"); // Monday
      const weekStart = getWeekStart(date);
      expect(weekStart.getDay()).toBe(0); // Should go back to Sunday
    });

    it("should handle Saturday correctly", () => {
      const date = new Date("2025-01-18"); // Saturday
      const weekStart = getWeekStart(date);
      expect(weekStart.getDay()).toBe(0); // Should go back to Sunday
    });
  });

  describe("getWeekEnd", () => {
    it("should return Saturday of current week", () => {
      const date = new Date("2025-01-15"); // Wednesday
      const weekEnd = getWeekEnd(date);
      expect(weekEnd.getDay()).toBe(6); // Saturday
    });
  });

  describe("getWeekDates", () => {
    it("should return array of 7 dates", () => {
      const weekStart = new Date("2025-01-12"); // Sunday
      const dates = getWeekDates(weekStart);
      expect(dates).toHaveLength(7);
    });

    it("should have consecutive dates", () => {
      const weekStart = new Date("2025-01-12"); // Sunday
      const dates = getWeekDates(weekStart);
      dates.forEach((date, index) => {
        const expectedDate = new Date(weekStart);
        expectedDate.setDate(weekStart.getDate() + index);
        expect(formatDate(date)).toBe(formatDate(expectedDate));
      });
    });
  });

  describe("getMonthDates", () => {
    it("should return all dates in January (31 days)", () => {
      const dates = getMonthDates(2025, 0); // January
      expect(dates).toHaveLength(31);
    });

    it("should return all dates in February (28 days)", () => {
      const dates = getMonthDates(2025, 1); // February 2025 (not leap year)
      expect(dates).toHaveLength(28);
    });

    it("should return all dates in April (30 days)", () => {
      const dates = getMonthDates(2025, 3); // April
      expect(dates).toHaveLength(30);
    });

    it("should handle leap year February (29 days)", () => {
      const dates = getMonthDates(2024, 1); // February 2024 (leap year)
      expect(dates).toHaveLength(29);
    });

    it("should have consecutive dates", () => {
      const dates = getMonthDates(2025, 0); // January
      dates.forEach((date, index) => {
        expect(date.getDate()).toBe(index + 1);
      });
    });
  });

  describe("formatTime", () => {
    it("should convert 24h to 12h format with AM", () => {
      expect(formatTime("09:30")).toBe("9:30 AM");
    });

    it("should convert 24h to 12h format with PM", () => {
      expect(formatTime("14:45")).toBe("2:45 PM");
    });

    it("should handle midnight (00:00)", () => {
      expect(formatTime("00:00")).toBe("12:00 AM");
    });

    it("should handle noon (12:00)", () => {
      expect(formatTime("12:00")).toBe("12:00 PM");
    });

    it("should handle 1 AM", () => {
      expect(formatTime("01:00")).toBe("1:00 AM");
    });

    it("should handle 11 PM", () => {
      expect(formatTime("23:00")).toBe("11:00 PM");
    });

    it("should pad single-digit minutes", () => {
      expect(formatTime("09:05")).toBe("9:05 AM");
    });

    it("should return original string for invalid input", () => {
      expect(formatTime("invalid")).toBe("invalid");
    });
  });

  describe("calculateSleepHours", () => {
    it("should calculate hours between same-day times", () => {
      const hours = calculateSleepHours("08:00", "16:00");
      expect(hours).toBe(8);
    });

    it("should handle overnight sleep (wake time < bed time)", () => {
      const hours = calculateSleepHours("22:00", "06:00");
      expect(hours).toBe(8);
    });

    it("should handle sleep past midnight", () => {
      const hours = calculateSleepHours("23:30", "07:30");
      expect(hours).toBe(8);
    });

    it("should calculate partial hours", () => {
      const hours = calculateSleepHours("22:30", "06:45");
      expect(hours).toBe(8.25);
    });

    it("should return 0 for invalid input", () => {
      const hours = calculateSleepHours("invalid", "06:00");
      expect(hours).toBe(0);
    });

    it("should handle edge case of same time (0 hours)", () => {
      const hours = calculateSleepHours("12:00", "12:00");
      expect(hours).toBe(0);
    });
  });

  describe("getDayName", () => {
    it("should return short day name", () => {
      const date = new Date(2025, 0, 12); // January 12, 2025 (Sunday)
      expect(getDayName(date)).toBe("Sun");
    });

    it("should return correct names for each day", () => {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

      for (let i = 0; i < 7; i++) {
        const date = new Date(2025, 0, 12 + i); // Starting from January 12, 2025 (Sunday)
        expect(getDayName(date)).toBe(days[i]);
      }
    });
  });

  describe("getMonthName", () => {
    it("should return full month name", () => {
      const date = new Date("2025-01-15");
      expect(getMonthName(date)).toBe("January");
    });

    it("should return correct names for all months", () => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      months.forEach((month, index) => {
        const date = new Date(2025, index, 15);
        expect(getMonthName(date)).toBe(month);
      });
    });
  });

  describe("getMonthYear", () => {
    it('should return "Month Year" format', () => {
      const date = new Date("2025-01-15");
      expect(getMonthYear(date)).toBe("January 2025");
    });

    it("should handle different years", () => {
      const date = new Date("2024-12-15");
      expect(getMonthYear(date)).toBe("December 2024");
    });
  });
});
