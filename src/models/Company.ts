export class Company {
  public id: string;
  public created_at: Date;
  public name: string;
  public email: string;
  public street: string;
  public city: string;
  public country: string;
  constructor(initialValues: Partial<Company>) {
    this.id = initialValues.id ?? "";
    this.created_at = initialValues.created_at ?? new Date();
    this.name = initialValues.name ?? "";
    this.email = initialValues.email ?? "";
    this.street = initialValues.street ?? "";
    this.city = initialValues.city ?? "";
    this.country = initialValues.country ?? "";
  }
}
