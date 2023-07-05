import { MonthPickerInput } from "@mantine/dates";
import dayjs from "dayjs";
import { UserShift } from "models/UserShift";
import { useState } from "react";
import "./homeInfo.scss";
import { calculateWorkHoursForShifts } from "./homeInfoUtil";

interface HomeInfoProps {
  shifts: UserShift[];
}

export const HomeInfo = (props: HomeInfoProps) => {
  const [month, setMonth] = useState<Date | null>(new Date());
  const filteredShits = props.shifts.filter(
    (shift) => dayjs(shift.date).month() === dayjs(month).month()
  );
  const workHours = calculateWorkHoursForShifts(filteredShits);
  return (
    <div className="home-info">
      <h2 className="home-info__header">
        Info{" "}
        <MonthPickerInput value={month} onChange={(value) => setMonth(value)} />
      </h2>
      <div className="home-info-data-box-header">Done</div>
      <div className="home-info-data-box">
        <div className="home-info-data-box__item">
          <div>Shifts</div>
          <div className="home-info-data-box__item--number">
            {filteredShits.length}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Hours</div>
          <div className="home-info-data-box__item--number">{workHours}</div>
        </div>
      </div>
      <div className="home-info-data-box-header">Planned</div>
      <div className="home-info-data-box">
        <div className="home-info-data-box__item">
          <div>Shifts</div>
          <div className="home-info-data-box__item--number">
            {filteredShits.length}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Hours</div>
          <div className="home-info-data-box__item--number">{workHours}</div>
        </div>
      </div>
    </div>
  );
};
