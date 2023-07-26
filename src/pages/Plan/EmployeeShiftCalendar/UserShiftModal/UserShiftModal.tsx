import { Modal } from '@mantine/core';
import { DateInput, TimeInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { ModalFooter } from 'components/ModalFooter/ModalFooter';
import { UserSingleSelect } from 'components/UserSingleSelect/UserSingleSelect';
import dayjs from 'dayjs';
import { UserShift } from 'models/UserShift';
import { useEffect, useState } from 'react';
import { updateUserShift } from 'supabase/userShiftFunctions';

interface UserShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  userShift: UserShift;
  onSaved: (userShift: UserShift) => void;
}

export const UserShiftModal = (props: UserShiftModalProps) => {
  const [userShift, setUserShift] = useState<UserShift>(props.userShift);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUserShift(props.userShift);
  }, [props.userShift.id]);

  const handleUserShiftUpdate = (updateData: Partial<UserShift>) => {
    setUserShift({ ...userShift, ...updateData });
  };

  const getDatFromTime = (value: string | null) => {
    const times = value?.toString().split(':');

    if (!times || times.length !== 2) {
      return;
    }
    const hours = Number(times[0]);
    const minutes = Number(times[1]);
    const date = dayjs(userShift.date).hour(hours).minute(minutes).toDate();
    return date;
  };

  const getPauseFromTime = (value: string | null) => {
    const times = value?.toString().split(':');
    if (!times || times.length !== 2) {
      return;
    }
    const hours = Number(times[0]);
    const minutes = Number(times[1]);
    const pause = hours * 60 + minutes;
    return pause;
  };

  const handleSave = () => {
    setIsSubmitting(true);
    const saved = updateUserShift(userShift);
    if (!saved) {
      notifications.show({
        title: 'Fehler',
        message: 'Schicht konnte nicht gespeichert werden'
      });
      return;
    }
    notifications.show({
      title: 'Gespeichert',
      message: 'Schicht wurde erfolgreich gespeichert',
      color: 'green'
    });
    props.onClose();
    props.onSaved(userShift);
    setIsSubmitting(false);
  };

  const getTimeStringForNumber = (number: number) => {
    const hours = Math.floor(number / 60);
    const minutes = number % 60;
    return `${addLeadingZero(hours)}:${addLeadingZero(minutes)}`;
  };
  function addLeadingZero(number: number): string {
    // Convert the number to a string
    const numberString = number.toString();

    // If the number has only one digit, add a leading zero
    if (numberString.length === 1) {
      return `0${numberString}`;
    }

    // Otherwise, return the original number as a string
    return numberString;
  }

  return (
    <Modal
      opened={props.isOpen}
      onClose={props.onClose}
      title={userShift.name + ' Schicht bearbeiten'}
    >
      <div>
        <DateInput label="Datum" value={userShift.date} onChange={() => {}} />
        <TimeInput
          label="Start"
          value={dayjs(userShift.startTime).format('HH:mm')}
          onChange={(value) =>
            handleUserShiftUpdate({
              startTime: getDatFromTime(value.currentTarget.value)
            })
          }
        />
        <TimeInput
          label="Ende"
          value={dayjs(userShift.endTime).format('HH:mm')}
          onChange={(value) =>
            handleUserShiftUpdate({
              endTime: getDatFromTime(value.currentTarget.value)
            })
          }
        />
        <UserSingleSelect
          value={userShift.user_id}
          onChange={(value) =>
            handleUserShiftUpdate({ user_id: value ?? undefined })
          }
        />
        <TimeInput
          label="Pause"
          value={getTimeStringForNumber(userShift.break)}
          onChange={(value) =>
            handleUserShiftUpdate({
              break: getPauseFromTime(value.currentTarget.value)
            })
          }
        />
      </div>
      <ModalFooter loading={isSubmitting} onSave={handleSave} />
    </Modal>
  );
};
