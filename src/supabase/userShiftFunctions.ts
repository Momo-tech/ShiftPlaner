import dayjs from "dayjs";
import { Company } from "models/Company";
import { supabase } from "../config";
import { User } from "../models/User";
import { UserShift } from "../models/UserShift";

export async function getUserShifts(
  userId: User["id"],
  company_id: Company["id"],
  dateRange?: [Date, Date]
) {
  try {
    const { data, error, status } = dateRange
      ? await supabase
          .from("shift")
          .select(
            `
            start_time,
            end_time,
            name,
            id,
            company_id,
            user_shift ( id, user_id, date, created_at )
          `
          )
          .eq("user_shift.user_id", userId)
          .eq("company_id", company_id)
          .lte("user_shift.date", dateRange?.[1].toISOString())
          .gte("user_shift.date", dateRange?.[0].toISOString())
      : await supabase
          .from("shift")
          .select(
            `
            company_id,
            start_time,
            end_time,
            name,
            id,
            user_shift ( id, user_id, date, created_at )
          `
          )
          .eq("user_shift.user_id", userId)
          .eq("company_id", company_id);
    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      return [];
    }
    const userShifts: UserShift[] = data?.flatMap((data) =>
      data.user_shift.map(
        (shift) =>
          new UserShift({
            id: shift.id,
            created_at: shift.created_at,
            user_id: shift.user_id,
            date: new Date(shift.date),
            endTime: data?.end_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(data.end_time).hour())
                  .set("minute", dayjs(data.end_time).minute())
                  .toDate()
              : new Date(),
            startTime: data?.start_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(data.start_time).hour())
                  .set("minute", dayjs(data.start_time).minute())
                  .toDate()
              : new Date(),
            name: data?.name,
          })
      )
    );
    return userShifts;
  } catch (error: any) {
    alert(error.message);
  }
}
