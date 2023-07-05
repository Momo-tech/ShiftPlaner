import { Modal } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { ModalFooter } from "components/ModalFooter/ModalFooter";
import { OpenShift } from "models/OpenShift";
import { Shift } from "models/Shift";
import { useState } from "react";
import { createOpenShift } from "supabase/openShiftFunction";
import { useUserContext } from "util/context";
import "./createNewOpenShiftModal.scss";
import { getDatesForReapeatAndDateRange } from "./createNewOpenShiftModalUtil";

interface CreateNewOpenShiftModalProps {
  isOpen: boolean;
  shift: Shift | null;
  onDismiss: () => void;
}

export const CreateNewOpenShiftModal = (
  props: CreateNewOpenShiftModalProps
) => {
  const [from, setFrom] = useState<Date | null>(new Date());
  const [until, setUntil] = useState<Date | null>(null);
  const [isCreateShifts, setIsCreatingShifts] = useState(false);
  const user = useUserContext();
  const handleSave = async () => {
    if (!user) return;
    if (!from || !until) return;
    if (!props.shift) return;
    setIsCreatingShifts(true);
    const dates = getDatesForReapeatAndDateRange(props.shift.repeats, [
      from,
      until,
    ]);
    for (let date of dates) {
      await createOpenShift(
        new OpenShift({
          shiftId: props.shift.id,
          date: date,
          company_id: user.com_id,
        })
      );
    }
    setIsCreatingShifts(false);
    props.onDismiss();
  };
  return (
    <Modal
      title="Angestellten Schicht erstellen"
      opened={props.isOpen}
      onClose={props.onDismiss}
      size="md"
      className="create-new-user-shift-modal"
    >
      <div className="create-new-user-shift-modal__content">
        <DateInput
          value={from}
          onChange={(value) => setFrom(value)}
          label="Von"
        />
        <DateInput
          value={until}
          onChange={(value) => setUntil(value)}
          label="Bis"
        />
      </div>
      <ModalFooter
        loading={isCreateShifts}
        onSave={handleSave}
        onDismiss={props.onDismiss}
        saveLabel="Erstellen"
      />
    </Modal>
  );
};
