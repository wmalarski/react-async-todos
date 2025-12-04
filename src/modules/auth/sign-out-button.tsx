import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { LogOutIcon } from "lucide-react";
import { startTransition } from "react";
import { useFormStatus } from "react-dom";

import { signOutMutation } from "./services/actions";
import { useUserContext } from "./user-context";

export const SignOutButton = () => {
  const userContext = useUserContext();

  const signOutAction = async () => {
    await signOutMutation();

    startTransition(() => {
      userContext.invalidate();
    });
  };

  return (
    <form action={signOutAction}>
      <FormButton />
    </form>
  );
};

const FormButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending} type="submit" variant="outline">
      {pending ? <Spinner /> : <LogOutIcon />}
      Sign Out
    </Button>
  );
};
