import { Spinner } from "@/components/ui/spinner";

import { type PropsWithChildren, Suspense, use, useState } from "react";

import { getUserQuery } from "./services/actions";
import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { UserContextProvider } from "./user-context";

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const [userQuery, setUserQuery] = useState(() => getUserQuery());

  const onInvalidate = () => {
    setUserQuery(getUserQuery());
  };

  return (
    <Suspense fallback={<Spinner />}>
      <UserRouting onInvalidate={onInvalidate} userQuery={userQuery}>
        {children}
      </UserRouting>
    </Suspense>
  );
};

type UserRoutingProps = PropsWithChildren<{
  userQuery: ReturnType<typeof getUserQuery>;
  onInvalidate: () => void;
}>;

const UserRouting = ({
  children,
  userQuery,
  onInvalidate,
}: UserRoutingProps) => {
  const user = use(userQuery);

  return (
    <UserContextProvider onInvalidate={onInvalidate} user={user.data}>
      {user.data ? children : <UnauthorizedRouting />}
    </UserContextProvider>
  );
};

const UnauthorizedRouting = () => {
  const [showSignIn, setShowSignIn] = useState(true);

  const onToggleView = () => {
    setShowSignIn((current) => !current);
  };

  if (showSignIn) {
    return <SignInForm onSignUpClick={onToggleView} />;
  }

  return <SignUpForm onSignInClick={onToggleView} />;
};
