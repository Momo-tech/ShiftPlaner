import { UserShift } from 'models/UserShift';
import './shiftsSummary.scss';
import { useUserContext } from 'util/context';
import { User } from 'models/User';

type ShiftsSummaryProps = {
  shifts: UserShift[];
};

export function ShiftsSummary(props: ShiftsSummaryProps) {
  const user = useUserContext();

  const { shifts: allShifts } = props;

  if (!user) {
    return null;
  }

  const shifts = allShifts.filter((shift) => {
    const shiftBelongsTouser = shift.user_id === user.id;
    const shiftHasValidTimes =
      shift.startTime.getTime() <= shift.endTime.getTime();
    return shiftBelongsTouser && shiftHasValidTimes;
  });

  const count = shifts.length;
  const workingHours = calculateWorkingHours(shifts);
  const breakHours = calculateBreaksHours(shifts);
  const wage = calculateWage(shifts, user);

  return (
    <div className="shifts-summary">
      <div className="shifts-summary__row">
        <span>Schichten</span>
        <span>{count}</span>
      </div>
      <div className="shifts-summary__row">
        <span>Stunden</span>
        <span>{hoursFormatter.format(workingHours)}</span>
      </div>
      <div className="shifts-summary__row">
        <span>Pause</span>
        <span>{hoursFormatter.format(breakHours)}</span>
      </div>
      <div className="shifts-summary__row">
        <span>Lohn</span>
        <span>{wageFormatter.format(wage)}</span>
      </div>
    </div>
  );
}

const hoursFormatter = new Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1
});

const wageFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0
});

function calculateBreaksHours(shifts: UserShift[]): number {
  const seconds = shifts.reduce((acc, cur) => {
    return acc + cur.break;
  }, 0);

  return seconds / 3_600;
}

function calculateWorkingHours(shifts: UserShift[]): number {
  const ms = shifts.reduce((acc, cur) => {
    return acc + (cur.endTime.getTime() - cur.startTime.getTime());
  }, 0);

  const seconds = ms / 1_000;
  return seconds / 3_600;
}

function calculateWage(shifts: UserShift[], user: User): number {
  const hours = calculateWorkingHours(shifts);
  return hours * user.hourlyWage;
}
