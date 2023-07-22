export class User {
  public id: string;
  public updated_at: Date;
  public email: string;
  public full_name: string;
  public com_id: string;
  public role: Role;
  public targetHours: number;
  constructor(initialValues: Partial<User>) {
    this.id = initialValues.id ?? "";
    this.updated_at = initialValues.updated_at ?? new Date();
    this.email = initialValues.email ?? "";
    this.full_name = initialValues.full_name ?? "";
    this.com_id = initialValues.com_id ?? "";
    this.role = initialValues.role ?? Role.EMPLOYEE;
    this.targetHours = initialValues.targetHours ?? 0;
  }
}

export enum Role {
  OWNER = "OWNER",
  PLANER = "PLANER",
  EMPLOYEE = "EMPLOYEE",
}

export function getNameForRole(role: Role) {
  switch (role) {
    case Role.EMPLOYEE:
      return "Mitarbeiter";
    case Role.OWNER:
      return "Besitzer";
    case Role.PLANER:
      return "Planer";
  }
}
export function getRoleForName(name: string) {
  return Object.values(Role).find((value) => value === name);
}

export function isAtLeastPlaner(role: Role | undefined) {
  if (role === Role.OWNER || role === Role.PLANER) {
    return true;
  } else {
    return false;
  }
}
