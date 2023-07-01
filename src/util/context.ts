import { createContext, useContext } from "react";
import { User } from "../models/User";

export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
  return useContext(UserContext);
}
