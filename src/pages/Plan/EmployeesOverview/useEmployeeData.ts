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
  }, [startDate, endDate, companyId]);

  const employeeDate = useMemo(() => {
    const employeeData: EmployeeData[] = [];
    userShifts.forEach((userShift) => {
      const exitingData = employeeData.find(
        (data) => data.employeeId === userShift.user_id
      );
      if (exitingData) {
        exitingData.shifts += 1;
        exitingData.hours += dayjs(userShift.endTime).diff(
          dayjs(userShift.startTime),
          "hour"
        );
      } else {
        const employee = employees.find(
          (employee) => employee.id === userShift.user_id
        );
        if (!employee) return;
        employeeData.push({
          employeeId: employee.id,
          hours: dayjs(userShift.endTime).diff(
            dayjs(userShift.startTime),
            "hour"
          ),
          shifts: 1,
          name: employee.full_name,
          targetHours: employee.targetHours,
        });
      }
    });
    return employeeData;
  }, [userShifts, employees]);

  return employeeDate;
}

interface EmployeeData {
  employeeId: User["id"];
  shifts: number;
  hours: number;
  name: string;
  targetHours: number;
}
