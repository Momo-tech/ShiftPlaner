export class Shift {
  public id: string;
  public created_at: Date;
  public weekDays: Weekday[] | null;
  public startTime: Date;
  public endTime: Date;
  public company_id: string;
  public name: string;
  public repeats: Repeats;
  constructor(initialValues: Partial<Shift>) {
    this.id = initialValues.id ?? "";
    this.created_at = initialValues.created_at ?? new Date();
    this.weekDays = initialValues.weekDays ?? [Weekday.Monday];
    this.startTime = initialValues.startTime ?? new Date();
    this.endTime = initialValues.endTime ?? new Date();
    this.company_id = initialValues.company_id ?? "";
    this.name = initialValues.name ?? "";
    this.repeats = initialValues.repeats ?? Repeats.WEEKLY;
  }
}

enum Weekday {
  Monday = "MONDAY",
  Tuesday = "TUESDAY",
  Wednesday = "WEDNESDAY",
  Thursday = "THURSDAY",
  Friday = "FRIDAY",
  Saturday = "SATURDAY",
  Sunday = "SUNDAY",
}

enum Repeats {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}
