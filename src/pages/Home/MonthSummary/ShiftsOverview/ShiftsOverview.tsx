import { UserShift } from 'models/UserShift';
import './shiftsOverview.scss';
import { useUserContext } from 'util/context';
import dayjs from 'dayjs';
interface ShiftsOverviewProps {
  userShifts: UserShift[];
  name: string;
}
export function ShiftsOverview(props: ShiftsOverviewProps) {
  const user = useUserContext();
  const hours = props.userShifts.reduce(
    (acc, shift) => acc + dayjs(shift.endTime).diff(shift.startTime, 'h'),
    0
  );
  return (
    <>
      <div> {props.name} </div>
      <div className="shifts-overview-box">
        <div className="shifts-overview-box__row">
          <div>Anzahl</div>
          <div>{props.userShifts.length}</div>
        </div>
        <div className="shifts-overview-box__row">
          <div>Stunden</div>
          <div>{hours}</div>
        </div>
        <div className="shifts-overview-box__row">
          <div>Lohn</div>
          <div>{hours * (user?.hourlyWage ?? 0)}</div>
        </div>
      </div>
    </>
  );
}
