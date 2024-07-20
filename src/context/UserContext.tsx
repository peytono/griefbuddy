import React, {
  createContext, useState, useMemo,
} from 'react';

/** Defines the user from db */
export type AuthUser = {
  id: number,
  /** this is the user's full name */
  name: string,
  googleId: string,
  emConNum: string,
  emConName: string,
  emConRelationship: String,
  currMood: String,
  age: String,
  myLocation: String,
  myPhoneNumber: String,
  preferredName: String,
  userPicture: String
};

type UserContextType = {
  user: AuthUser | null,
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>
};

type UserContextProviderProps = {
  children: React.ReactNode
};

export const UserContext = createContext({} as UserContextType);

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const userState = useMemo(() => ({ user, setUser }), [user]);
  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
}
