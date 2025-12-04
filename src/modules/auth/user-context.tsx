import type { OrpcOutputs } from "@/integrations/orpc/client";

import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { getUserQuery, type UserQueryOutput } from "./services/actions";

export type User = OrpcOutputs["auth"]["getUser"];

type UserContextValue = {
  user: Promise<UserQueryOutput>;
  invalidate: () => void;
} | null;

const UserContext = createContext<UserContextValue>(null);

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [userQuery, setUserQuery] = useState(() => getUserQuery());

  const invalidate = useCallback(() => {
    setUserQuery(getUserQuery());
  }, []);

  const value = useMemo(
    () => ({ invalidate, user: userQuery }),
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
