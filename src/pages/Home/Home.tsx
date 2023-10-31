import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { useUserContext } from 'util/context';
import { UserCalendar } from '../../components/UserCalendar/UserCalendar';
import './home.scss';
import { Overview } from './Overview/Overview';
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
  return (
    <div>
      <h2>Übersicht</h2>
      <div className="home-page-grid">
        <div className="home-page-grid__calender">
          <UserCalendar userShifts={userShifts} />
        </div>
        <div className="home-page-grid__overview">
          <Overview />
        </div>
      </div>
    </div>
  );
};
