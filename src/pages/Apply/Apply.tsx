import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  OpenShiftsTable,
  OpenShiftsTableType,
} from "components/OpenShiftsTable/OpenShiftsTable";
import { OpenShift } from "models/OpenShift";
import { useEffect, useState } from "react";
import { applyToShifts } from "supabase/appliedShiftFunction";
import { getOpenShifts } from "supabase/openShiftFunction";
import { useUserContext } from "util/context";
import "./apply.scss";

export const Apply = () => {
  const [openShifts, setOpenShifts] = useState<OpenShift[]>([]);
  const [selectedShiftIds, setSelectedShiftsIds] = useState<string[]>([]);
  const user = useUserContext();
  const getOpenShiftsFromSupabase = async () => {
    if (!user) return;
    const openShifts = await getOpenShifts(user.com_id);
    setOpenShifts(openShifts ?? []);
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

  const handleApply = async () => {
    if (!user) {
      return;
    }
    const response = await applyToShifts(openShifts, user);
    if (response) {
      notifications.show({
        title: "Beworben",
        message: "Du hast dich für die Schicht beworben",
      });
    } else {
      notifications.show({
        title: "Fehler",
        message:
          "Es ist leider ein Fehler aufgetretten versuche es später erneut!",
      });
    }
  };

  return (
    <div>
      <h2>Auf Schichten Bewerben</h2>
      <OpenShiftsTable
        shifts={openShifts}
        type={OpenShiftsTableType.APPLY}
        onShiftItemClick={handleShiftClick}
      />
      <div className="apply-button-container">
        <Button onClick={handleApply}>Bewerben</Button>
      </div>
    </div>
  );
};
