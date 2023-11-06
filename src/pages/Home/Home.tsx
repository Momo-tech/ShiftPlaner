import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { useUserContext } from 'util/context';
import { UserCalendar } from '../../components/UserCalendar/UserCalendar';
import { UserShiftSummary } from 'components/UserShiftSummary/UserShiftSummary';
import './home.scss';

export const Home = () => {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  useEffect(() => {
    handleGetUserShifts();
  }, [user?.id]);

  const handleGetUserShifts = async () => {
    if (!user) {
      return;
    }
    const userShifts = await getUserShifts(user.id, user.com_id);
    setUserShifts(userShifts ?? []);
  };

  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date(), new Date()]);

  return (
    <div>
      <h2>Übersicht</h2>
      <div className="home-page-grid">
        <div className="home-page-grid__calender">
          <UserCalendar userShifts={userShifts} onDateRangeChange={value => setDateRange(value)}/>
        </div>
        <div className="home-page-grid__summary">
          <UserShiftSummary userShifts={userShifts} dateRange={dateRange} user={user}/>
        </div>
      </div>
    </div>
  );
};
