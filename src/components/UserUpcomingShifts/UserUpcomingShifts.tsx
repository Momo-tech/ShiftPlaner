import dayjs from 'dayjs';
import { UserShift } from '../../models/UserShift';
import { useState } from 'react';
import { User } from 'models/User';

interface UserCalendarPropos {
  userShifts: UserShift[];
  currentMonth: Date;
  user?: User;
}

export function UserUpcomingShifts(props: UserCalendarPropos) {
  const { userShifts } = props;
  const [selectedMonth, setSelectedMonth] = useState<string>();
  const selectedDate = new Date();

  let shownShifts = userShifts;
  if (selectedMonth && selectedMonth !== 'all') {
    const correctMonth = new Date(selectedMonth).getMonth();
    const correctYear = new Date(selectedMonth).getFullYear();
    shownShifts = shownShifts.filter(
      (shift) =>
        shift.date.getMonth() == correctMonth &&
        shift.date.getFullYear() == correctYear
    );
  }

  const pastShift = shownShifts.filter(
    (shift) => shift.date.getTime() < selectedDate.getTime()
  );
  const futureShift = shownShifts.filter(
    (shift) => shift.date.getTime() > selectedDate.getTime()
  );
  return (
    <div>
      <MonthSelectComponent
        onMonthUpdate={(month: string) => setSelectedMonth(month)}
      />

      <h1>Vergangene</h1>
      {convertShiftsToTable(pastShift, props.user)}

      <h1>Kommenden</h1>
      {convertShiftsToTable(futureShift, props.user)}
    </div>
  );
}

interface MonthSelectProps {
  onMonthUpdate: (month: string) => void;
}
const MonthSelectComponent = (props: MonthSelectProps) => {
  const { onMonthUpdate } = props;
  const handleChange = (e: any) => {
    onMonthUpdate(e.target.value);
  };

  // TODO könnte ein useeffect sein
  const monthList = [];
  for (let i = -6; i < 6; i++) {
    let month = dayjs();
    month = month.subtract(i, 'month');
    monthList.push({
      display: month.format('MMMM YYYY'),
      value: month.toISOString()
    });
  }
  return (
    <div>
      <label htmlFor="dropdown">Schichten anzeigen in...</label>
      <select id="dropdown" onChange={handleChange}>
        <option value="all">Alle Monate</option>
        {monthList.map((month) => (
          <option value={month.value}>{month.display}</option>
        ))}
      </select>
    </div>
  );
};

const convertShiftsToTable = (shifts: UserShift[], user?: User) => {
  if (!shifts || shifts.length == 0) {
    return <>Keine Schichten vorhanden...</>;
  }
  const count = shifts.length;
  // assuming that they happen only during the day, not over night.
  const hours = shifts.reduce(
    (acc, shift) =>
      (acc += shift.endTime.getHours() - shift.startTime.getHours()),
    0
  );
  const wage = hours * (user?.hourlyWage || 0);

  return (
    <table width="100%">
      <tr>
        <td>Schichten</td>
        <td width="100">{count}</td>
      </tr>
      <tr>
        <td> Stunden</td>
        <td> {hours}</td>
      </tr>
      <tr>
        <td>Lohn</td>
        <td>{wage}</td>
      </tr>
    </table>
  );
};
