import { UserShift } from '../../../../models/UserShift.ts';
import dayjs from 'dayjs';
import { User } from '../../../../models/User.ts';

export function calculateTotalHours(shifts: UserShift[]) {
  let totalHours = 0;
  for (const shift of shifts) {
    const durationInHours = dayjs(shift.endTime).diff(dayjs(shift.startTime), "hours", true);
    totalHours += durationInHours;
  }
  return totalHours;
}

export function calculateTotalBreaks(shifts: UserShift[]) {
  return shifts.reduce((totalBreaks, shift) => totalBreaks + shift.break, 0);
}

export function calculateTotalWage(shifts: UserShift[], user: User){
  const totalHours = calculateTotalHours(shifts);
  const totalBreaks = calculateTotalBreaks(shifts);
  return (totalHours - totalBreaks) * user.hourlyWage;
}