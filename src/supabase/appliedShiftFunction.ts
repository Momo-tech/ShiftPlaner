import { supabase } from "config";
import { AppliedShift } from "models/AppliedShift";
import { Company } from "models/Company";
import { OpenShift } from "models/OpenShift";
import { User } from "models/User";

export async function applyToShifts(shifts: OpenShift[], user: User) {
  const appliedShits = shifts.map((shift) => ({
    open_shift_id: shift.id,
    user_id: user.id,
    company_id: user.com_id,
  }));
  const { error } = await supabase.from("applied_shift").insert(appliedShits);
  if (error) {
    console.log(error);
    return false;
  } else {
    return true;
  }
}

export async function getAppliedShifts() {
  try {
    const { data, error, status } = await supabase
      .from("applied_shift")
      .select("*");
    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      return [];
    }
    return data.map((shift) => new AppliedShift(shift));
  } catch (error: any) {
    alert(error.message);
  }
}

export async function getAllAppliedShiftsForCompanyAndOpenShift(
  companyId: Company["id"],
  openShiftId: OpenShift["id"]
) {
  try {
    const { data, error, status } = await supabase
      .from("applied_shift")
      .select("*")
      .eq("company_id", companyId)
      .eq("open_shift_id", openShiftId);
    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      return [];
    }
    return data.map((shift) => new AppliedShift(shift));
  } catch (error: any) {
    alert(error.message);
  }
}
