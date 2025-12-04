import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { startTransition, useState } from "react";
import { useFormStatus } from "react-dom";

import { AuthFields } from "./auth-fields";
import { signUpMutation } from "./services/actions";
import type { APIErrorBody } from "./services/router";
import { useUserContext } from "./user-context";

type SignUpFormProps = {
  onSignInClick: () => void;
};

export const SignUpForm = ({ onSignInClick }: SignUpFormProps) => {
  const userContext = useUserContext();

  const [result, setResult] = useState<APIErrorBody>();

  const action = async (formData: FormData) => {
    const result = await signUpMutation(formData);

    startTransition(() => {
      setResult(result ?? undefined);

      if (!result) {
        userContext.invalidate();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FormContent result={result} />
          <Button onClick={onSignInClick} type="button" variant="link">
            Sign In
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

type FormContentProps = {
  result?: APIErrorBody;
};

const FormContent = ({ result }: FormContentProps) => {
  const { pending } = useFormStatus();

  return (
    <>
      <AuthFields pending={pending} result={result} />
      <Button disabled={pending} type="submit">
        {pending ? <Spinner /> : null}
        Sign Up
      </Button>
    </>
  );
};
