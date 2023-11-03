import { useState } from "react";
import { UserShift } from "../../models/UserShift";
import "./userShiftOverview.scss";

interface UserShiftOverviewPropos {
  userShifts: UserShift[];
  userWage: number | undefined;
}

export function UserShiftOverview(props: UserShiftOverviewPropos) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    let shiftsDone = 0;
    let shiftsPlanned = 0;

    let hoursDone = 0;
    let hoursPlanned = 0;

    let breaksDone = 0;
    let breaksPlanned = 0;

    let wagesDone = 0;
    let wagesPlanned = 0;

  const monthChanged = (selectedOption: any) => {
    setCurrentMonth(Number(selectedOption.target.value));
  };

  const yearChanged = (selectedOption: any) => {
    setCurrentYear(Number(selectedOption.target.value));
  };

  console.log(props.userShifts);

  // get all shifts in currentMonth of props.userShifts
  const shiftsInMonth = props.userShifts.filter(
    (userShift) =>
      userShift.date.getMonth() + 1 === currentMonth &&
      userShift.date.getFullYear() === currentYear
  );

  // loop throuth all shiftsInMonth
  shiftsInMonth.forEach((shift) => {
    if (shift.startTime < new Date()){
        shiftsDone += 1;
        hoursDone += Math.round(((shift.endTime.valueOf() - shift.startTime.valueOf()) / (1000 * 60 * 60)));
        breaksDone += (shift.break);
        if (props.userWage != undefined)
        wagesDone += hoursDone * props.userWage;
    } else {
        shiftsPlanned += 1;
        hoursPlanned += Math.round(((shift.endTime.valueOf() - shift.startTime.valueOf()) / (1000 * 60 * 60)));
        breaksPlanned += shift.break;
        if (props.userWage != undefined)
        wagesPlanned += hoursPlanned * props.userWage
    }
  });
  return (
    // create a headline called "Info" and a combo box to select a month
    <div className="userShiftOverview">
        <h1>Info</h1>
        <select onChange={monthChanged} value={currentMonth}>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
          </select>
          <select v-model="overviewYear" onChange={yearChanged} value={currentYear}>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
          <option value="2026">2026</option>
          <option value="2027">2027</option>
          <option value="2028">2028</option>
          <option value="2029">2029</option>
          <option value="2030">2030</option>
          </select>

          <h2>Vergangene</h2>
          <div className="shiftTable">
            <p className="shiftTableLabel">Schichten: </p>
            <p className="shiftTableValue">{shiftsDone}</p>
            <p className="shiftTableLabel">Stunden: </p>
            <p className="shiftTableValue">{hoursDone}</p>
            <p className="shiftTableLabel">Pause: </p>
            <p className="shiftTableValue">{breaksDone}</p>
            <p className="shiftTableLabel">Lohn: </p>
            <p className="shiftTableValue">{wagesDone}</p>
          </div>
          <h2>Geplant</h2>
          <div className="shiftTable">
            <p className="shiftTableLabel">Schichten: </p>
            <p className="shiftTableValue">{shiftsPlanned}</p>
            <p className="shiftTableLabel">Stunden: </p>
            <p className="shiftTableValue">{hoursPlanned}</p>
            <p className="shiftTableLabel">Pause: </p>
            <p className="shiftTableValue">{breaksPlanned}</p>
            <p className="shiftTableLabel">Lohn: </p>
            <p className="shiftTableValue">{wagesPlanned}</p>
          </div>
    </div>
  ) 
  ;
}