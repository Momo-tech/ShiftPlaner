interface TimesInputProps {
  possibleTimes: { startTime: Date; endTime: Date }[];
  onSubmit: (times: { startTime: Date; endTime: Date }[]) => void;
}

export function timesInput(props: TimesInputProps) {
  return <div className="times-input"></div>;
}
