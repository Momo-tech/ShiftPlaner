import { Button } from '@mantine/core';
import dayjs from 'dayjs';
import { Shift } from 'models/Shift';
import { useState } from 'react';
import { Plus } from 'tabler-icons-react';
import { CreateNewOpenShiftModal } from './CreateNewUserShiftModal/CreateNewOpenShiftModal';
import './shiftTable.scss';

interface IShiftTableProps {
  shifts: Shift[];
}

export const ShiftTable = (props: IShiftTableProps) => {
  const [createNewUserShiftModalIsOpen, setCreateNewUserShiftModalIsOpen] =
    useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState<Shift | null>(null);
  return (
    <div className="shift-table">
      <div className="shift-table__header">
        <div>Name</div>
        <div>Start</div>
        <div>Ende</div>
        <div>Wiederholt</div>
        <div>Aktion</div>
      </div>
      <div className="shift-table__table">
        {props.shifts.map((shift) => (
          <div className="shift-table-item" key={shift.id}>
            <div>{shift.name}</div>
            <div>{dayjs(shift.startTime).format('HH:mm')}</div>
            <div>{dayjs(shift.endTime).format('HH:mm')}</div>
            <div>{shift.repeats}</div>
            <div>
              <Button
                variant="light"
                color="white"
                onClick={() => {
                  setCreateNewUserShiftModalIsOpen(true);
                  setSelectedShiftId(shift);
                }}
              >
                <Plus /> Mitarbeiter Schicht
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CreateNewOpenShiftModal
        shift={selectedShiftId}
        isOpen={createNewUserShiftModalIsOpen}
        onDismiss={() => setCreateNewUserShiftModalIsOpen(false)}
      />
    </div>
  );
};
