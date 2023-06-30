import { supabase } from "../config";
import { User } from "../models/User";

export async function getUser(userId: string) {
  try {
    const { data, error, status } = await supabase
      .from("users")
      .select(`*`)
      .eq("id", userId)
      .single();

    if (error && status !== 406) {
      throw error;
    }

    return new User(data);
  } catch (error: any) {
    alert(error.message);
  }
}
