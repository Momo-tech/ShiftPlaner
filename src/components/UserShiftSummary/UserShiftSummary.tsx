import { UserShift } from "models/UserShift";
import "./userShiftSummary.scss"
import { User } from "models/User";

interface IUserShiftSummaryProps {
    userShifts: UserShift[];
    dateRange: [Date, Date];
    user: User | undefined;
}

export function UserShiftSummary(props: IUserShiftSummaryProps) {
    const dateFormat = new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: 'long',
    });

    const pastShifts: UserShift[] = [];
    const futureShifts: UserShift[] = [];

    for (const userShift of props.userShifts) {
        if (
            userShift.endTime.getTime() < props.dateRange[0].getTime() 
            || userShift.startTime.getTime() > props.dateRange[1].getTime()
        ) {
            continue;
        }
        if (userShift.endTime.getTime() < new Date().getTime()) {
            pastShifts.push(userShift);
        } else if (userShift.startTime.getTime() > new Date().getTime()) {
            futureShifts.push(userShift);
        }
    }

    const pastShiftTime = pastShifts.reduce((acc, shift) => acc + (shift.endTime.getTime() - shift.startTime.getTime() - shift.break * 1000), 0);
    const futureShiftsTime = futureShifts.reduce((acc, shift) => acc + (shift.endTime.getTime() - shift.startTime.getTime() - shift.break * 1000), 0);

    return (
        <div className="user-shift-summary">
            <h2 className="user-shift-summary__heading">
                Info
                <span className="user-shift-summary__date-chip">{dateFormat.format(props.dateRange[0])}</span>
            </h2>
            <h3>Vergangene</h3>
            <div className="user-shift-summary__stat-group">
                <div className="user-shift-summary__stat">
                    <p>Schichten</p>
                    <p>{pastShifts.length}</p>
                </div>
                <div className="user-shift-summary__stat">
                    <p>Stunden</p>
                    <p>{durationToHourString(pastShiftTime)}</p>
                </div>
                <div className="user-shift-summary__stat">
                    <p>Stunden</p>
                    <p>{durationToHourString(pastShifts.reduce((acc, shift) => acc + shift.break * 1000, 0))}</p>
                </div>
                {props.user && (
                    <div className="user-shift-summary__stat">
                        <p>Lohn</p>
                        <p>{props.user.hourlyWage * pastShiftTime / 1000 / 3600} €</p>
                    </div>
                )}
            </div>
            <h3>Geplant</h3>
            <div className="user-shift-summary__stat-group">
                <div className="user-shift-summary__stat">
                    <p>Schichten</p>
                    <p>{futureShifts.length}</p>
                </div>
                <div className="user-shift-summary__stat">
                    <p>Stunden</p>
                    <p>{durationToHourString(futureShiftsTime)}</p>
                </div>
                <div className="user-shift-summary__stat">
                    <p>Stunden</p>
                    <p>{durationToHourString(futureShifts.reduce((acc, shift) => acc + shift.break * 1000, 0))}</p>
                </div>
                {props.user && (
                    <div className="user-shift-summary__stat">
                        <p>Lohn</p>
                        <p>{props.user.hourlyWage * futureShiftsTime / 1000 / 3600} €</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function durationToHourString(ms: number) {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms - hours * 1000 * 60 * 60) / (1000 * 60));
    return `${hours}:${String(minutes).padStart(2, "0")}`;
}