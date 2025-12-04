import {
  createContext,
  type PropsWithChildren,
  use,
  useContext,
  useState,
} from "react";

import { SignInForm } from "./sign-in-form";
import { SignUpForm } from "./sign-up-form";
import { useUserContext } from "./user-context";

export const ProtectedLayout = ({ children }: PropsWithChildren) => {
  const userContext = useUserContext();

  const user = use(userContext.user);

  return (
    <LoggedInContextProvider isLoggedIn={Boolean(user.data.user)}>
      {user.data.user ? children : <UnauthorizedRouting />}
    </LoggedInContextProvider>
  );
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

type LoggedInContextValue = {
  isLoggedIn: boolean;
} | null;

const LoggedInContext = createContext<LoggedInContextValue>(null);

type LoggedInContextProviderProps = PropsWithChildren<{
  isLoggedIn: boolean;
}>;

const LoggedInContextProvider = ({
  children,
  isLoggedIn,
}: LoggedInContextProviderProps) => {
  return <LoggedInContext value={{ isLoggedIn }}>{children}</LoggedInContext>;
};

export const useIsLoggedIn = () => {
  const context = useContext(LoggedInContext);

  if (!context) {
    throw new Error("LoggedInContext is not defined");
  }

  return context.isLoggedIn;
};
