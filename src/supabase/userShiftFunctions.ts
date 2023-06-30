import { supabase } from "../config";
import { User } from "../models/User";
import { UserShift } from "../models/UserShift";

export async function getUserShifts(userId: User["id"]) {
  try {
    const { data, error, status } = await supabase
      .from("user_shift")
      .select(
        `
            id, 
            user_id, 
            date,
            created_at,
            shift ( id, startTime, endTime, name  )
          `
      )
      .eq("user_id", userId);
    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      return [];
    }
    const userShifts: UserShift[] = data?.map((data) => {
      const shift: {
        id: string;
        startTime: Date;
        endTime: Date;
        name: string;
      } | null = data.shift.length > 0 ? data.shift.pop() ?? null : null;
      return new UserShift({
        id: data.id,
        created_at: data.created_at,
        date: new Date(data.date),
        endTime: shift?.endTime ? new Date(shift.endTime) : new Date(),
        startTime: shift?.startTime ? new Date(shift.startTime) : new Date(),
        name: shift?.name,
      });
    });
    return userShifts;
  } catch (error: any) {
    alert(error.message);
  }
}
