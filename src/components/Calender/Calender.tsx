import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import FullCalendar from "@fullcalendar/react";
import { useContext, useEffect, useState } from "react";
import "./calender.scss";

export function Calender() {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  useEffect(() => {
    handleGetUserShifts;
  }, []);

  const handleGetUserShifts = async () => {
    const userShifts = await getUserShifts("");
    setUserShifts(userShifts ?? []);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      height={500}
      initialView="dayGridMonth"
    />
  );
}
