import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import * as v from "valibot";

import { AuthFields } from "./auth-fields";
import type { APIErrorBody } from "./services/router";
import { signInSchema } from "./services/validation";
import { useUserContext } from "./user-context";

type SignInFormProps = {
  onSignUpClick: () => void;
};

export const SignInForm = ({ onSignUpClick }: SignInFormProps) => {
  const userContext = useUserContext();

  const [result, setResult] = useState<APIErrorBody>();

  const action = async (formData: FormData) => {
    const result = await signInAction(formData);

    setResult(result ?? undefined);

    if (!result) {
      userContext.invalidate();
    }
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

const signInAction = async (form: FormData) => {
  const parsed = await v.safeParseAsync(signInSchema, decode(form));

  if (!parsed.success) {
    return rpcParseIssueResult(parsed.issues);
  }

  const response = await orpc.auth.signIn(parsed.output);

  if (response) {
    return response;
  }

  return null;
};
