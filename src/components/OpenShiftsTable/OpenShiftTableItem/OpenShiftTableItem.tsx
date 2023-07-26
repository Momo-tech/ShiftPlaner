import { Button, Checkbox, Select, SelectItem } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { AppliedShift } from 'models/AppliedShift';
import { OpenShift } from 'models/OpenShift';
import { User } from 'models/User';
import { useEffect, useState } from 'react';
import { getAllAppliedShiftsForCompanyAndOpenShift } from 'supabase/appliedShiftFunction';
import { deleteOpenShift } from 'supabase/openShiftFunction';
import { getAllUsersForComapny } from 'supabase/userFunctions';
import { Trash } from 'tabler-icons-react';
import { useOrganizationContext, useUserContext } from 'util/context';
import { OpenShiftsTableType } from '../OpenShiftsTable';
import './openShiftTableItem.scss';

interface OpenShiftTableItemProps {
  shift: OpenShift;
  type: OpenShiftsTableType;
  /***
   * This function is called when the user clicks on the shift. Needed for Applying
   */
  onShiftClick?: (shiftId: OpenShift['id']) => void;
  /***
   *
   */
  onSelectionChange?: (
    userId: User['id'] | null,
    openShiftId: OpenShift['id']
  ) => void;
  onDelete?: (shiftId: OpenShift['id']) => void;
}

export const OpenShiftTableItem = (props: OpenShiftTableItemProps) => {
  const [isSelected, setIsSlected] = useState<boolean>(false);
  const [data, setData] = useState<ShiftToApplyData | null>(null);
  const user = useUserContext();
  const { users } = useOrganizationContext();

  const handleGetData = async () => {
    if (!user) {
      return;
    }
    //FIXME craete context for this or it will be called for every item
    const appliedShifts = await getAllAppliedShiftsForCompanyAndOpenShift(
      user.com_id,
      props.shift.id
    );
    setData({ users: users ?? [], appliedShifts: appliedShifts ?? [] });
  };
  useEffect(() => {
    if (props.type === OpenShiftsTableType.PLAN) {
      handleGetData();
    }
  }, [
    users
      .map((user) => user.id)
      .sort()
      .join(',')
  ]);

  const handleDeleteShift = async () => {
    const sucess = await deleteOpenShift(props.shift.id);
    if (sucess) {
      notifications.show({
        title: 'Schicht gelöscht',
        message: 'Die Schicht wurde erfolgreich gelöscht',
        color: 'green'
      });
    } else {
      notifications.show({
        title: 'Fehler',
        message: 'Die Schicht konnte nicht gelöscht werden',
        color: 'red'
      });
    }
    props.onDelete && props.onDelete(props.shift.id);
  };

  return (
    <div className="shift-to-apply">
      <div>{props.shift.name}</div>
      <div>{dayjs(props.shift.date).format('DD.MM.YYYY')}</div>
      <div>{dayjs(props.shift.startTime).format('HH:mm')}</div>
      <div>{dayjs(props.shift.endTime).format('HH:mm')}</div>
      {props.type === OpenShiftsTableType.PLAN && (
        <div className="shift-to-apply-actions">
          <Select
            data={
              data
                ? data?.users.map<SelectItem>((user) => ({
                    value: user.id,
                    label: `${user.full_name} ${
                      data.appliedShifts.find(
                        (shift) => shift.user_id === user.id
                      )
                        ? '(Beworben)'
                        : ''
                    } `
                  }))
                : []
            }
            onChange={(value) => {
              props.onSelectionChange &&
                props.onSelectionChange(value, props.shift.id);
            }}
            clearable={true}
          />
          <Button onClick={handleDeleteShift}>
            <Trash
              className="shift-to-apply-actions__delete"
              onClick={handleDeleteShift}
            />
          </Button>
        </div>
      )}
      {props.type === OpenShiftsTableType.APPLY && (
        <Checkbox
          className="shift-to-apply-checkbox"
          checked={isSelected}
          onChange={(event) => {
            event.stopPropagation();
            setIsSlected((prev) => !prev);
            props.onShiftClick && props.onShiftClick(props.shift.id);
          }}
        />
      )}
    </div>
  );
};

interface ShiftToApplyData {
  users: User[];
  appliedShifts: AppliedShift[];
}
