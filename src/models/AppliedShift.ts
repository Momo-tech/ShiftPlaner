export class AppliedShift {
  public id: string;
  public created_at: Date;
  public company_id: string;
  public user_id: string;
  public open_shift_id: string;
  constructor(initialValues: Partial<AppliedShift>) {
    this.id = initialValues.id ?? "";
    this.created_at = initialValues.created_at ?? new Date();
    this.user_id = initialValues.user_id ?? "";
    this.open_shift_id = initialValues.open_shift_id ?? "";
    this.company_id = initialValues.company_id ?? "";
  }
}
