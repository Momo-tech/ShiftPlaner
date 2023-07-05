import { Button } from "@mantine/core";
import { StyledLoading } from "components/StyledLoading/StyledLoading";
import { Shift } from "models/Shift";
import { CreateShiftModal } from "pages/Plan/CreateShiftModal/CreateShiftModal";
import { useEffect, useState } from "react";
import { getShifts } from "supabase/shiftFunctions";
import { Plus } from "tabler-icons-react";
import { useUserContext } from "util/context";
import { ShiftTable } from "./ShiftTable/ShiftTable";

export const CreateShifts = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [createShiftModalIsOpen, setCreateShiftModalIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const user = useUserContext();
  const getOpenShiftsFromSupabase = async () => {
    if (!user) return;
    setIsLoading(true);
    const openShifts = await getShifts(user.com_id);
    setShifts(openShifts ?? []);
    setIsLoading(false);
  };
  useEffect(() => {
    getOpenShiftsFromSupabase();
  }, []);

  return (
    <div>
      {isLoading ? (
        <StyledLoading />
      ) : (
        <>
          <h2>Schichten erstellen</h2>
          <div>
            <Button onClick={() => setCreateShiftModalIsOpen(true)}>
              <Plus />
              Schicht
            </Button>
          </div>
          <ShiftTable shifts={shifts} />
        </>
      )}
      <CreateShiftModal
        isOpen={createShiftModalIsOpen}
        onClose={() => setCreateShiftModalIsOpen(false)}
      />
    </div>
  );
};
