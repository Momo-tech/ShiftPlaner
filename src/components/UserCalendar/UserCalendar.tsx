import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin
import FullCalendar from "@fullcalendar/react";
import dayjs from "dayjs";
import { UserShift } from "../../models/UserShift";
import "./userCalendar.scss";
import { MutableRefObject } from "react";

interface UserCalendarPropos {
  userShifts: UserShift[],
  innerRef: MutableRefObject<HTMLDivElement>
}

export function UserCalendar(props: UserCalendarPropos) {
  return (
    <FullCalendar
	  ref={props.innerRef}
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
    />
  );
}
