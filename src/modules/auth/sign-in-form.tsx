import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

import { startTransition, useState } from "react";
import { useFormStatus } from "react-dom";

import { AuthFields } from "./auth-fields";
import { signInMutation } from "./services/actions";
import type { APIErrorBody } from "./services/router";
import { useUserContext } from "./user-context";

type SignInFormProps = {
  onSignUpClick: () => void;
};

export const SignInForm = ({ onSignUpClick }: SignInFormProps) => {
  const userContext = useUserContext();

  const [result, setResult] = useState<APIErrorBody>();

  const action = async (formData: FormData) => {
    const result = await signInMutation(formData);

    startTransition(async () => {
      setResult(result ?? undefined);

      if (!result) {
        userContext.invalidate();
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action}>
          <FormContent result={result} />
          <Button onClick={onSignUpClick} type="button" variant="link">
            Sign Up
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
        Sign In
      </Button>
    </>
  );
};
