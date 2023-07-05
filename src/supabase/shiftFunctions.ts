import { supabase } from "config";
import { Company } from "models/Company";
import { Shift } from "models/Shift";

export async function getShifts(companyId: Company["id"]) {
  try {
    const { data, error, status } = await supabase
      .from("shift")
      .select("*")
      .eq("company_id", companyId);
    if (!data) {
      return [];
    }
    if (error && status !== 406) {
      throw error;
    }
    const shifts: Shift[] = data.map(
      (data) =>
        new Shift({
          id: data.id,
          startTime: data.start_time,
          endTime: data.end_time,
          repeats: data.repeats,
          name: data.name,
          company_id: data.company_id,
        })
    );
    return shifts;
  } catch (error: any) {
    console.error(error);
  }
}

export async function createShift(shift: Shift) {
  try {
    const { error } = await supabase.from("shift").insert({
      company_id: shift.company_id,
      start_time: shift.startTime,
      end_time: shift.endTime,
      repeats: shift.repeats,
      name: shift.name,
    });
    if (error) {
      throw error;
    }
    return true;
  } catch (error: any) {
    console.error(error);
    return false;
  }
}
