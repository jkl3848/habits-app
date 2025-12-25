export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0] || "";
}

export function parseDate(dateString: string): Date {
  return new Date(dateString + "T00:00:00");
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
}

export function getWeekEnd(date: Date): Date {
  const start = getWeekStart(date);
  return new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
}

export function getWeekDates(weekStart: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    dates.push(date);
  }
  return dates;
}

export function getMonthDates(year: number, month: number): Date[] {
  const dates: Date[] = [];
  const lastDay = new Date(year, month + 1, 0);

  for (let date = 1; date <= lastDay.getDate(); date++) {
    dates.push(new Date(year, month, date));
  }

  return dates;
}

export function formatTime(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  if (hours === undefined || minutes === undefined) return time24;
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

export function calculateSleepHours(bedTime: string, wakeTime: string): number {
  const [bedHour, bedMin] = bedTime.split(":").map(Number);
  const [wakeHour, wakeMin] = wakeTime.split(":").map(Number);

  if (
    bedHour === undefined ||
    bedMin === undefined ||
    wakeHour === undefined ||
    wakeMin === undefined
  ) {
    return 0;
  }

  let bedMinutes = bedHour * 60 + bedMin;
  let wakeMinutes = wakeHour * 60 + wakeMin;

  // If wake time is earlier than bed time, assume wake time is next day
  if (wakeMinutes < bedMinutes) {
    wakeMinutes += 24 * 60;
  }

  const totalMinutes = wakeMinutes - bedMinutes;
  return totalMinutes / 60;
}

export function getDayName(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long" });
}

export function getMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
