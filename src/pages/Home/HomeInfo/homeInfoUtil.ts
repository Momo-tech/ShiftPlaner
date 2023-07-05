import dayjs from "dayjs";
import { UserShift } from "models/UserShift";

export function calculateWorkHoursForShifts(shifts: UserShift[]) {
  const workHours = shifts.reduce(
    (acc, shift) =>
      acc + dayjs(shift.endTime).diff(dayjs(shift.startTime), "hour"),
    0
  );

  return workHours;
}
