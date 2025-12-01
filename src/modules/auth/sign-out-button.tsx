import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";

import { LogOutIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

import { useUserContext } from "./user-context";

export const SignOutButton = () => {
  const userContext = useUserContext();

  const signOutAction = async () => {
    await orpc.auth.signOut();
    userContext.invalidate();
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
