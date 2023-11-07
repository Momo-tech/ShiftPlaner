import { DatesSetArg } from 'fullcalendar/index.js';
import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { useUserContext } from 'util/context';
import { UserCalendar } from '../../components/UserCalendar/UserCalendar';
import './home.scss';
export const Home = () => {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  let [getCount, setCount] = useState<number>(0);
  let [getDisplay, setDisplay] = useState<boolean>(false);

  useEffect(() => {
    handleGetUserShifts();
  }, [user?.id]);

  const handleGetUserShifts = async () => {
    if (!user) {
      return;
    }
    const userShifts = await getUserShifts(user.id, user.com_id);
    setUserShifts(userShifts ?? []);

    /* initialize shifts of the current month */
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    let currentMonthAndYear = `${currentYear}-${currentMonth}`;

    if (userShifts) {
      const matches = userShifts.filter((shift) => {
        const shiftMonth = shift.startTime.getMonth();

        const shiftYear = shift.startTime.getFullYear();
        const shiftMonthAndYear = `${shiftYear}-${shiftMonth}`;

        if (shiftMonthAndYear == currentMonthAndYear) return shift;
      });
      setCount(matches.length);
    }
  };

  const countShiftsForCurrentMonth = (args: DatesSetArg) => {
    if (args.view.type == 'dayGridWeek') {
      setCount(0);
      setDisplay(false);
      return;
    }
    if (args.view.type == 'dayGridDay') {
      setCount(0);
      setDisplay(false);
      return;
    }

    if (args.startStr == undefined) {
      setCount(0);
      return;
    }

    /* only display shifts when on dayGridMonth view */
    setDisplay(true);

    let currentYear = +args.startStr.split('-').slice(0, 1);
    let currentMonth = +args.startStr.split('-').slice(1, 2);

    /* select current month in view */
    if (currentMonth > 20) {
      currentMonth += 1;
      /* december -> january */
      if (currentMonth > 12) currentMonth = 1;
    }

    let currentMonthAndYear = `${currentYear}-${currentMonth}`;

    const matches = userShifts.filter((shift) => {
      const shiftMonth = shift.startTime.getMonth();

      const shiftYear = shift.startTime.getFullYear();
      const shiftMonthAndYear = `${shiftYear}-${shiftMonth}`;

      if (shiftMonthAndYear == currentMonthAndYear) return shift;
    });

    setCount(matches.length);
    return;
  };

  return (
    <div>
      <h2>Übersicht</h2>
      <div className="home-page-grid">
        <div className="home-page-grid__calender">
          <UserCalendar
            userShifts={userShifts}
            cb={countShiftsForCurrentMonth}
          />
          {getDisplay ? 'Schichten: ' + getCount : ''}
        </div>
      </div>
    </div>
  );
};
