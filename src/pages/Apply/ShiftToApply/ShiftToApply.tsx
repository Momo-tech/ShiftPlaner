import { Checkbox } from "@mantine/core";
import dayjs from "dayjs";
import { OpenShift } from "models/OpenShift";
import { useState } from "react";
import "./shiftToApply.scss";

interface ShiftToApplyProps {
  shift: OpenShift;
  onShiftClick: (shiftId: OpenShift["id"]) => void;
}

export const ShiftToApply = (props: ShiftToApplyProps) => {
  const [isSelected, setIsSlected] = useState<boolean>(false);
  return (
    <div
      className="shift-to-apply"
      onClick={() => {
        setIsSlected((prev) => !prev);
        props.onShiftClick(props.shift.id);
      }}
    >
      <div>{props.shift.name}</div>
      <div>{dayjs(props.shift.date).format("DD.MM.YYYY")}</div>
      <div>{dayjs(props.shift.startTime).format("HH:mm")}</div>
      <div>{dayjs(props.shift.endTime).format("HH:mm")}</div>
      <Checkbox
        checked={isSelected}
        onChange={(event) => {
          event.stopPropagation();
          setIsSlected((prev) => !prev);
          props.onShiftClick(props.shift.id);
        }}
      />
    </div>
  );
};
