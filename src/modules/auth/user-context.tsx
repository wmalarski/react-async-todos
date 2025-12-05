import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { getUserQuery, type UserQueryOutput } from "./services/actions";

type UserContextValue = {
  promise: Promise<UserQueryOutput>;
  invalidate: () => void;
};

const UserContext = createContext<UserContextValue | null>(null);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [userQuery, setUserQuery] = useState(() => getUserQuery());

  const invalidate = useCallback(() => {
    setUserQuery(getUserQuery());
  }, []);

  const value = useMemo(
    () => ({ invalidate, promise: userQuery }),
    [userQuery, invalidate],
  );

  return <UserContext value={value}>{children}</UserContext>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext not defined");
  }

  return context;
};
