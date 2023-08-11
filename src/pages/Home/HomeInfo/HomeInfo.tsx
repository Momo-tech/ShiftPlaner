import { MonthPickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { UserShift } from 'models/UserShift';
import { useState } from 'react';
import { useUserContext } from 'util/context';
import './homeInfo.scss';
import { calculateWorkHoursForShifts } from './homeInfoUtil';

interface HomeInfoProps {
  shifts: UserShift[];
}

export const HomeInfo = (props: HomeInfoProps) => {
  const user = useUserContext();
  const [month, setMonth] = useState<Date | null>(new Date());
  const filteredShits = props.shifts.filter(
    (shift) => dayjs(shift.date).month() === dayjs(month).month()
  );
  const pastShifts = filteredShits.filter((shift) =>
    dayjs(shift.date)
      .hour(dayjs(shift.endTime).hour())
      .isBefore(dayjs(), 'hour')
  );
  const futureShifts = filteredShits.filter((shift) =>
    dayjs(shift.date).hour(dayjs(shift.endTime).hour()).isAfter(dayjs(), 'hour')
  );
  const workHoursPast = calculateWorkHoursForShifts(pastShifts);
  const workHoursFuture = calculateWorkHoursForShifts(futureShifts);
  const pauseHoursPast = pastShifts.reduce((acc, shift) => {
    return acc + shift.break;
  }, 0);
  const pauseHoursFuture = futureShifts.reduce((acc, shift) => {
    return acc + shift.break;
  }, 0);
  const wagesFuture = workHoursFuture * (user?.hourlyWage ?? 0);
  const wagesPast = workHoursPast * (user?.hourlyWage ?? 0);

  return (
    <div className="home-info">
      <h2 className="home-info__header">
        Info{' '}
        <MonthPickerInput value={month} onChange={(value) => setMonth(value)} />
      </h2>
      <div className="home-info-data-box-header">Vergangene</div>
      <div className="home-info-data-box">
        <div className="home-info-data-box__item">
          <div>Schichten</div>
          <div className="home-info-data-box__item--number">
            {pastShifts.length}
          </div>
        </div>

        <div className="home-info-data-box__item">
          <div>Stunden</div>
          <div className="home-info-data-box__item--number">
            {workHoursPast}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Pause</div>
          <div className="home-info-data-box__item--number">
            {pauseHoursPast}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Lohn</div>
          <div className="home-info-data-box__item--number">{wagesPast} €</div>
        </div>
      </div>
      <div className="home-info-data-box-header">Geplant</div>
      <div className="home-info-data-box">
        <div className="home-info-data-box__item">
          <div>Schichten</div>
          <div className="home-info-data-box__item--number">
            {futureShifts.length}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Stunden</div>
          <div className="home-info-data-box__item--number">
            {workHoursFuture}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Pause</div>
          <div className="home-info-data-box__item--number">
            {pauseHoursFuture}
          </div>
        </div>
        <div className="home-info-data-box__item">
          <div>Lohn</div>
          <div className="home-info-data-box__item--number">
            {wagesFuture} €
          </div>
        </div>
      </div>
    </div>
  );
};
