import "./userShiftSummary.scss";

interface UserShiftSummaryProps {
	headline: string;
	shiftData: {
		shiftAmount: number,
		hours: number,
		breaks: number,
		wage: number
	}
}

export const UserShiftSummary = (props: UserShiftSummaryProps) => {
	return (
		<div>
			<h4>{props.headline}</h4>
			<ul className="list-group">
				<li>
					Schichten <span>{props.shiftData.shiftAmount}</span>
				</li>
				<li>
					Stunden <span>{props.shiftData.hours}</span>
				</li>
				<li>
					Pause <span>{props.shiftData.breaks}</span>
				</li>
				<li>
					Lohn <span>{props.shiftData.wage} €</span>
				</li>
			</ul>
		</div>
	);
};
