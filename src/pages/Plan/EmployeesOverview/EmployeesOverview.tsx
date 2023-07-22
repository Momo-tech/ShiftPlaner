import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useState } from "react";
import { useUserContext } from "util/context";
import "./employeesOverview.scss";
import { useEmployeeData } from "./useEmployeeData";

export const EmployeesOverview = () => {
  const [startDate, setStartDate] = useState<Date>(
    dayjs().startOf("month").toDate()
  );
  const [endDate, setEndDate] = useState<Date>(dayjs().endOf("month").toDate());
  const user = useUserContext();
  const employeeData = useEmployeeData(startDate, endDate, user?.com_id);

  return (
    <div className="employees-overview">
      <div className="employee-overview-headline">Mitarbeiter Übersicht</div>
      <div className="date-range-picker">
        <DateInput
          label="Von"
          placeholder="Von"
          value={startDate}
          clearable={false}
          onChange={(value) => setStartDate(value ?? new Date())}
        />
        <DateInput
          label="Bis"
          placeholder="Bis"
          value={endDate}
          clearable={false}
          onChange={(value) => setEndDate(value ?? new Date())}
        />
      </div>
      <div className="employees-list">
        <div className="employees-list__header">
          <div>Name</div>
          <div>Stunden</div>
          <div>Schichten</div>
          <div>Zielstunden</div>
        </div>
        {employeeData.map((data) => (
          <div className="employees-list__item" key={data.employeeId}>
            <div>{data.name}</div>
            <div>{data.hours} </div>
            <div>{data.shifts}</div>
            <div>{data.targetHours}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
