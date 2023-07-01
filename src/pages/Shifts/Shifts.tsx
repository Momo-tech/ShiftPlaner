import { Table } from "@mantine/core";
import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { UserShift } from "models/UserShift";
import { useEffect, useState } from "react";
import { getUserShifts } from "supabase/userShiftFunctions";
import { useUserContext } from "util/context";

export const Shifts = () => {
  const [shifts, setShifts] = useState<UserShift[]>([]);
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const user = useUserContext();
  const getShifts = async () => {
    if (!user) {
      console.error("missing user");
      return;
    }
    const userShifts = await getUserShifts(user.id, [
      dayjs(month).startOf("month").toDate(),
      dayjs(month).endOf("month").toDate(),
    ]);
    setShifts(userShifts ?? []);
  };
  useEffect(() => {
    getShifts();
  }, [user?.id, month]);
  return (
    <div>
      <h2>Schichten</h2>
      <div>
        <MonthPickerInput
          label="Pick date"
          placeholder="Pick date"
          value={month}
          onChange={(change) =>
            setMonth(change ? new Date(change?.toISOString()) : new Date())
          }
        />
      </div>
      <Table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Start</th>
            <th>Ende</th>
            <th>SchiftName</th>
            <th>Arbeitszeit</th>
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift) => (
            <tr key={shift.id}>
              <td>{dayjs(shift.date).format("YYYY.MM.DD")}</td>
              <td>{dayjs(shift.startTime).format("HH:mm")}</td>
              <td>{dayjs(shift.endTime).format("HH:mm")}</td>
              <td>{shift.name}</td>
              <td>{dayjs(shift.endTime).diff(shift.startTime, "hours")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};
