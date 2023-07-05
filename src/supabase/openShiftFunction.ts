import { supabase } from "config";
import dayjs from "dayjs";
import { Company } from "models/Company";
import { OpenShift } from "models/OpenShift";
export async function getOpenShifts(companyId: Company["id"]) {
  try {
    // TODO: only fetch shifts which not applied to already
    const { data, error, status } = await supabase
      .from("shift")
      .select(
        `
            start_time,
            end_time,
            name,
            id,
            company_id,
            open_shift ( id, date, created_at )`
      )
      .eq("company_id", companyId);

    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      return [];
    }
    const openShifts: OpenShift[] = data.flatMap((data) =>
      data.open_shift.map(
        (shift) =>
          new OpenShift({
            id: shift.id,
            created_at: shift.created_at,
            date: new Date(shift.date),
            endTime: data.end_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(data.end_time).hour())
                  .set("minute", dayjs(data.end_time).minute())
                  .toDate()
              : new Date(),
            startTime: data.start_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(data.start_time).hour())
                  .set("minute", dayjs(data.start_time).minute())
                  .toDate()
              : new Date(),
            name: data.name,
            shiftId: data.id,
            company_id: data.company_id,
          })
      )
    );
    return openShifts;
  } catch (error: any) {
    alert(error.message);
  }
}

export async function createOpenShift(openShift: OpenShift) {
  const { error } = await supabase.from("open_shift").insert({
    shift_id: openShift.shiftId,
    company_id: openShift.company_id,
    date: openShift.date,
  });
  if (error) {
    console.error(error);
    return false;
  }
  return true;
}
