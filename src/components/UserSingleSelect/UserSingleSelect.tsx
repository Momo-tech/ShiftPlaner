import { Select, SelectItem } from '@mantine/core';
import { User } from 'models/User';
import { useState } from 'react';
import { useOrganizationContext } from 'util/context';

interface UserSingleSelectProps {
  value: User['id'] | null;
  onChange: (value: User['id'] | null) => void;
}

export function UserSingleSelect(props: UserSingleSelectProps) {
  const { users } = useOrganizationContext();
  const data =
    users?.map<SelectItem>((user) => ({
      value: user.id,
      label: user.full_name
    })) ?? [];
  return (
    <Select
      value={props.value}
      label="Mitarbeiter"
      onChange={props.onChange}
      data={data}
    />
  );
}
