import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useUserContext } from "util/context";
import { UserShift } from "../../models/UserShift";
import { getUserShifts } from "../../supabase/userShiftFunctions";
import "./calender.scss";

export function Calender() {
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
    const userShifts = await getUserShifts(user.id);
    setUserShifts(userShifts ?? []);
  };

  return (
    <FullCalendar
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridDay,dayGridWeek,dayGridMonth",
      }}
      plugins={[dayGridPlugin]}
      height={500}
      locale="de"
      eventDisplay="block"
      events={[
        ...userShifts.map((userShift) => ({
          title: userShift.name,
          date: dayjs(userShift.date).format("YYYY-MM-DD"),
          start: dayjs(userShift.startTime).toDate(),
          end: dayjs(userShift.endTime).toDate(),
        })),
      ]}
      initialView="dayGridMonth"
    />
  );
}
