import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { rpcSuccessResult } from "@/integrations/orpc/rpc";

import { type PropsWithChildren, Suspense, use, useState } from "react";

import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";

const getUserQuery = async () => {
  const user = await orpc.auth.getUser();
  return rpcSuccessResult(user);
};

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const [userQuery, setUserQuery] = useState(() => getUserQuery());

  const onFormSuccess = () => {
    setUserQuery(getUserQuery());
  };

  return (
    <Suspense fallback={<Spinner />}>
      <UserRouting onFormSuccess={onFormSuccess} userQuery={userQuery}>
        {children}
      </UserRouting>
    </Suspense>
  );
};

type UserRoutingProps = PropsWithChildren<{
  userQuery: ReturnType<typeof getUserQuery>;
  onFormSuccess: () => void;
}>;

const UserRouting = ({
  children,
  userQuery,
  onFormSuccess,
}: UserRoutingProps) => {
  const user = use(userQuery);

  if (user.data) {
    return <>{children}</>;
  }

  return <UnauthorizedRouting onFormSuccess={onFormSuccess} />;
};

type UnauthorizedRoutingProps = {
  onFormSuccess: () => void;
};

const UnauthorizedRouting = ({ onFormSuccess }: UnauthorizedRoutingProps) => {
  const [showSignIn, setShowSignIn] = useState(true);

  const onToggleView = () => {
    setShowSignIn((current) => !current);
  };

  if (showSignIn) {
    return <SignInForm onSignIn={onFormSuccess} onSignUpClick={onToggleView} />;
  }

  return <SignUpForm onSignInClick={onToggleView} onSignUp={onFormSuccess} />;
};
