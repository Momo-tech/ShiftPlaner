import dayjs from "dayjs";
import { User } from "models/User";
import { UserShift } from "models/UserShift";
import { useEffect, useMemo, useState } from "react";
import { getAllUsersForComapny } from "supabase/userFunctions";
import { getAllShiftsInDateRange } from "supabase/userShiftFunctions";

export function useEmployeeData(
  startDate: Date,
  endDate: Date,
  companyId: string | undefined
): EmployeeData[] {
  const [userShifts, setUserShifts] = useState<UserShift[]>([]);
  const [employees, setEmployees] = useState<User[]>([]);
  const handleGetUserShifts = async () => {
    if (!companyId) return;
    if (!startDate || !endDate) {
      return;
    }

    const userShifts = await getAllShiftsInDateRange(companyId, [
      startDate,
      endDate,
    ]);
    setUserShifts(userShifts ?? []);
  };

  const handleGetAllUsers = async () => {
    if (!companyId) return;
    const users = await getAllUsersForComapny(companyId);
    setEmployees(users ?? []);
  };

  useEffect(() => {
    handleGetAllUsers();
  }, [companyId]);

  useEffect(() => {
    handleGetUserShifts();
  }, [startDate.toISOString(), endDate.toISOString(), companyId]);

  const employeeData = useMemo(() => {
    const employeeData: EmployeeData[] = [];
    userShifts.forEach((userShift) => {
      const exitingData = employeeData.find(
        (data) => data.employeeId === userShift.user_id
      );
      if (exitingData) {
        exitingData.shiftAmount += 1;
        exitingData.hours += dayjs(userShift.endTime).diff(
          dayjs(userShift.startTime),
          "hour"
        );
        exitingData.shifts.push(userShift);
      } else {
        const employee = employees.find(
          (employee) => employee.id === userShift.user_id
        );
        if (!employee) {
          return;
        }
        employeeData.push({
          employeeId: employee.id,
          hours: dayjs(userShift.endTime).diff(
            dayjs(userShift.startTime),
            "hour"
          ),
          shifts: [userShift],
          shiftAmount: 1,
          employeeName: employee.full_name,
          targetHours: employee.targetHours,
        });
      }
    });
    return employeeData;
  }, [
    userShifts
      .map(
        (shift) =>
          shift.id + shift.startTime.toISOString() + shift.endTime.toISOString()
      )
      .sort(),
    employees.map((employee) => employee.id).sort(),
  ]);

  return employeeData;
}

interface EmployeeData {
  employeeId: User["id"];
  shifts: UserShift[];
  shiftAmount: number;
  hours: number;
  employeeName: string;
  targetHours: number;
}
