import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import FullCalendar from '@fullcalendar/react';
import dayjs from 'dayjs';
import { UserShift } from 'models/UserShift';
import { useEffect, useRef, useState } from 'react';
import { useUserContext } from 'util/context';
import { useEmployeeData } from '../EmployeesOverview/useEmployeeData';
import { UserShiftModal } from './UserShiftModal/UserShiftModal';
import './employeeShiftCalendar.scss';

export function EmployeeShiftCalender() {
  const user = useUserContext();
  const calendarRef = useRef<FullCalendar>(null);
  const calendarApi = calendarRef.current?.getApi();

  const [startDate, setStartDate] = useState<Date>(
    dayjs().startOf('month').toDate()
  );
  const [selectedShift, setSelectedShift] = useState<UserShift>(
    new UserShift({})
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [endDate, setEndDate] = useState<Date>(dayjs().endOf('month').toDate());
  const activeStart = calendarApi?.view.activeStart;
  const activeEnd = calendarApi?.view.activeEnd;

  useEffect(() => {
    //FIXME: this is not working, force update somehow when month is changed
    if (
      dayjs(startDate).isSame(activeStart) &&
      dayjs(endDate).isSame(activeEnd)
    ) {
      return;
    }
    setStartDate(activeStart ?? dayjs().startOf('month').toDate());
    setEndDate(activeEnd ?? dayjs().endOf('month').toDate());
  }, [activeStart, activeEnd]);

  const { data, onUserShiftUpdate } = useEmployeeData(
    dayjs(startDate).subtract(6, 'days').toDate(),
    dayjs(endDate).add(6, 'days').toDate(),
    user?.com_id
  );
  const allShifts = data.flatMap((data) => data.shifts);
  return (
    <>
      <FullCalendar
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridDay,dayGridWeek,dayGridMonth'
        }}
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        locale="de"
        eventDisplay="block"
        events={[
          ...data.flatMap((data) =>
            data.shifts.map((shift) => ({
              title: shift.name + ': ' + data.employeeName,
              date: dayjs(shift.date).format('YYYY-MM-DD'),
              start: dayjs(shift.startTime).toDate(),
              end: dayjs(shift.endTime).toDate(),
              agendaEventMinHeight: '40px',
              id: shift.id
            }))
          )
        ]}
        displayEventEnd
        eventClick={(info) => {
          const shift = allShifts.find(
            (shift) => Number(shift.id) === Number(info.event.id)
          );
          if (!shift) {
            return;
          }
          setSelectedShift(shift);
          setIsModalOpen(true);
        }}
        initialView="dayGridMonth"
      />
      <UserShiftModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(userShift) => onUserShiftUpdate(userShift)}
        userShift={selectedShift}
      />
    </>
  );
}
