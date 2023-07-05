import dayjs from "dayjs";
import { Repeats } from "models/Shift";

export function getDatesForReapeatAndDateRange(
  repeat: Repeats,
  dateRange: [Date, Date]
) {
  switch (repeat) {
    case Repeats.DAILY:
      return getDailyDates(dateRange);
    case Repeats.WEEKLY:
      return getWeeklyDates(dateRange);
    case Repeats.MONTHLY:
      return getMonthlyDates(dateRange);
    case Repeats.YEARLY:
      return getYearlyDates(dateRange);
    default:
      return [];
  }
}

function getDailyDates(dateRange: [Date, Date]) {
  const dates: Date[] = [];
  const days = dayjs(dateRange[1]).diff(dateRange[0], "day");
  for (let i = 0; i <= days; i++) {
    dates.push(dayjs(dateRange[0]).add(i, "day").toDate());
  }
  return dates;
}

function getWeeklyDates(dateRange: [Date, Date]) {
  const dates: Date[] = [];
  const weeks = dayjs(dateRange[1]).diff(dateRange[0], "week");
  for (let i = 0; i <= weeks; i++) {
    dates.push(dayjs(dateRange[0]).add(i, "week").toDate());
  }
  return dates;
}

function getMonthlyDates(dateRange: [Date, Date]) {
  const dates: Date[] = [];
  const months = dayjs(dateRange[1]).diff(dateRange[0], "month");
  for (let i = 0; i <= months; i++) {
    dates.push(dayjs(dateRange[0]).add(i, "month").toDate());
  }

  return dates;
}

function getYearlyDates(dateRange: [Date, Date]) {
  const dates: Date[] = [];
  const years = dayjs(dateRange[1]).diff(dateRange[0], "year");
  for (let i = 0; i <= years; i++) {
    dates.push(dayjs(dateRange[0]).add(i, "year").toDate());
  }

  return dates;
}
