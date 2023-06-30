export class UserShift {
  public id: string;
  public user_id: string;
  public date: Date;
  public shift_id: string;
  public created_at: Date;
  public startTime: Date;
  public endTime: Date;
  public name: string;

  constructor(initialValues: Partial<UserShift>) {
    this.id = initialValues.id ?? "";
    this.created_at = initialValues.created_at ?? new Date();
    this.date = initialValues.date ?? new Date();
    this.shift_id = initialValues.shift_id ?? "";
    this.user_id = initialValues.user_id ?? "";
    this.startTime = initialValues.startTime ?? new Date();
    this.endTime = initialValues.endTime ?? new Date();
    this.name = initialValues.name ?? "";
  }
}
