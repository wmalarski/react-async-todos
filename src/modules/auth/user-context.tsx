import type { router } from "@/integrations/orpc/router";

import type { InferRouterOutputs } from "@orpc/server";
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffectEvent,
  useMemo,
} from "react";

export type User = InferRouterOutputs<typeof router>["auth"]["getUser"];

type UserContextValue = {
  user: User | null;
  invalidate: () => void;
} | null;

export const UserContext = createContext<UserContextValue>(null);

type UserContextProviderProps = PropsWithChildren<{
  user: User | null;
  onInvalidate: () => void;
}>;

export const UserContextProvider = ({
  children,
  user,
  onInvalidate,
}: UserContextProviderProps) => {
  const invalidate = useEffectEvent(onInvalidate);

  const value = useMemo(() => ({ invalidate, user }), [user]);

  return <UserContext value={value}>{children}</UserContext>;
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("UserContext not defined");
  }

  return context;
};
