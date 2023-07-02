export class OpenShift {
  public id: string;
  public created_at: Date;
  public date: Date;
  public startTime: Date;
  public endTime: Date;
  public company_id: string;
  public name: string;
  constructor(initialValues: Partial<OpenShift>) {
    this.id = initialValues.id ?? "";
    this.created_at = initialValues.created_at ?? new Date();
    this.date = initialValues.date ?? new Date();
    this.startTime = initialValues.startTime ?? new Date();
    this.endTime = initialValues.endTime ?? new Date();
    this.company_id = initialValues.company_id ?? "";
    this.name = initialValues.name ?? "";
  }
}
