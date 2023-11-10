import { useEffect, useState, useMemo, useRef } from 'react';
import { MonthPickerInput } from "@mantine/dates";
import { UserShift } from 'models/UserShift';
import { getUserShifts } from 'supabase/userShiftFunctions';
import { useUserContext } from 'util/context';
import { UserCalendar } from '../../components/UserCalendar/UserCalendar';
import { UserShiftSummary } from "components/UserShiftSummary/UserShiftSummary";
import dayjs from "dayjs";
import './home.scss';

export const Home = () => {
	const [now] = useState<Date | undefined>(new Date());
	const [month, setMonth] = useState<Date | undefined>(new Date());
	const [userShifts, setUserShifts] = useState<UserShift[]>([]);
	const user = useUserContext();
	const calendarRef = useRef(null);

	useEffect(() => {
		handleGetUserShifts();
		changeMonth();
	}, [user?.id, month]);

	const handleGetUserShifts = async () => {
		if (!user) {
			return;
		}

		const userShifts = await getUserShifts(user.id, user.com_id, [
			dayjs(month).startOf("month").toDate(),
			dayjs(month).endOf("month").toDate()
		]);
		setUserShifts(userShifts ?? []);
	};
	
	const changeMonth = () => {
		updateCalendarDate();
	};

	const updateCalendarDate = () => {
		if (calendarRef.current) {
			const calendarApi = calendarRef.current.getApi();
			calendarApi.gotoDate(dayjs(month).startOf("month").toDate());
		}
	};


	const shiftData = useMemo(() => {
		const passedDates = {
			shiftAmount: 0,
			hours: 0,
			breaks: 0,
			wage: 0
		};
		const upcomingDates = {
			shiftAmount: 0,
			hours: 0,
			breaks: 0,
			wage: 0
		};

		userShifts.forEach((userShift) => {
			const wage = user?.hourlyWage;
			const shiftLength = dayjs(userShift.endTime).diff(
				dayjs(userShift.startTime),
				"hour"
			);
			if (userShift.endTime < now) {
				passedDates.shiftAmount += 1;
				passedDates.hours += shiftLength
				passedDates.breaks += userShift.break
				passedDates.wage += wage * shiftLength
			} else {
				upcomingDates.shiftAmount += 1;
				upcomingDates.hours += shiftLength
				upcomingDates.breaks += userShift.break
				upcomingDates.wage += wage * shiftLength
			}
		});
		return { passed: passedDates, upcoming: upcomingDates }
	}, [userShifts]);

	return (
		<div>
			<h2>Übersicht</h2>
			<div className="home-page-grid">
				<div className="home-page-grid__calender">
					<UserCalendar innerRef={calendarRef} userShifts={userShifts} />
				</div>
				<div className="home-page-grid__shift-overview">
					<MonthPickerInput
						label="Info"
						placeholder="Pick month"
						value={month}
						onChange={(change) =>
							setMonth(change ? new Date(change?.toISOString()) : new Date())
						}
					/>

					<UserShiftSummary 
						headline="Vergangene Schichten" 
						shiftData={shiftData.passed} 
					/>

					<UserShiftSummary
						headline="Geplante Schichten"
						shiftData={shiftData.upcoming}
					/>
				</div>
			</div>
		</div>
	);
};
