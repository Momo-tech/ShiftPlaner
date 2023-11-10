import { DatePicker, MonthPicker, MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { Shift } from 'models/Shift';
import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { useUserContext } from 'util/context';

import './Overview.scss';

export function Overview() {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>();
  const [month, setMonth] = useState<Date>(new Date());
  useEffect(() => {
    handleGetUserShifts();
  }, [month, user?.id]);
  const pastShifts = userShifts?.filter((shift) =>
    dayjs(shift.startTime).isBefore(dayjs())
  );
  const futureShifts = userShifts?.filter((shift) =>
    dayjs(shift.startTime).isAfter(dayjs())
  );

  const handleGetUserShifts = async () => {
    if (!user) {
      return;
    }
    const shifts = await getUserShifts(user?.id, user.com_id, [
      dayjs(month).startOf('month').toDate(),
      dayjs(month).endOf('month').toDate()
    ]);
    setUserShifts(shifts);
  };
  return (
    <div className="overview">
      <MonthPickerInput
        value={month}
        onChange={(value) => {
          if (!value) {
            return;
          }
          setMonth(value);
        }}
        size="md"
      />
      <div> Vergange</div>
      <div className="overview-shift-box">
        <div className="overview-shift-box__row">
          <div>Schichten</div>
          <div>{pastShifts?.length}</div>
        </div>
        <div className="overview-shift-box__row">
          <div>Stunden</div>
          <div>
            {pastShifts?.reduce(
              (acc, shift) =>
                acc + dayjs(shift.endTime).diff(shift.startTime, 'hours'),
              0
            )}
          </div>
        </div>
        <div className="overview-shift-box__row">
          <div>Pause</div>
          <div>{pastShifts?.reduce((acc, shift) => acc + shift.break, 0)}</div>
        </div>
        <div className="overview-shift-box__row">
          <div>Lohn</div>
          <div>
            {pastShifts?.reduce(
              (acc, shift) =>
                acc + dayjs(shift.endTime).diff(shift.startTime, 'hour'),
              0
            ) ?? 0 * (user?.hourlyWage ?? 0)}
          </div>
        </div>
      </div>
      <div>Geplant</div>
      <div className="overview-shift-box">
        <div className="overview-shift-box__row">
          <div>Schichten</div>
          <div>{futureShifts?.length}</div>
        </div>
        <div className="overview-shift-box__row">
          <div>Stunden</div>
          <div>
            {futureShifts?.reduce(
              (acc, shift) =>
                acc + dayjs(shift.endTime).diff(shift.startTime, 'hour'),
              0
            )}
          </div>
        </div>
        <div className="overview-shift-box__row">
          <div>Pause</div>
          <div>
            {futureShifts?.reduce((acc, shift) => acc + shift.break, 0)}
          </div>
        </div>
        <div className="overview-shift-box__row">
          <div>Lohn</div>
          <div>
            {futureShifts?.reduce(
              (acc, shift) =>
                acc + dayjs(shift.endTime).diff(shift.startTime, 'hour'),
              0
            ) ?? 0 * (user?.hourlyWage ?? 0)}
          </div>
        </div>
      </div>
    </div>
  );
}
