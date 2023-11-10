import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { UserShift } from "../../models/UserShift";
import "./userCalendar.scss";

interface UserCalendarPropos {
  userShifts: UserShift[];
  onDateRangeChange: (range: [Date, Date]) => void;
}

export function UserCalendar(props: UserCalendarPropos) {
  return (
    <FullCalendar
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridDay,dayGridWeek,dayGridMonth",
      }}
      plugins={[dayGridPlugin]}
      locale="de"
      eventDisplay="block"
      events={[
        ...props.userShifts.map((userShift) => ({
          title: userShift.name,
          date: dayjs(userShift.date).format("YYYY-MM-DD"),
          start: dayjs(userShift.startTime).toDate(),
          end: dayjs(userShift.endTime).toDate(),
        })),
      ]}
      initialView="dayGridMonth"
      datesSet={value => {
        props.onDateRangeChange([value.view.activeStart, value.view.activeEnd]);
      }}
    />
  );
}
