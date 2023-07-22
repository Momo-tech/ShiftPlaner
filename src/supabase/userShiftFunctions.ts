import dayjs from "dayjs";
import { Company } from "models/Company";
import { OpenShift } from "models/OpenShift";
import { supabase } from "../config";
import { User } from "../models/User";
import { UserShift } from "../models/UserShift";

export async function getAllShiftsInDateRange(
  company_id: Company["id"],
  dateRange: [Date, Date]
) {
  try {
    const { data, error, status } = await supabase
      .from("shift")
      .select(
        `
            name,
            id,
            company_id,
            user_shift ( id, user_id, date, start_time, end_time ,created_at )
          `
      )
      .eq("company_id", company_id)
      .lte("user_shift.date", dateRange?.[1].toISOString())
      .gte("user_shift.date", dateRange?.[0].toISOString());
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
            endTime: shift.end_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(shift.end_time).hour())
                  .set("minute", dayjs(shift.end_time).minute())
                  .toDate()
              : new Date(),
            startTime: shift.start_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(shift.start_time).hour())
                  .set("minute", dayjs(shift.start_time).minute())
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
            name,
            id,
            company_id,
            user_shift ( id, user_id, date, start_time, end_time ,created_at )
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
            name,
            id,
            user_shift ( id, user_id,  start_time, end_time ,date, created_at )
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
            endTime: shift.end_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(shift.end_time).hour())
                  .set("minute", dayjs(shift.end_time).minute())
                  .toDate()
              : new Date(),
            startTime: shift.start_time
              ? dayjs(shift.date)
                  .set("hour", dayjs(shift.start_time).hour())
                  .set("minute", dayjs(shift.start_time).minute())
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

export async function assignOpenShiftToUser(
  userId: User["id"],
  openShift: OpenShift
) {
  const { error } = await supabase.from("user_shift").insert({
    user_id: userId,
    shift_id: openShift.shiftId,
    date: openShift.date,
    company_id: openShift.company_id,
    start_time: openShift.startTime,
    end_time: openShift.endTime,
  });

  if (error) {
    console.error(error);
    return false;
  } else {
    return await deleteOpenShiftsAfterAssign(openShift.id);
  }
}

async function deleteOpenShiftsAfterAssign(openShiftId: OpenShift["id"]) {
  const { error } = await supabase.rpc("delete_after_user_shift_assign", {
    open_shift_id_to_delete: openShiftId,
  });
  if (error) {
    return false;
  }
  return true;
}
