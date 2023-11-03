import { UserShift } from 'models/UserShift';
import { useState } from 'react';
import dayjs from 'dayjs';
import { MonthPickerInput } from '@mantine/dates';
import { ShiftsOverview } from './ShiftsOverview/ShiftsOverview';
import './monthSummary.scss';
interface MonthSummaryProps {
  userShifts: UserShift[];
}

export function MonthSummary(props: MonthSummaryProps) {
  const [month, setMonth] = useState(new Date());
  const isCurrentMonth = dayjs().isSame(month, 'month');
  const currentMonthShifts = props.userShifts.filter((shift) => {
    dayjs(shift.startTime).isSame(month, 'month');
  });

  const futureShifts = currentMonthShifts.filter((shift) => {
    if (isCurrentMonth) {
      return dayjs(shift.startTime).isAfter(dayjs().endOf('day'));
    }
    if (dayjs(month).isBefore(dayjs(), 'month')) {
      return false;
    }
    return true;
  });
  const pastShifts = currentMonthShifts.filter((shift) => {
    if (isCurrentMonth) {
      return dayjs(shift.startTime).isBefore(dayjs().startOf('day'));
    }
    if (dayjs(month).isAfter(dayjs(), 'month')) {
      return false;
    }
    return true;
  });
  return (
    <div className="month-summary">
      <MonthPickerInput
        value={month}
        onChange={(value) => {
          if (!value) {
            return;
          }
          setMonth(value);
        }}
      />
      <ShiftsOverview name="Vergangen" userShifts={pastShifts} />
      <ShiftsOverview name="Kommende" userShifts={futureShifts} />
    </div>
  );
}
