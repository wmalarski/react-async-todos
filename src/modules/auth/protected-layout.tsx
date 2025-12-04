import { type PropsWithChildren, use, useState } from "react";

import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { useUserContext } from "./user-context";

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const userContext = useUserContext();

  const user = use(userContext.promise);

  return <>{user.data.user ? children : <UnauthorizedRouting />}</>;
};

export const UnauthorizedRouting = () => {
  const [showSignIn, setShowSignIn] = useState(true);

  const onToggleView = () => {
    setShowSignIn((current) => !current);
  };

  if (showSignIn) {
    return <SignInForm onSignUpClick={onToggleView} />;
  }

  return <SignUpForm onSignInClick={onToggleView} />;
};
