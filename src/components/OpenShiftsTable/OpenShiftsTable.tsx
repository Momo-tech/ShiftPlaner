import { User } from "@supabase/supabase-js";
import { OpenShift } from "models/OpenShift";
import { OpenShiftTableItem } from "./OpenShiftTableItem/OpenShiftTableItem";
import "./openShiftsTable.scss";

export enum OpenShiftsTableType {
  APPLY = "APPLY",
  PLAN = "PLAN",
}

interface OpenShiftsTableProps {
  shifts: OpenShift[];
  type: OpenShiftsTableType;
  onShiftItemClick?: (shiftId: OpenShift["id"]) => void;
  onSelectionChange?: (
    userId: User["id"] | null,
    openShiftId: OpenShift["id"]
  ) => void;
}
export const OpenShiftsTable = (props: OpenShiftsTableProps) => {
  return (
    <div className="open-shifts-table">
      <div className="open-shifts-table__header-line">
        <div>Name</div>
        <div>Datum</div>
        <div>Startzeit</div>
        <div>Endzeit</div>
        <div>Aktion</div>
      </div>
      <div className="open-shifts-table__table">
        {props.shifts.map((shift) => (
          <OpenShiftTableItem
            key={shift.id}
            shift={shift}
            type={props.type}
            onSelectionChange={props.onSelectionChange}
            onShiftClick={props.onShiftItemClick}
          />
        ))}
      </div>
    </div>
  );
};
