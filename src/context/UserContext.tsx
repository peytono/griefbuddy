import React, {
  createContext, useState, useMemo,
} from 'react';

export type AuthUser = {
  id: number,
  name: string,
  googleId: string,
  emConNum: string,
  emConName: string,
  emConRelationship: String,
  currMood: String,
  agee: String,
  myLocation: String,
  myPhoneNumber: String,
  preferredName: String,
  chatbotName: string,
  // buddies: Buddy[];
};

// export type Buddy = {
//   id: number;
//   name: string;
// };

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

  // this doesn't change the functionality - the pages that still need context crash on refresh
  // useEffect(() => {
  //   axios.get('/user')
  //     .then(({ data }) => {
  //       console.log('setting user context');
  //       setUser(data);
  //     })
  //     .catch((err) => console.error('failed getting user', err));
  // }, [setUser]);

  const userState = useMemo(() => ({ user, setUser }), [user]);
  return (
    <UserContext.Provider value={userState}>
      {children}
    </UserContext.Provider>
  );
}
