import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { rpcSuccessResult } from "@/integrations/orpc/rpc";

import { type PropsWithChildren, Suspense, use, useState } from "react";

const getUserQuery = async () => {
  const user = await orpc.auth.getUser();
  return rpcSuccessResult(user);
};

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const [userQuery] = useState(() => getUserQuery());

  return (
    <Suspense fallback={<Spinner />}>
      <UserRouting userQuery={userQuery}>{children}</UserRouting>
    </Suspense>
  );
};

type UserRoutingProps = PropsWithChildren<{
  userQuery: ReturnType<typeof getUserQuery>;
}>;

const UserRouting = ({ children, userQuery }: UserRoutingProps) => {
  const user = use(userQuery);

  if (user.data) {
    return <>{children}</>;
  }

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

const UnauthorizedRouting = () => {
  // const

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
};
