import { notifications } from "@mantine/notifications";
import { Company } from "models/Company";
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

export async function getAllUsersForComapny(companyId: Company["id"]) {
  try {
    const { data, error, status } = await supabase
      .from("users")
      .select(`*`)
      .eq("com_id", companyId);

    if (error && status !== 406) {
      throw error;
    }
    if (!data) {
      throw new Error("No data found");
    }

    return data.map((user: any) => new User(user));
  } catch (error: any) {
    notifications.show({
      title: "Fehler",
      message: "Es ist ein Fehler aufgetretten, versuche es später erneut.",
    });
    console.error(error);
  }
}
