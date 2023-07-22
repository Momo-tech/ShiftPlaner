import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  OpenShiftsTable,
  OpenShiftsTableType,
} from "components/OpenShiftsTable/OpenShiftsTable";
import { StyledLoading } from "components/StyledLoading/StyledLoading";
import { OpenShift } from "models/OpenShift";
import { useEffect, useState } from "react";
import { getOpenShifts } from "supabase/openShiftFunction";
import { assignOpenShiftToUser } from "supabase/userShiftFunctions";
import { useUserContext } from "util/context";
import { EmployeesOverview } from "./EmployeesOverview/EmployeesOverview";
import "./plan.scss";

export const Plan = () => {
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([]);
  const [selectedShiftIds, setSelectedShiftsIds] = useState<string[]>([]);
  const [shiftsToAssign, setShiftsToAssign] = useState<{
    [openShiftId: string]: string | null;
  }>({});
  const user = useUserContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getOpenShiftsFromSupabase = async () => {
    if (!user) return;
    setIsLoading(true);
    const openShifts = await getOpenShifts(user.com_id);
    setOpenShifts(openShifts ?? []);
    setIsLoading(false);
  };
  useEffect(() => {
    getOpenShiftsFromSupabase();
  }, []);

  const handleShiftClick = (shiftId: OpenShift["id"]) => {
    if (selectedShiftIds.includes(shiftId)) {
      setSelectedShiftsIds(selectedShiftIds.filter((id) => id !== shiftId));
    } else {
      setSelectedShiftsIds([...selectedShiftIds, shiftId]);
    }
  };

  const handleAssignOpenShift = async () => {
    setIsSubmitting(true);
    const keys = Object.keys(shiftsToAssign);
    let success = true;
    for (const openShiftId of keys) {
      const openShift = openShifts.find(
        (shift) => shift.id.toString() === openShiftId
      );
      const userId = shiftsToAssign[openShiftId];
      if (!(openShift && userId)) return;

      const result = await assignOpenShiftToUser(userId, openShift);
      if (!result) success = false;
    }
    notifications.show({
      title: success ? "Erstellt" : "Fehler",
      message: success
        ? "Schichten erstellt"
        : "Es ist ein Fehler aufgetretten, versuche es später erneut.",
    });
    setIsSubmitting(false);
    getOpenShiftsFromSupabase();
  };

  const handleSelectionChange = (
    userId: string | null,
    openShiftId: OpenShift["id"]
  ) => {
    setShiftsToAssign((prev) => ({ ...prev, [openShiftId]: userId }));
  };

  return (
    <div>
      {isLoading ? (
        <StyledLoading />
      ) : (
        <>
          <h2>Plan</h2>
          <div className="plan-shift-grid-container">
            <div className="plan-shift-grid-container__table">
              <OpenShiftsTable
                type={OpenShiftsTableType.PLAN}
                shifts={openShifts}
                onShiftItemClick={handleShiftClick}
                onSelectionChange={handleSelectionChange}
              />
            </div>
            <div className="plan-shift-grid-container__employees-overview">
              <EmployeesOverview />
            </div>
          </div>
          <div className="plan-button-container">
            <Button loading={isSubmitting} onClick={handleAssignOpenShift}>
              Zuweisen
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
