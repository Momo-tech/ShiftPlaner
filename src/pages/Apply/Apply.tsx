import { Button } from "@mantine/core";
import { OpenShift } from "models/OpenShift";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { applyToShifts } from "supabase/appliedShiftFunction";
import { getOpenShifts } from "supabase/openShiftFunction";
import { useUserContext } from "util/context";
import { ShiftToApply } from "./ShiftToApply/ShiftToApply";
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
      toast.success("Auf Schichten beworben.");
    } else {
      toast.error("Es ist ein Fehler aufgetretten, versuche es später erneut.");
    }
  };

  return (
    <div>
      <h2>Auf Schichten Bewerben</h2>
      <div className="apply-header-line">
        <div>Name</div>
        <div>Datum</div>
        <div>Startzeit</div>
        <div>Endzeit</div>
        <div>Bewerben</div>
      </div>
      <div className="apply-shifts">
        {openShifts.map((shift) => (
          <ShiftToApply
            key={shift.id}
            shift={shift}
            onShiftClick={handleShiftClick}
          />
        ))}
      </div>
      <div className="apply-button-container">
        <Button onClick={handleApply}>Bewerben</Button>
      </div>
    </div>
  );
};
