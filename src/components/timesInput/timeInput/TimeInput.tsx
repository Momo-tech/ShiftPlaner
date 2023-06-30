interface TimesInputProps {
  possibleTime: { startTime: Date; endTime: Date };
  onClick: () => void;
}

export function TimeInput(props: TimesInputProps) {
  return (
    <div className="time-input">
      <button onClick={props.onClick}>
        {props.possibleTime.startTime.toLocaleTimeString()} -{" "}
        {props.possibleTime.endTime.toLocaleTimeString()}
      </button>
    </div>
  );
}
