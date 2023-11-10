import './shiftSummary.scss';
import { UserShift } from '../../../../models/UserShift.ts';
import { calculateTotalBreaks, calculateTotalHours, calculateTotalWage } from './utils.ts';
import { useUserContext } from '../../../../util/context.ts';

interface ShiftSummaryProps {
  title: string;
  shifts: UserShift[];
}

export function ShiftSummary(props: ShiftSummaryProps) {
  const user = useUserContext();
  if (!user) {
    return null;
  }
  return <div className='shift-summary'>
    <div className='shift-summary__heading'>
      {props.title}
    </div>
    <div className='shift-summary__values'>
      <div className='shift-summary__row'>
        <label>Schichten</label><span>{props.shifts.length}</span>
      </div>
      <div className='shift-summary__row'>
        <label>Stunden</label><span>{calculateTotalHours(props.shifts).toFixed(2)}</span>
      </div>
      <div className='shift-summary__row'>
        <label>Pause</label><span>{calculateTotalBreaks(props.shifts).toFixed(2)}</span>
      </div>
      <div className='shift-summary__row'>
        <label>Lohn</label><span>{calculateTotalWage(props.shifts, user).toFixed(2)}</span>
      </div>
    </div>
  </div>;
}