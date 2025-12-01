import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { orpc } from "@/integrations/orpc/client";
import { rpcParseIssueResult } from "@/integrations/orpc/rpc";

import { decode } from "decode-formdata";
import { type ComponentProps, useState, useTransition } from "react";
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

  const [isPending, startTransition] = useTransition();

  const [result, setResult] = useState<APIErrorBody>();

  const onSubmit: ComponentProps<"form">["onSubmit"] = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await signInAction(formData);
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
        <form method="post" onSubmit={onSubmit}>
          <AuthFields pending={isPending} result={result} />
          <Button disabled={isPending} type="submit">
            {isPending ? <Spinner /> : null}
            Sign In
          </Button>
          <Button onClick={onSignUpClick} type="button" variant="link">
            Sign Up
          </Button>
        </form>
      </CardContent>
    </Card>
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
