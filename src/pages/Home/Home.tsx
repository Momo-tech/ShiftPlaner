import { UserShift } from "models/UserShift";
import { useEffect, useState } from "react";
import { getUserShifts } from "supabase/userShiftFunctions";
import { useUserContext } from "util/context";
import { Calendar } from "../../components/Calendar/Calendar";
import { HomeInfo } from "./HomeInfo/HomeInfo";
import "./home.scss";
export const Home = () => {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  useEffect(() => {
    handleGetUserShifts();
  }, [user?.id]);

  const handleGetUserShifts = async () => {
    if (!user) {
      console.error("missing user");
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
          <Calendar userShifts={userShifts} />
        </div>
        <div className="home-page-grid__info">
          <HomeInfo shifts={userShifts} />
        </div>
      </div>
    </div>
  );
};
