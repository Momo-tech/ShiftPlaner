import './monthlyOverview.scss';
import { MonthPickerInput } from '@mantine/dates';
import { useState } from 'react';
import { ShiftSummary } from './ShiftSummary/ShiftSummary.tsx';
import { UserShift } from '../../../models/UserShift.ts';
import dayjs from 'dayjs';

interface IMonthlyOverviewProps {
  allShifts: UserShift[];
}

export function MonthlyOverview(props: IMonthlyOverviewProps) {
  const [month, setMonth] = useState<Date | null>(new Date());
  const monthlyShifts = props.allShifts.filter(shift => dayjs(month).month() === dayjs(shift.startTime).month());
  const pastShifts = monthlyShifts.filter(shift => dayjs(shift.startTime).isBefore(dayjs()));
  const futureShifts = monthlyShifts.filter(shift => dayjs(shift.startTime).isAfter(dayjs()));
  return (
    <div className='monthly-overview'>
      <div className='monthly-overview__header'>
        <span>Info</span>
        <MonthPickerInput value={month} onChange={setMonth} />
      </div>
      <ShiftSummary title='Vergangene' shifts={pastShifts} />
      <ShiftSummary title='Geplant' shifts={futureShifts} />
    </div>
  );
}