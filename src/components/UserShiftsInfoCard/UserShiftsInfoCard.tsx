import { useUserContext } from 'util/context';
import './userShiftsInfoCard.scss';
import { useEffect, useState } from 'react';
import { UserShift } from 'models/UserShift';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { DatesProvider, MonthPickerInput } from '@mantine/dates';
import { ShiftsSummary } from './ShiftsSummary/ShiftsSummary';
import 'dayjs/locale/de';

export function UserShiftsInfoCard() {
  const user = useUserContext();

  const [month, setMonth] = useState(new Date());
  const [shifts, setShifts] = useState<UserShift[]>([]);

  useEffect(() => {
    if (!user) {
      setShifts([]);
      return;
    }

    getUserShifts(user.id, user.com_id, [
      getStartOfMonth(month),
      getEndOfMonth(month)
    ]).then((shifts) => {
      setShifts(shifts ?? []);
    });
  }, [user, month]);

  const currentTime = new Date().getTime();
  const previousShifts = shifts.filter((shift) => {
    return shift.endTime.getTime() < currentTime;
  });
  const planedShifts = shifts.filter((shift) => {
    return shift.startTime.getTime() > currentTime;
  });

  return (
    <div className="user-shifts-info-card">
      <div className="user-shifts-info-card__header">
        <h3 className="user-shifts-info-card__title">Info</h3>
        <DatesProvider settings={{ locale: 'de' }}>
          <MonthPickerInput
            placeholder="Monat auswählen"
            value={month}
            clearable={false}
            onChange={(value) => {
              setMonth(value ?? new Date());
            }}
          />
        </DatesProvider>
      </div>

      <div className="user-shifts-info-card__section">
        <p className="user-shifts-info-card__section-title">Vergangene</p>
        <ShiftsSummary shifts={previousShifts} />
      </div>

      <div className="user-shifts-info-card__section">
        <p className="user-shifts-info-card__section-title">Geplant</p>
        <ShiftsSummary shifts={planedShifts} />
      </div>
    </div>
  );
}

function getStartOfMonth(pointer: Date): Date {
  return new Date(pointer.getFullYear(), pointer.getMonth(), 1);
}

function getEndOfMonth(pointer: Date): Date {
  return new Date(pointer.getFullYear(), pointer.getMonth() + 1, 0);
}
