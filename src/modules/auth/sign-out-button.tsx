import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";

import { LogOutIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

type SignOutButtonProps = {
  onSignOut: () => void;
};

export const SignOutButton = ({ onSignOut }: SignOutButtonProps) => {
  const { pending } = useFormStatus();

  const signOutAction = async () => {
    await orpc.auth.signOut();
    onSignOut();
  };

  return (
    <form action={signOutAction}>
      <Button disabled={pending} type="submit" variant="outline">
        {pending ? <Spinner /> : <LogOutIcon />}
        Sign Out
      </Button>
    </form>
  );
};
