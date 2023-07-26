import { Modal, Select, TextInput } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { ModalFooter } from "components/ModalFooter/ModalFooter";
import dayjs from "dayjs";
import { Repeats, Shift, getNameForRepeats } from "models/Shift";
import { useState } from "react";
import { createShift } from "supabase/shiftFunctions";
import { useUserContext } from "util/context";
import "./createShiftModal.scss";

interface CreateShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateShiftModal = (props: CreateShiftModalProps) => {
  const [shiftName, setShiftName] = useState("");
  const [startTime, setStartTime] = useState<string | number>("16:00");
  const [endTime, setEndTime] = useState<string | number>("16:00");
  const [repeats, setRepeats] = useState<Repeats>(Repeats.DAILY);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserContext();
  const handleCreateShift = async () => {
    setIsSubmitting(true);
    if (!startTime || !endTime) return;

    const startTimeSplit = startTime.toString().split(":");
    const endTimeSplit = endTime.toString().split(":");
    if (startTimeSplit.length !== 2 || endTimeSplit.length !== 2) return;
    if (!user) return;
    const shiftToCreate = new Shift({
      name: shiftName,
      startTime: dayjs()
        .hour(Number(startTimeSplit[0]))
        .minute(Number(startTimeSplit[1]))
        .toDate(),
      endTime: dayjs()
        .hour(Number(endTimeSplit[0]))
        .minute(Number(endTimeSplit[1]))
        .toDate(),
      repeats: repeats,
      company_id: user.com_id,
    });
    const result = await createShift(shiftToCreate);
    if (!result)
      notifications.show({
        title: "Fehler",
        message: "Schicht konnte nicht erstellt werden",
      });
    setIsSubmitting(false);
    props.onClose();
    setIsSubmitting(false);
  };

  return (
    <Modal
      opened={props.isOpen}
      onClose={props.onClose}
      className="create-shift-modal"
      title="Schicht erstellen"
      size="md"
    >
      <div className="create-shift-modal">
        <div className="create-shift-modal__input">
          <TextInput
            value={shiftName}
            onChange={(event) => setShiftName(event.currentTarget.value)}
            label="Name"
            placeholder="Name"
          />
        </div>
        <div className="create-shift-modal__input">
          <TimeInput
            value={startTime}
            onChange={(event) => setStartTime(event.currentTarget.value)}
            label="Startzeit"
            placeholder="Startzeit"
          />
        </div>
        <div className="create-shift-modal__input">
          <TimeInput
            value={endTime}
            onChange={(event) => setEndTime(event.currentTarget.value)}
            label="Endzeit"
            placeholder="Endzeit"
          />
        </div>
        <div className="create-shift-modal__input">
          <Select
            value={repeats}
            onChange={(event) =>
              setRepeats(Repeats[event as keyof typeof Repeats])
            }
            label="Wiederholungen"
            placeholder="Wiederholungen"
            data={WeekDaySelectData}
          />
        </div>
        <ModalFooter
          loading={isSubmitting}
          onSave={handleCreateShift}
          saveLabel="Erstellen"
          onDismiss={props.onClose}
        />
      </div>
    </Modal>
  );
};

const WeekDaySelectData = Object.keys(Repeats).map((key) => ({
  value: key,
  label: getNameForRepeats(Repeats[key as keyof typeof Repeats]),
}));
