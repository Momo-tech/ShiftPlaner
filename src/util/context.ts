import { createContext, useContext } from "react";
import { User } from "../models/User";

export const UserContext = createContext<User | undefined>(undefined);
export const OrganizationContext = createContext<OrganizationContextProps >({users: []});

export function useUserContext() {
  return useContext(UserContext);
}

export function useOrganizationContext() {
  return useContext(OrganizationContext);
}


interface OrganizationContextProps {
  users: User[],
}