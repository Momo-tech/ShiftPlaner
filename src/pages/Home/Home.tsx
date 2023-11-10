import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { Table } from '@mantine/core';
import { useUserContext } from 'util/context';
import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import './home.scss';
import { UserCalendar } from '../../components/UserCalendar/UserCalendar';

export const Home = () => {
  const user = useUserContext();
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  const [pastShifts, setPastShifts] = useState<UserShift[]>([]);
  const [futureShifts, setFutureShifts] = useState<UserShift[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(
    new Date()
  );

  useEffect(() => {
    handleGetUserShifts();
  }, [user?.id, selectedMonth]);

  const handleGetUserShifts = async () => {
    if (!user || !selectedMonth) {
      return;
    }

    const firstDayOfMonth = dayjs(selectedMonth).startOf('month');
    const lastDayOfMonth = dayjs(selectedMonth).endOf('month');

    const shifts = await getUserShifts(user.id, user.com_id);
    setUserShifts(shifts ?? []);

    const pastShifts = shifts?.filter((shift) => {
      const endTime = dayjs(shift.endTime);
      return endTime.isBefore(firstDayOfMonth);
    });

    const futureShifts = shifts?.filter((shift) => {
      const startTime = dayjs(shift.startTime);
      return (
        startTime.isAfter(lastDayOfMonth) || startTime.isSame(firstDayOfMonth)
      );
    });

    setPastShifts(pastShifts ?? []);
    setFutureShifts(futureShifts ?? []);

    console.log(pastShifts);
    console.log(futureShifts);
  };

  const calculateSummary = (shifts: UserShift[]) => {
    const totalShifts = shifts.length;
    const totalHours = shifts.reduce((total, shift) => {
      return total + dayjs(shift.endTime).diff(shift.startTime, 'hour');
    }, 0);
    const totalBreak = shifts.reduce((total, shift) => {
      return total + (shift.break || 0);
    }, 0);

    return {
      totalShifts,
      totalHours,
      totalBreak
    };
  };

  const pastShiftsSummary = calculateSummary(pastShifts);
  const futureShiftsSummary = calculateSummary(futureShifts);

  return (
    <div>
      <h2>Übersicht</h2>
      <div className="home-page-grid">
        <div className="home-page-grid__calender">
          <UserCalendar userShifts={userShifts} />
        </div>
        <div className="home-page-grid__summary">
          <h3>Info</h3>
          <MonthPickerInput
            placeholder="Pick month"
            value={selectedMonth}
            onChange={(change) =>
              setSelectedMonth(
                change ? new Date(change.toISOString()) : undefined
              )
            }
          />
          <h4>Vergangene</h4>
          <Table>
            <tbody>
              <tr>
                <td>Schichten</td>
                <td>{pastShiftsSummary.totalShifts}</td>
              </tr>
              <tr>
                <td>Stunden</td>
                <td>{pastShiftsSummary.totalShifts}</td>
              </tr>
              <tr>
                <td>Pause</td>
                <td>{pastShiftsSummary.totalBreak}</td>
              </tr>
              <tr>
                <td>Lohn</td>
                <td>{user?.hourlyWage}</td>
              </tr>
            </tbody>
          </Table>

          <h4>Geplant</h4>
          <Table>
            <tbody>
              <tr>
                <td>Schichten</td>
                <td>{futureShiftsSummary.totalShifts}</td>
              </tr>
              <tr>
                <td>Stunden</td>
                <td>{futureShiftsSummary.totalShifts}</td>
              </tr>
              <tr>
                <td>Pause</td>
                <td>{futureShiftsSummary.totalBreak}</td>
              </tr>
              <tr>
                <td>Lohn</td>
                <td>{user?.hourlyWage}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};
