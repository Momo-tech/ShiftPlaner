export const UserContext = createContext<User | undefined>(undefined);

export function useUserContext() {
  return useContext(UserContext);
}
